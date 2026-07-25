import { SecurityDashboardFeature } from '@/features/security/components/security-dashboard';
import { requirePageRole } from '@/server/auth/page-guards';

export default async function SecurityPage() {
  await requirePageRole('SECURITY', 'ADMIN');
  return <SecurityDashboardFeature />;
}