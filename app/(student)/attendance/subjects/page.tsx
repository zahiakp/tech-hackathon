import { PageHeader } from "@/components/layout/page-header";
import { SubjectAttendanceList } from "@/features/attendance/components/subject-attendance-list";
import { subjectAttendancePreview } from "@/lib/mock-data/attendance";

export default function SubjectAttendancePage() {
  return <div className="grid gap-6"><PageHeader description="Compare attendance percentage with the requirement for each subject." eyebrow="Academic progress" title="Subject-wise attendance" /><SubjectAttendanceList subjects={subjectAttendancePreview} /></div>;
}
