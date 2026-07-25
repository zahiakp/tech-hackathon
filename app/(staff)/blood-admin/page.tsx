import { BloodAdminDashboardFeature } from '@/features/blood-bank-admin/components/blood-admin-dashboard';
import { requirePageRole } from '@/server/auth/page-guards';

export default async function BloodAdminPage() {
  await requirePageRole('ADMIN');
  return <BloodAdminDashboardFeature />;
}