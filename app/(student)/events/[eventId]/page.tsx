import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock3, ListChecks, MapPin, Ticket } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { eventSessions, eventsPreviewData } from "@/lib/mock-data/events";

export default async function EventDetailsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = eventsPreviewData.find((item) => item.id === eventId);
  if (!event) return <EmptyState title="Event not found" description="The requested preview event does not exist." action={<Link className={buttonVariants({ variant: "outline" })} href="/events"><ArrowLeft />Back to events</Link>} />;
  const sessions = eventSessions.filter((session) => session.eventId === event.id);
  return (
    <div className="grid gap-6">
      <PageHeader action={event.registrationStatus !== "closed" ? <Link className={buttonVariants()} href={`/events/${event.id}/register`}><Ticket />Register</Link> : undefined} description={event.description} eyebrow={event.category} title={event.title} />

      <div className="grid gap-6 lg:grid-cols-[1fr_0.65fr]">
        <Card>
          <CardHeader><CardTitle>About this event</CardTitle><CardDescription>{event.description}</CardDescription></CardHeader>
          <CardContent className="grid gap-4 text-sm">
            <p className="flex items-center gap-2"><CalendarDays className="size-4 text-primary" />{event.date}</p>
            <p className="flex items-center gap-2"><Clock3 className="size-4 text-primary" />{event.time}</p>
            <p className="flex items-center gap-2"><MapPin className="size-4 text-primary" />{event.venue}</p>
            <StatusBadge label={event.registrationStatus} tone={event.registrationStatus === "open" ? "success" : event.registrationStatus === "closing soon" ? "warning" : "muted"} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Sub-sessions</CardTitle><CardDescription>{sessions.length} sessions available</CardDescription></CardHeader>
          <CardContent className="grid gap-3">
            {sessions.slice(0, 2).map((session) => <div className="rounded-lg border p-3" key={session.id}><p className="font-medium">{session.title}</p><p className="text-sm text-muted-foreground">{session.time} · {session.speaker}</p></div>)}
            <Link className={buttonVariants({ variant: "outline" })} href={`/events/${event.id}/sessions`}><ListChecks />View all sessions</Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
