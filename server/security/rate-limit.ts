import { prisma } from "@/lib/prisma";
import { AppError } from "@/server/api/response";

export async function enforceRateLimit(
  key: string,
  limit: number,
  windowMs: number,
) {
  const now = new Date();
  const existing = await prisma.rateLimitBucket.findUnique({ where: { key } });

  if (!existing || existing.expiresAt <= now) {
    await prisma.rateLimitBucket.upsert({
      where: { key },
      create: {
        key,
        count: 1,
        windowStart: now,
        expiresAt: new Date(now.getTime() + windowMs),
      },
      update: {
        count: 1,
        windowStart: now,
        expiresAt: new Date(now.getTime() + windowMs),
      },
    });
    return;
  }

  if (existing.count >= limit) {
    throw new AppError(429, "RATE_LIMITED", "Too many requests. Please try again later.");
  }

  await prisma.rateLimitBucket.update({
    where: { key },
    data: { count: { increment: 1 } },
  });
}
