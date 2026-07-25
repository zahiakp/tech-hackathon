"use client";

import { ErrorState } from "@/components/feedback/error-state";

export default function ComplaintsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      description="The complaints interface could not be displayed. Please try again."
      onRetry={reset}
      title="Unable to load complaints"
    />
  );
}
