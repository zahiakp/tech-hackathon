import { hash } from "bcryptjs";
import type { OtpPurpose } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/server/api/response";
import { env } from "@/server/config/env";
import { sendEmail } from "@/server/integrations/email";
import { writeAudit } from "@/server/modules/audit/service";
import { numericOtp, randomToken, safeEqual, sha256 } from "@/server/security/crypto";

function otpHash(email: string, purpose: OtpPurpose, code: string) {
  return sha256(`${email}:${purpose}:${code}:${env.AUTH_SECRET ?? "development"}`);
}

export async function requestOtp(email: string, purpose: OtpPurpose) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { sent: true };
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) {
    throw new AppError(503, "EMAIL_NOT_CONFIGURED", "Email delivery is not configured.");
  }

  const code = numericOtp();
  await prisma.$transaction([
    prisma.otpChallenge.updateMany({
      where: { email, purpose, usedAt: null },
      data: { usedAt: new Date() },
    }),
    prisma.otpChallenge.create({
      data: {
        userId: user.id,
        email,
        purpose,
        tokenHash: otpHash(email, purpose, code),
        expiresAt: new Date(Date.now() + 10 * 60_000),
      },
    }),
  ]);

  await sendEmail({
    to: email,
    subject: purpose === "PASSWORD_RESET" ? "Your password reset code" : "Verify your email",
    html: `<p>Your verification code is:</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">${code}</p><p>This code expires in 10 minutes.</p>`,
  });
  return { sent: true };
}

export async function verifyOtp(email: string, purpose: OtpPurpose, code: string) {
  const challenge = await prisma.otpChallenge.findFirst({
    where: { email, purpose, usedAt: null },
    orderBy: { createdAt: "desc" },
  });
  if (!challenge || challenge.expiresAt <= new Date() || challenge.attempts >= 5) {
    throw new AppError(400, "OTP_INVALID", "The code is invalid or expired.");
  }

  if (!safeEqual(challenge.tokenHash, otpHash(email, purpose, code))) {
    await prisma.otpChallenge.update({
      where: { id: challenge.id },
      data: { attempts: { increment: 1 } },
    });
    throw new AppError(400, "OTP_INVALID", "The code is invalid or expired.");
  }

  const resetToken = purpose === "PASSWORD_RESET" ? randomToken() : null;
  await prisma.$transaction(async (tx) => {
    await tx.otpChallenge.update({ where: { id: challenge.id }, data: { usedAt: new Date() } });
    if (purpose === "EMAIL_VERIFICATION" && challenge.userId) {
      await tx.user.update({ where: { id: challenge.userId }, data: { emailVerified: new Date() } });
    }
    if (resetToken && challenge.userId) {
      await tx.passwordResetToken.create({
        data: {
          userId: challenge.userId,
          tokenHash: sha256(resetToken),
          expiresAt: new Date(Date.now() + 15 * 60_000),
        },
      });
    }
  });
  return resetToken ? { verified: true, resetToken } : { verified: true };
}

export async function resetPassword(token: string, password: string, requestId?: string) {
  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash: sha256(token) } });
  if (!record || record.usedAt || record.expiresAt <= new Date()) {
    throw new AppError(400, "RESET_TOKEN_INVALID", "The reset token is invalid or expired.");
  }

  const passwordHash = await hash(password, 12);
  await prisma.$transaction([
    prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash, sessionVersion: { increment: 1 } },
    }),
  ]);
  await writeAudit({
    actorId: record.userId,
    action: "auth.password_reset",
    entityType: "User",
    entityId: record.userId,
    requestId,
  });
  return { reset: true };
}
