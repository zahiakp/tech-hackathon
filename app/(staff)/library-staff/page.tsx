import { LibraryDashboardFeature } from '@/features/library-staff/components/library-dashboard';
import { requirePageRole } from '@/server/auth/page-guards';

export default async function LibraryStaffPage() {
  await requirePageRole('LIBRARY_STAFF', 'ADMIN');
  return <LibraryDashboardFeature />;
}