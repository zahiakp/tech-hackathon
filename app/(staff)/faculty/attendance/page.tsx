import { FacultyAttendanceFeature } from '@/features/faculty/components/faculty-attendance';
import { requirePageRole } from '@/server/auth/page-guards';

export default async function FacultyAttendancePage() {
  await requirePageRole('FACULTY', 'ADMIN');
  return <FacultyAttendanceFeature />;
}