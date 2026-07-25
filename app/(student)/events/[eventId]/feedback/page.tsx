import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { EventFeedbackForm } from "@/features/events/components/event-feedback-form";
import { eventsPreviewData } from "@/lib/mock-data/events";

export default async function EventFeedbackPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = eventsPreviewData.find((item) => item.id === eventId);
  if (!event) return <EmptyState title="Event not found" description="Feedback cannot be previewed for this event." />;
  return <div className="grid gap-6"><PageHeader description="Share a rating and optional comments about your event experience." eyebrow="Event feedback" title={event.title} /><EventFeedbackForm /></div>;
}
