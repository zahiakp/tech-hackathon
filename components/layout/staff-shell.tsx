'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { StaffSidebar } from '@/components/layout/staff-sidebar';
import { StaffHeader } from '@/components/layout/staff-header';

interface SidebarContextType {
  isOpen: boolean;
  toggleSidebar: () => void;
  setIsOpen: (open: boolean) => void;
  isMobile: boolean;
}

const SidebarContext = createContext<SidebarContextType>({
  isOpen: true,
  toggleSidebar: () => {},
  setIsOpen: () => {},
  isMobile: false,
});

export const useSidebar = () => useContext(SidebarContext);

interface StaffShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function StaffShell({ children, title, subtitle }: StaffShellProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar, setIsOpen, isMobile }}>
      <div className="min-h-screen bg-background flex flex-col md:flex-row w-full overflow-x-hidden">
        <StaffSidebar />
        
        {/* Mobile Backdrop */}
        {isMobile && isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity md:hidden"
          />
        )}

        <div
          className={`flex-1 flex flex-col w-full min-w-0 transition-all duration-300 ${
            isMobile
              ? 'pl-0'
              : isOpen
              ? 'md:pl-64'
              : 'md:pl-16'
          }`}
        >
          <StaffHeader title={title} subtitle={subtitle} />
          <main className="flex-1 p-3 sm:p-6 md:p-8 overflow-y-auto w-full max-w-full">
            {children}
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
