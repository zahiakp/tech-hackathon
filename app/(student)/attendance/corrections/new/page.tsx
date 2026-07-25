import { PageHeader } from "@/components/layout/page-header";
import { CorrectionRequestForm } from "@/features/attendance/components/correction-request-form";

export default function NewCorrectionRequestPage() {
  return <div className="grid gap-6"><PageHeader description="Select an attendance record and explain the correction needed." eyebrow="Attendance request" title="Request a correction" /><CorrectionRequestForm /></div>;
}
