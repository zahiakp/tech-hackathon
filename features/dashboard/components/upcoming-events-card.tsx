import { CalendarDays, MapPin } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { SectionHeader } from "@/components/shared/section-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { DashboardEvent } from "@/features/dashboard/types";

type UpcomingEventsCardProps = {
  events: DashboardEvent[];
};

export function UpcomingEventsCard({ events }: UpcomingEventsCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="border-b">
        <SectionHeader
          description="Your next campus activities"
          title="Upcoming events"
        />
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <EmptyState
            description="Registered and recommended events will appear here."
            icon={CalendarDays}
            title="No upcoming events"
          />
        ) : (
          <ul className="divide-y">
            {events.map((event) => (
              <li className="flex gap-4 py-4 first:pt-0 last:pb-0" key={event.id}>
                <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-center text-primary">
                  <span className="text-xs font-semibold leading-tight">
                    {event.date}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium leading-5">{event.title}</p>
                    <StatusBadge label={event.status} tone="info" />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{event.time}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3.5" aria-hidden="true" />
                    {event.location}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
