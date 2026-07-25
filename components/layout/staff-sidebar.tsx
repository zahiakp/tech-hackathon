'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import type { RoleCode } from '@/app/generated/prisma/enums';
import { BookOpenCheck, CalendarDays, GraduationCap, HeartHandshake, LayoutDashboard, LogOut, MessageSquareWarning, PanelLeftClose, PanelLeftOpen, Rocket, Shield, ShieldAlert, UserCheck, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSidebar } from '@/components/layout/staff-shell';
import { ROUTES } from '@/lib/constants/routes';
import { cn } from '@/lib/utils';

type NavItem = { label: string; href: string; icon: React.ElementType; roles: RoleCode[] };
const NAV_ITEMS: NavItem[] = [
  { label: 'Admin dashboard', href: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard, roles: ['ADMIN'] },
  { label: 'Users and roles', href: ROUTES.ADMIN_USERS, icon: Users, roles: ['ADMIN'] },
  { label: 'Security SOS', href: ROUTES.SECURITY_DASHBOARD, icon: ShieldAlert, roles: ['SECURITY', 'ADMIN'] },
  { label: 'Complaints', href: ROUTES.STAFF_COMPLAINTS, icon: MessageSquareWarning, roles: ['COORDINATOR', 'ADMIN'] },
  { label: 'Attendance', href: ROUTES.FACULTY_ATTENDANCE, icon: GraduationCap, roles: ['FACULTY', 'ADMIN'] },
  { label: 'Counsellor desk', href: ROUTES.COUNSELLOR_APPOINTMENTS, icon: UserCheck, roles: ['COUNSELLOR', 'ADMIN'] },
  { label: 'Events', href: ROUTES.ORGANISER_EVENTS, icon: CalendarDays, roles: ['ADMIN'] },
  { label: 'Library', href: ROUTES.LIBRARY_STAFF_DASHBOARD, icon: BookOpenCheck, roles: ['LIBRARY_STAFF', 'ADMIN'] },
  { label: 'Blood donors', href: ROUTES.BLOOD_ADMIN_DASHBOARD, icon: HeartHandshake, roles: ['ADMIN'] },
  { label: 'Startups', href: ROUTES.STARTUP_ADMIN_DASHBOARD, icon: Rocket, roles: ['ADMIN'] },
];

type StaffSidebarProps = { user: { name: string | null; email: string; roles: RoleCode[] } };

export function StaffSidebar({ user }: StaffSidebarProps) {
  const pathname = usePathname();
  const { isOpen, toggleSidebar, setIsOpen, isMobile } = useSidebar();
  const expanded = isOpen || isMobile;
  const items = NAV_ITEMS.filter((item) => item.roles.some((role) => user.roles.includes(role)));

  return (
    <aside className={cn('fixed inset-y-0 left-0 z-40 flex flex-col overflow-hidden border-r bg-card transition-all', isMobile ? (isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full') : isOpen ? 'w-64' : 'w-16')}>
      <div className={cn('flex h-16 items-center border-b px-3', expanded ? 'justify-between' : 'justify-center')}><div className="flex items-center gap-3 overflow-hidden"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white"><Shield className="size-5" /></span>{expanded && <div><p className="text-sm font-bold">Voxa Control</p><p className="text-[10px] text-muted-foreground">Authorized staff</p></div>}</div><Button variant="ghost" size="icon" onClick={toggleSidebar}>{isMobile ? <X /> : isOpen ? <PanelLeftClose /> : <PanelLeftOpen />}</Button></div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-2">{items.map((item) => { const Icon = item.icon; const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href)); return <Link key={item.href} href={item.href} title={item.label} onClick={() => isMobile && setIsOpen(false)} className={cn('flex h-10 items-center rounded-lg text-sm', expanded ? 'gap-3 px-3' : 'justify-center', active ? 'bg-emerald-500/10 font-medium text-emerald-700' : 'text-muted-foreground hover:bg-muted')}><Icon className="size-4 shrink-0" />{expanded && <span>{item.label}</span>}</Link>; })}</nav>
      <Separator />
      <div className="p-3">{expanded && <div className="mb-2 min-w-0"><p className="truncate text-xs font-medium">{user.name ?? 'Staff user'}</p><p className="truncate text-[10px] text-muted-foreground">{user.email}</p></div>}<Button variant="ghost" size={expanded ? 'sm' : 'icon'} className="w-full text-rose-600" onClick={() => void signOut({ redirectTo: '/login' })}><LogOut className="size-4" />{expanded && 'Sign out'}</Button></div>
    </aside>
  );
}