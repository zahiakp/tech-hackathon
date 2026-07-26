import Link from "next/link";
import { TicketCheck } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { buttonVariants } from "@/components/ui/button";
import { EventList } from "@/features/events/components/event-list";
import { eventsPreviewData } from "@/lib/mock-data/events";

export default function EventsPage() {
  return (
    <div className="grid gap-6">
      <PageHeader action={<Link className={buttonVariants({ variant: "outline" })} href="/events/registrations"><TicketCheck />My registrations</Link>} description="Discover campus programmes, workshops, and student activities." eyebrow="Campus life" title="Events" />

      <EventList events={eventsPreviewData} />
    </div>
  );
}
