import React from 'react';
import { StaffShell } from '@/components/layout/staff-shell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <StaffShell title="System Administration & Operations" subtitle="University Governance Portal">
      {children}
    </StaffShell>
  );
}
