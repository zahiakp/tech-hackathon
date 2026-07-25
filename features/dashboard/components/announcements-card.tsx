import { Bell, Megaphone } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { SectionHeader } from "@/components/shared/section-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { DashboardAnnouncement } from "@/features/dashboard/types";

type AnnouncementsCardProps = {
  announcements: DashboardAnnouncement[];
};

const priorityTone = {
  normal: "muted",
  important: "warning",
  urgent: "destructive",
} as const;

export function AnnouncementsCard({
  announcements,
}: AnnouncementsCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="border-b">
        <SectionHeader
          description="Important campus and academic updates"
          title="Announcements"
        />
      </CardHeader>
      <CardContent>
        {announcements.length === 0 ? (
          <EmptyState
            description="New campus updates will appear here."
            icon={Bell}
            title="No announcements"
          />
        ) : (
          <ul className="divide-y">
            {announcements.map((announcement) => (
              <li className="space-y-2 py-4 first:pt-0 last:pb-0" key={announcement.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Megaphone className="size-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium leading-5">{announcement.title}</p>
                      <p className="mt-1 text-sm leading-5 text-muted-foreground">
                        {announcement.summary}
                      </p>
                    </div>
                  </div>
                  <StatusBadge
                    label={announcement.priority}
                    tone={priorityTone[announcement.priority]}
                  />
                </div>
                <p className="pl-11 text-xs text-muted-foreground">
                  {announcement.postedAt}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
