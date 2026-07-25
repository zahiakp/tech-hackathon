import { StaffShell } from '@/components/layout/staff-shell';
import { requirePageRole } from '@/server/auth/page-guards';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requirePageRole('ADMIN');
  return <StaffShell title="System Administration & Operations" subtitle="University Governance Portal" user={user}>{children}</StaffShell>;
}