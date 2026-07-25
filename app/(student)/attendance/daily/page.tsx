import { PreviewAlert } from "@/components/feedback/preview-alert";
import { PageHeader } from "@/components/layout/page-header";
import { DailyAttendanceList } from "@/features/attendance/components/daily-attendance-list";
import { dailyAttendancePreview } from "@/lib/mock-data/attendance";

export default function DailyAttendancePage() {
  return <div className="grid gap-6"><PageHeader description="Review the recorded status for each recent class." eyebrow="Attendance log" title="Daily attendance" /><PreviewAlert description="Daily records are typed preview data." /><DailyAttendanceList records={dailyAttendancePreview} /></div>;
}
