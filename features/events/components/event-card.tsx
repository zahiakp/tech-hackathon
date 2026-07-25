import Link from "next/link";
import { CalendarDays, MapPin, UsersRound } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { EventRecord } from "@/features/events/types";
import { cn } from "@/lib/utils";

export function EventCard({ event }: { event: EventRecord }) {
  const tone = event.registrationStatus === "open" ? "success" : event.registrationStatus === "closing soon" ? "warning" : "muted";
  return (
    <Card className="overflow-hidden">
      <div className={cn("h-24 bg-gradient-to-br", event.imageTone)} />
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-primary">{event.category}</p>
            <CardTitle>{event.title}</CardTitle>
          </div>
          <StatusBadge label={event.registrationStatus} tone={tone} />
        </div>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm text-muted-foreground">
        <p className="flex items-center gap-2"><CalendarDays className="size-4" />{event.date} · {event.time}</p>
        <p className="flex items-center gap-2"><MapPin className="size-4" />{event.venue}</p>
        <p className="flex items-center gap-2"><UsersRound className="size-4" />{event.seatsLeft ? `${event.seatsLeft} seats remaining` : "Registration closed"}</p>
      </CardContent>
      <CardFooter>
        <Link className={buttonVariants({ variant: "outline", className: "w-full" })} href={`/events/${event.id}`}>View details</Link>
      </CardFooter>
    </Card>
  );
}
