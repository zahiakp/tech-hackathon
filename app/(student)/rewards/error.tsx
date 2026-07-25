"use client";

import { ErrorState } from "@/components/feedback/error-state";

export default function RewardsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorState description="The rewards interface could not be displayed." onRetry={reset} title="Unable to load rewards" />;
}
