import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { QrCodeCard } from "@/components/shared/qr-code-card";
import { eventRegistrations, eventsPreviewData } from "@/lib/mock-data/events";

export default async function EventPassPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = eventsPreviewData.find((item) => item.id === eventId);
  const registration = eventRegistrations.find((item) => item.eventId === eventId);
  if (!event || !registration) return <EmptyState title="Entry pass unavailable" description="A confirmed preview registration is required for this event." />;
  return <div className="mx-auto grid w-full max-w-xl gap-6"><PageHeader description={`${event.date} · ${event.venue}`} eyebrow="Event entry" title={event.title} /><QrCodeCard title="QR entry pass" description="Present this preview code at the event check-in desk." reference={registration.passReference} value={`voxa:event:${event.id}:${registration.passReference}`} /></div>;
}
