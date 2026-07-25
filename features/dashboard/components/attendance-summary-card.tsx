import { CalendarCheck } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { AttendanceSummary } from "@/features/dashboard/types";

type AttendanceSummaryCardProps = {
  attendance: AttendanceSummary;
};

const attendanceStatus = {
  good: { label: "On track", tone: "success" },
  warning: { label: "Needs attention", tone: "warning" },
  critical: { label: "Low attendance", tone: "destructive" },
} as const;

export function AttendanceSummaryCard({
  attendance,
}: AttendanceSummaryCardProps) {
  const status = attendanceStatus[attendance.status];

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck className="size-4 text-primary" aria-hidden="true" />
              Attendance
            </CardTitle>
            <CardDescription>Overall class attendance</CardDescription>
          </div>
          <StatusBadge label={status.label} tone={status.tone} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-3xl font-bold tracking-tight">
            {attendance.percentage}%
          </p>
          <p className="text-sm text-muted-foreground">
            {attendance.presentClasses} of {attendance.totalClasses} classes
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium">Semester progress</span>
            <span className="tabular-nums text-muted-foreground">
              {attendance.percentage}%
            </span>
          </div>
          <Progress value={attendance.percentage} />
        </div>
      </CardContent>
    </Card>
  );
}
