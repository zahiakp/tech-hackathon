"use client";

import { useMemo, useState } from "react";
import { CalendarSearch, Search } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { Input } from "@/components/ui/input";
import { EventCard } from "@/features/events/components/event-card";
import type { EventRecord } from "@/features/events/types";

export function EventList({ events }: { events: EventRecord[] }) {
  const [query, setQuery] = useState("");
  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return events;
    return events.filter((event) =>
      [event.title, event.category, event.venue].some((value) =>
        value.toLowerCase().includes(normalized),
      ),
    );
  }, [events, query]);

  return (
    <div className="grid gap-5">
      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" onChange={(event) => setQuery(event.target.value)} placeholder="Search events, categories, or venues" value={query} />
      </div>
      {visible.length ? (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {visible.map((event) => <EventCard event={event} key={event.id} />)}
        </div>
      ) : (
        <EmptyState icon={CalendarSearch} title="No matching events" description="Try a different event name, category, or venue." />
      )}
    </div>
  );
}
