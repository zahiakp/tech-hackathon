'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { RoleCode } from '@/app/generated/prisma/enums';
import { StaffHeader } from '@/components/layout/staff-header';
import { StaffSidebar } from '@/components/layout/staff-sidebar';

interface SidebarContextType {
  isOpen: boolean;
  toggleSidebar: () => void;
  setIsOpen: (open: boolean) => void;
  isMobile: boolean;
}

const SidebarContext = createContext<SidebarContextType>({ isOpen: true, toggleSidebar: () => undefined, setIsOpen: () => undefined, isMobile: false });
export const useSidebar = () => useContext(SidebarContext);

type StaffShellProps = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  user: { name: string | null; email: string; roles: RoleCode[] };
};

export function StaffShell({ children, title, subtitle, user }: StaffShellProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar: () => setIsOpen((open) => !open), setIsOpen, isMobile }}>
      <div className="flex min-h-screen w-full overflow-x-hidden bg-background">
        <StaffSidebar user={user} />
        {isMobile && isOpen && <button aria-label="Close navigation" onClick={() => setIsOpen(false)} className="fixed inset-0 z-30 bg-black/50 md:hidden" />}
        <div className={`flex min-w-0 flex-1 flex-col transition-[padding] duration-300 ${isMobile ? 'pl-0' : isOpen ? 'md:pl-64' : 'md:pl-16'}`}>
          <StaffHeader title={title} subtitle={subtitle} roles={user.roles} />
          <main className="w-full max-w-full flex-1 overflow-y-auto p-3 sm:p-6 md:p-8">{children}</main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}