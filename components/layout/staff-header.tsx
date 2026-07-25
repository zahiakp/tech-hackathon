'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Bell, Search, ShieldAlert, PanelLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';
import { useSidebar } from '@/components/layout/staff-shell';

interface StaffHeaderProps {
  title?: string;
  subtitle?: string;
}

const ROUTE_HEADER_MAP: Record<string, { title: string; subtitle: string }> = {
  [ROUTES.ADMIN_DASHBOARD]: {
    title: 'System Analytics & Governance',
    subtitle: 'University Administration Overview & Metrics',
  },
  [ROUTES.ADMIN_USERS]: {
    title: 'User & Role Management',
    subtitle: 'Assign administrative privileges, roles, and campus access',
  },
  [ROUTES.SECURITY_DASHBOARD]: {
    title: 'Security SOS Crisis Desk',
    subtitle: 'Live panic button distress feed & GPS emergency dispatch',
  },
  [ROUTES.STAFF_COMPLAINTS]: {
    title: 'Campus Complaint Management',
    subtitle: 'Department assignment, escalation, and internal resolution notes',
  },
  [ROUTES.FACULTY_ATTENDANCE]: {
    title: 'Faculty Class Attendance',
    subtitle: 'Class selection, live QR generator & student attendance roster',
  },
  [ROUTES.COUNSELLOR_APPOINTMENTS]: {
    title: 'Mentor & Counsellor Desk',
    subtitle: 'Confidential support sessions, calendar slots & restricted notes',
  },
  [ROUTES.ORGANISER_EVENTS]: {
    title: 'Event Organiser Dashboard',
    subtitle: 'Manage campus hackathons, sub-sessions, QR scanner & reward points',
  },
  [ROUTES.LIBRARY_STAFF_DASHBOARD]: {
    title: 'Library Staff Desk',
    subtitle: 'Book catalog, copy management, issue/return desk & overdue fines',
  },
  [ROUTES.BLOOD_ADMIN_DASHBOARD]: {
    title: 'Blood Donation Admin Desk',
    subtitle: 'Verify donor registrations, approve blood requests & dispatch alerts',
  },
  [ROUTES.STARTUP_ADMIN_DASHBOARD]: {
    title: 'Startup Incubation Administration',
    subtitle: 'Review student startup applications, grant funding & assign faculty mentors',
  },
};

export function StaffHeader({ title: customTitle, subtitle: customSubtitle }: StaffHeaderProps) {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();

  const routeConfig = ROUTE_HEADER_MAP[pathname] || {
    title: customTitle || 'Staff Control Desk',
    subtitle: customSubtitle || 'University Governance & Operations Portal',
  };

  const displayTitle = customTitle || routeConfig.title;
  const displaySubtitle = customSubtitle || routeConfig.subtitle;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/60 bg-background/95 px-3 sm:px-6 md:px-8 backdrop-blur-md">
      {/* Left Section: Sidebar Toggle & Dynamic Page Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2">
        <Button
          onClick={toggleSidebar}
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-lg border-border/60 text-muted-foreground hover:text-foreground"
          title="Toggle Navigation Sidebar"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>

        <div className="min-w-0 flex-1">
          <h1 className="text-xs sm:text-sm md:text-base font-bold tracking-tight text-foreground truncate">
            {displayTitle}
          </h1>
          {displaySubtitle && (
            <p className="text-[11px] text-muted-foreground truncate hidden md:block">
              {displaySubtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Quick Search */}
        <div className="relative w-48 lg:w-64 hidden lg:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search students, SOS..."
            className="h-9 w-full rounded-lg bg-muted/50 pl-9 text-xs border-border/60 focus-visible:ring-emerald-500"
          />
        </div>

        {/* SOS Live Trigger Link */}
        <Link href={ROUTES.SECURITY_DASHBOARD}>
          <Button
            size="sm"
            variant="destructive"
            className="h-8 px-2 sm:px-3 gap-1 sm:gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs animate-pulse shrink-0"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">SOS</span>
            <Badge variant="secondary" className="h-4 px-1 text-[9px] bg-white text-rose-700 font-bold">
              1 ACTIVE
            </Badge>
          </Button>
        </Link>

        {/* Notifications Icon */}
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 rounded-lg text-muted-foreground hover:text-foreground relative"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-background"></span>
        </Button>
      </div>
    </header>
  );
}
