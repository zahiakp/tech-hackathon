import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { landingPathForRoles } from "@/lib/auth-landing";
import { AuthShell } from "@/components/layout/auth-shell";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export default async function ForgotPasswordPage() {
  const session = await auth();

  if (session?.user) {
    redirect(landingPathForRoles(session.user.roles));
  }

  return (
    <AuthShell
      badge="Secure recovery"
      description="Enter your account email to request a six-digit reset code."
      title="Reset your password"
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
