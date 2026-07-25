import { CheckCircle2 } from "lucide-react";

import { ComplaintStatusBadge } from "@/features/complaints/components/complaint-status-badge";
import type { ComplaintTimelineItem } from "@/features/complaints/types";

type ComplaintStatusTimelineProps = {
  items: ComplaintTimelineItem[];
};

export function ComplaintStatusTimeline({
  items,
}: ComplaintStatusTimelineProps) {
  return (
    <ol className="relative grid gap-0" aria-label="Complaint status timeline">
      {items.map((item, index) => (
        <li className="relative grid grid-cols-[2rem_1fr] gap-3 pb-6 last:pb-0" key={item.id}>
          {index < items.length - 1 && (
            <span className="absolute bottom-0 left-[0.9375rem] top-8 w-px bg-border" />
          )}
          <span className="relative z-10 grid size-8 place-items-center rounded-full border bg-background text-primary">
            <CheckCircle2 className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0 space-y-1 pt-0.5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <p className="font-medium">{item.title}</p>
              <ComplaintStatusBadge status={item.status} />
            </div>
            <p className="text-sm leading-5 text-muted-foreground">
              {item.description}
            </p>
            <p className="text-xs text-muted-foreground">{item.timestamp}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
