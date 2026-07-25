import { StatusBadge } from "@/components/shared/status-badge";
import type { AttendanceStatus } from "@/features/attendance/types";

const statusTone = {
  present: "success",
  absent: "destructive",
  late: "warning",
  excused: "info",
} as const;

export function AttendanceStatusBadge({ status }: { status: AttendanceStatus }) {
  return <StatusBadge label={status} tone={statusTone[status]} />;
}
