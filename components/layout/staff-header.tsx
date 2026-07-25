'use client';

import Link from 'next/link';
import type { RoleCode } from '@/app/generated/prisma/enums';
import { Bell, PanelLeft, ShieldAlert } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { useSidebar } from '@/components/layout/staff-shell';
import { ROUTES } from '@/lib/constants/routes';

type StaffHeaderProps = { title?: string; subtitle?: string; roles: RoleCode[] };

export function StaffHeader({ title = 'Staff control desk', subtitle, roles }: StaffHeaderProps) {
  const { toggleSidebar } = useSidebar();
  const canViewSos = roles.includes('SECURITY') || roles.includes('ADMIN');
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-3 backdrop-blur sm:px-6 md:px-8"><div className="flex min-w-0 items-center gap-3"><Button onClick={toggleSidebar} variant="outline" size="icon" className="size-8"><PanelLeft className="size-4" /></Button><div className="min-w-0"><h1 className="truncate text-sm font-bold md:text-base">{title}</h1>{subtitle && <p className="hidden truncate text-xs text-muted-foreground md:block">{subtitle}</p>}</div></div><div className="flex items-center gap-2">{canViewSos && <Link className={buttonVariants({ size: "sm", variant: "destructive" })} href={ROUTES.SECURITY_DASHBOARD}><ShieldAlert className="size-4" /> SOS</Link>}<Button size="icon" variant="ghost" aria-label="Notifications"><Bell className="size-4" /></Button></div></header>
  );
}