"use client";

import { useMemo, useState } from "react";
import {
  Ban,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Radio,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";

import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import type {
  EmergencyStatus,
  EmergencyStatusPreview,
} from "@/features/sos/types";
import type { StatusTone } from "@/types/status";

type EmergencyStatusPanelProps = {
  previews: EmergencyStatusPreview[];
};

const statusAppearance: Record<
  EmergencyStatus,
  { icon: LucideIcon; tone: StatusTone; progress: number }
> = {
  pending: { icon: Clock3, tone: "warning", progress: 30 },
  active: { icon: Radio, tone: "destructive", progress: 65 },
  cancelled: { icon: Ban, tone: "muted", progress: 100 },
  failed: { icon: CircleAlert, tone: "destructive", progress: 0 },
  resolved: { icon: CheckCircle2, tone: "success", progress: 100 },
};

export function EmergencyStatusPanel({
  previews,
}: EmergencyStatusPanelProps) {
  const [status, setStatus] = useState<EmergencyStatus>("active");
  const preview = useMemo(
    () => previews.find((item) => item.status === status) ?? previews[0],
    [previews, status],
  );
  const appearance = statusAppearance[preview.status];
  const Icon = appearance.icon;

  return (
    <div className="grid gap-6">


      <Tabs
        onValueChange={(value) => setStatus(value as EmergencyStatus)}
        value={status}
      >
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:grid-cols-5">
          {previews.map((item) => (
            <TabsTrigger
              className="min-h-9 capitalize"
              key={item.status}
              value={item.status}
            >
              {item.status}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <CardTitle>{preview.title}</CardTitle>
                <CardDescription className="mt-1">
                  {preview.description}
                </CardDescription>
              </div>
            </div>
            <StatusBadge label={preview.status} tone={appearance.tone} />
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <div className="flex justify-between gap-3 text-sm">
              <span className="font-medium">Response progress</span>
              <span className="text-muted-foreground">{preview.updatedAt}</span>
            </div>
            <Progress value={appearance.progress} />
          </div>

          <div className="grid gap-3 rounded-xl border bg-muted/30 p-4">
            <p className="font-medium">What happens next</p>
            <ol className="grid gap-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                Emergency request details are reviewed.
              </li>
              <li className="flex gap-2">
                <span className="mt-1 size-2 shrink-0 rounded-full bg-border" />
                A responder acknowledges and updates the request.
              </li>
              <li className="flex gap-2">
                <span className="mt-1 size-2 shrink-0 rounded-full bg-border" />
                The incident is resolved or safely cancelled.
              </li>
            </ol>
          </div>

          {(status === "pending" || status === "active") && (
            <ConfirmDialog
              cancelLabel="Keep alert active"
              confirmLabel="Cancel false alarm"
              description="This changes only the local UI preview. A real cancellation endpoint is not connected."
              destructive
              onConfirm={() => setStatus("cancelled")}
              title="Cancel this false alarm?"
              trigger={
                <Button className="w-full sm:w-auto" variant="destructive">
                  <Ban />
                  Cancel false alarm
                </Button>
              }
            />
          )}

          {status === "failed" && (
            <Button disabled variant="outline">
              <RotateCcw />
              Retry unavailable
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
