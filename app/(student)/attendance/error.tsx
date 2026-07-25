"use client";

import { ErrorState } from "@/components/feedback/error-state";

export default function AttendanceError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorState description="The attendance interface could not be displayed." onRetry={reset} title="Unable to load attendance" />;
}
