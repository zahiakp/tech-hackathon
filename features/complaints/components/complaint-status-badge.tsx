import { StatusBadge } from "@/components/shared/status-badge";
import { complaintStatusDisplay } from "@/features/complaints/constants";
import type { ComplaintStatus } from "@/features/complaints/types";

type ComplaintStatusBadgeProps = {
  status: ComplaintStatus;
};

export function ComplaintStatusBadge({
  status,
}: ComplaintStatusBadgeProps) {
  const display = complaintStatusDisplay[status];

  return <StatusBadge label={display.label} tone={display.tone} />;
}
