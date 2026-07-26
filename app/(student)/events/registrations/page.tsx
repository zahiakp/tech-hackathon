import Link from "next/link";
import { Award, QrCode, Star } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { eventRegistrations, eventsPreviewData } from "@/lib/mock-data/events";

export default function EventRegistrationsPage() {
  return (
    <div className="grid gap-6">
      <PageHeader action={<Link className={buttonVariants({ variant: "outline" })} href="/events/certificates"><Award />Certificates</Link>} description="Access registered events, entry passes, and post-event actions." eyebrow="Campus events" title="My registrations" />

      <div className="grid gap-4">
        {eventRegistrations.map((registration) => {
          const event = eventsPreviewData.find((item) => item.id === registration.eventId);
          return <Card key={registration.id}><CardHeader className="flex-row items-start justify-between"><div><CardTitle>{event?.title}</CardTitle><p className="text-sm text-muted-foreground">{event?.date} · {event?.venue}</p></div><StatusBadge label={registration.status} tone={registration.status === "confirmed" ? "success" : "info"} /></CardHeader><CardContent className="flex flex-wrap gap-2">{registration.status === "confirmed" && <Link className={buttonVariants()} href={`/events/${registration.eventId}/pass`}><QrCode />Entry pass</Link>}<Link className={buttonVariants({ variant: "outline" })} href={`/events/${registration.eventId}/feedback`}><Star />Feedback</Link></CardContent></Card>;
        })}
      </div>
    </div>
  );
}
