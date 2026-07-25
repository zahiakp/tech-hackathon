import { StartupAdminDashboardFeature } from '@/features/startup-admin/components/startup-admin-dashboard';
import { requirePageRole } from '@/server/auth/page-guards';

export default async function StartupAdminPage() {
  await requirePageRole('ADMIN');
  return <StartupAdminDashboardFeature />;
}