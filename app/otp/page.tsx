import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AuthShell } from "@/components/layout/auth-shell";
import { OtpVerificationForm } from "@/features/auth/components/otp-verification-form";

export default async function OtpPage({
  searchParams,
}: {
  searchParams: Promise<{
    email?: string;
    purpose?: "EMAIL_VERIFICATION" | "PASSWORD_RESET";
  }>;
}) {
  const session = await auth();
  const { email = "", purpose = "PASSWORD_RESET" } = await searchParams;

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <AuthShell
      badge="Secure verification"
      description="Enter your verification code to continue securely."
      title="Verify your account"
    >
      <OtpVerificationForm email={email} purpose={purpose} />
    </AuthShell>
  );
}
