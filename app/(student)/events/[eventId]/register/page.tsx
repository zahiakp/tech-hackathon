import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { EventRegistrationForm } from "@/features/events/components/event-registration-form";
import { eventSessions, eventsPreviewData } from "@/lib/mock-data/events";

export default async function EventRegisterPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = eventsPreviewData.find((item) => item.id === eventId);
  if (!event) return <EmptyState title="Event not found" description="Registration cannot be previewed for this event." />;
  const sessions = eventSessions.filter((item) => item.eventId === event.id);
  return <div className="grid gap-6"><PageHeader description={`${event.date} · ${event.venue}`} eyebrow="Student registration" title={event.title} /><EventRegistrationForm event={event} sessions={sessions} /></div>;
}
