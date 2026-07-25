'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants/routes';
import { useSidebar } from '@/components/layout/staff-shell';
import {
  ShieldAlert,
  Users,
  MessageSquareWarning,
  UserCheck,
  GraduationCap,
  CalendarDays,
  BookOpenCheck,
  HeartHandshake,
  Rocket,
  LayoutDashboard,
  Shield,
  LogOut,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  category: 'management' | 'operations' | 'academic';
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Admin Dashboard', href: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard, category: 'management' },
  { label: 'User & Roles', href: ROUTES.ADMIN_USERS, icon: Users, category: 'management' },
  { label: 'Security Desk (SOS)', href: ROUTES.SECURITY_DASHBOARD, icon: ShieldAlert, badge: 'LIVE', category: 'operations' },
  { label: 'Complaints Hub', href: ROUTES.STAFF_COMPLAINTS, icon: MessageSquareWarning, category: 'operations' },
  { label: 'Faculty Attendance', href: ROUTES.FACULTY_ATTENDANCE, icon: GraduationCap, category: 'academic' },
  { label: 'Counsellor Desk', href: ROUTES.COUNSELLOR_APPOINTMENTS, icon: UserCheck, category: 'academic' },
  { label: 'Event Organiser', href: ROUTES.ORGANISER_EVENTS, icon: CalendarDays, category: 'academic' },
  { label: 'Library Staff', href: ROUTES.LIBRARY_STAFF_DASHBOARD, icon: BookOpenCheck, category: 'management' },
  { label: 'Blood Donation', href: ROUTES.BLOOD_ADMIN_DASHBOARD, icon: HeartHandshake, category: 'operations' },
  { label: 'Startup Hub', href: ROUTES.STARTUP_ADMIN_DASHBOARD, icon: Rocket, category: 'management' },
];

export function StaffSidebar() {
  const pathname = usePathname();
  const { isOpen, toggleSidebar, setIsOpen, isMobile } = useSidebar();

  const isExpanded = isOpen || isMobile;

  return (
    <TooltipProvider delay={100}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border/60 bg-card/95 backdrop-blur-md transition-all duration-300 overflow-hidden",
          isMobile
            ? isOpen
              ? "w-64 translate-x-0 shadow-2xl"
              : "w-64 -translate-x-full"
            : isOpen
            ? "w-64 translate-x-0"
            : "w-16 translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className={cn("flex h-16 items-center border-b border-border/60 px-3", isExpanded ? "justify-between" : "justify-center")}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
              <Shield className="h-5 w-5" />
            </div>
            {isExpanded && (
              <div className="truncate transition-opacity duration-200">
                <h2 className="text-sm font-bold tracking-tight text-foreground truncate">Campus Control</h2>
                <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-widest truncate">Admin & Staff</p>
              </div>
            )}
          </div>

          {/* Open / Close Toggle Button */}
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground shrink-0"
            title={isOpen ? "Close Sidebar" : "Open Sidebar"}
          >
            {isMobile ? (
              <X className="h-4 w-4" />
            ) : isOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Nav Menu Items */}
        <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
          <div>
            {isExpanded && (
              <p className="px-3 mb-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider transition-opacity duration-200">
                Operational Modules
              </p>
            )}
            <nav className="flex flex-col space-y-1.5 w-full items-center">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
                const Icon = item.icon;

                const linkContent = (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => isMobile && setIsOpen(false)}
                    className={cn(
                      "group flex items-center rounded-lg text-xs font-medium transition-all duration-150",
                      isActive
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                      isExpanded ? "w-full justify-between px-3 py-2" : "h-10 w-10 justify-center"
                    )}
                  >
                    <div className={cn("flex items-center gap-3", !isExpanded && "justify-center")}>
                      <Icon className={cn("h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-110", isActive ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")} />
                      {isExpanded && <span className="truncate">{item.label}</span>}
                    </div>

                    {isExpanded && (
                      item.badge ? (
                        <Badge variant="destructive" className="h-4 px-1.5 text-[9px] font-bold tracking-wider animate-pulse">
                          {item.badge}
                        </Badge>
                      ) : (
                        <ChevronRight className={cn("h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100", isActive && "opacity-100 text-emerald-600")} />
                      )
                    )}
                  </Link>
                );

                if (!isExpanded) {
                  return (
                    <div key={item.href} className="w-full flex justify-center">
                      <Tooltip>
                        <TooltipTrigger className="w-full flex justify-center">
                          {linkContent}
                        </TooltipTrigger>
                        <TooltipContent side="right" className="font-semibold text-xs bg-slate-900 text-white">
                          {item.label} {item.badge ? `(${item.badge})` : ''}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  );
                }

                return linkContent;
              })}
            </nav>
          </div>
        </div>

        <Separator />

        {/* Staff Profile & Logout Footer */}
        <div className="p-3 bg-muted/30">
          <div className={cn("flex items-center gap-3", !isExpanded && "justify-center")}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 font-semibold text-xs border border-emerald-500/20">
              AD
            </div>
            {isExpanded && (
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-semibold text-foreground truncate">Admin Control</p>
                <p className="text-[10px] text-muted-foreground truncate">Staff Role: Super Admin</p>
              </div>
            )}
            {isExpanded && (
              <Link href={ROUTES.LOGIN} className="text-muted-foreground hover:text-rose-500 transition-colors p-1.5 rounded-md hover:bg-rose-500/10">
                <LogOut className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
