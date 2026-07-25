import React from 'react';
import { StaffShell } from '@/components/layout/staff-shell';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <StaffShell title="Staff Control Desk" subtitle="Departmental Management & Response Operations">
      {children}
    </StaffShell>
  );
}
