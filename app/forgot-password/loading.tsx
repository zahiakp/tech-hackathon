import { AuthShell } from "@/components/layout/auth-shell";
import { LoadingState } from "@/components/feedback/loading-state";

export default function ForgotPasswordLoading() {
  return (
    <AuthShell
      badge="Loading"
      description="Preparing the password reset form."
      title="Reset your password"
    >
      <LoadingState label="Loading password reset form" rows={2} />
    </AuthShell>
  );
}
