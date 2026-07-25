import { PageHeader } from "@/components/layout/page-header";
import { LeaveRequestForm } from "@/features/attendance/components/leave-request-form";

export default function NewLeaveRequestPage() {
  return <div className="grid gap-6"><PageHeader description="Provide the dates and reason for your planned absence." eyebrow="Attendance request" title="Request leave" /><LeaveRequestForm /></div>;
}
