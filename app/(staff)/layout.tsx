import { StaffShell } from '@/components/layout/staff-shell';
import { requirePageUser } from '@/server/auth/page-guards';

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const user = await requirePageUser();
  return <StaffShell title="Staff Control Desk" subtitle="Departmental Management & Response Operations" user={user}>{children}</StaffShell>;
}