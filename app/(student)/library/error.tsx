"use client";

import { ErrorState } from "@/components/feedback/error-state";

export default function LibraryError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorState description="The library interface could not be displayed." onRetry={reset} title="Unable to load library" />;
}
