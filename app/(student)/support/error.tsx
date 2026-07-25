"use client";

import { ErrorState } from "@/components/feedback/error-state";

export default function SupportError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorState description="The support interface could not be displayed." onRetry={reset} title="Unable to load support" />;
}
