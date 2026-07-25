import { AuthShell } from "@/components/layout/auth-shell";
import { LoadingState } from "@/components/feedback/loading-state";

export default function OtpLoading() {
  return (
    <AuthShell
      badge="Loading"
      description="Preparing the verification form."
      title="Verify your account"
    >
      <LoadingState label="Loading verification form" rows={2} />
    </AuthShell>
  );
}
