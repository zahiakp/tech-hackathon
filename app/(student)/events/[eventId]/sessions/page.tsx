import { Clock3, MapPin, Mic2 } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { eventSessions, eventsPreviewData } from "@/lib/mock-data/events";

export default async function EventSessionsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = eventsPreviewData.find((item) => item.id === eventId);
  const sessions = eventSessions.filter((item) => item.eventId === eventId);
  if (!event) return <EmptyState title="Event not found" description="No preview event matches this address." />;
  return (
    <div className="grid gap-6">
      <PageHeader description={`Plan your day at ${event.title}.`} eyebrow="Event programme" title="Sub-sessions" />
      <div className="grid gap-4">
        {sessions.map((session) => <Card key={session.id}><CardHeader><CardTitle>{session.title}</CardTitle></CardHeader><CardContent className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-3"><p className="flex items-center gap-2"><Clock3 className="size-4" />{session.time}</p><p className="flex items-center gap-2"><Mic2 className="size-4" />{session.speaker}</p><p className="flex items-center gap-2"><MapPin className="size-4" />{session.venue}</p></CardContent></Card>)}
      </div>
    </div>
  );
}
