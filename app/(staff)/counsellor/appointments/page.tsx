import { CounsellorDashboardFeature } from '@/features/counsellor/components/counsellor-dashboard';
import { requirePageRole } from '@/server/auth/page-guards';

export default async function CounsellorPage() {
  await requirePageRole('COUNSELLOR', 'ADMIN');
  return <CounsellorDashboardFeature />;
}