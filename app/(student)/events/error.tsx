"use client";

import { ErrorState } from "@/components/feedback/error-state";

export default function EventsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorState description="The events interface could not be displayed." onRetry={reset} title="Unable to load events" />;
}
