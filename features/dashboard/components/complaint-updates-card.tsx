import { MessageSquareWarning } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { SectionHeader } from "@/components/shared/section-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ComplaintUpdate } from "@/features/dashboard/types";

type ComplaintUpdatesCardProps = {
  updates: ComplaintUpdate[];
};

const complaintStatus = {
  submitted: { label: "Submitted", tone: "muted" },
  "in-review": { label: "In review", tone: "warning" },
  resolved: { label: "Resolved", tone: "success" },
} as const;

export function ComplaintUpdatesCard({
  updates,
}: ComplaintUpdatesCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="border-b">
        <SectionHeader
          description="Recent changes to your submissions"
          title="Complaint updates"
        />
      </CardHeader>
      <CardContent>
        {updates.length === 0 ? (
          <EmptyState
            description="Status changes for submitted complaints will appear here."
            icon={MessageSquareWarning}
            title="No complaint updates"
          />
        ) : (
          <ul className="divide-y">
            {updates.map((update) => {
              const status = complaintStatus[update.status];

              return (
                <li className="space-y-2 py-4 first:pt-0 last:pb-0" key={update.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{update.category}</p>
                      <p className="text-sm text-muted-foreground">
                        Reference {update.reference}
                      </p>
                    </div>
                    <StatusBadge label={status.label} tone={status.tone} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {update.updatedAt}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
