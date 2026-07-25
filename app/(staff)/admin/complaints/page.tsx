import { ComplaintDashboardFeature } from '@/features/complaint-management/components/complaint-dashboard';
import { requirePageRole } from '@/server/auth/page-guards';

export default async function StaffComplaintsPage() {
  await requirePageRole('COORDINATOR', 'ADMIN');
  return <ComplaintDashboardFeature />;
}