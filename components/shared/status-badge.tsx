import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toUpperCase();

  const getStyle = () => {
    switch (normalized) {
      case 'CRITICAL':
      case 'TRIGGERED':
      case 'OVERDUE':
      case 'REJECTED':
      case 'ABSENT':
        return 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30';
      case 'HIGH':
      case 'UNDER_REVIEW':
      case 'PENDING':
      case 'REQUESTED':
      case 'DISPATCHED':
      case 'LATE':
        return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30';
      case 'RESOLVED':
      case 'CONFIRMED':
      case 'APPROVED':
      case 'PRESENT':
      case 'AVAILABLE':
      case 'FULFILLED':
      case 'VERIFIED':
      case 'UPCOMING':
      case 'COMPLETED':
        return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
      case 'ASSIGNED':
      case 'ON_SCENE':
      case 'INCUBATING':
      case 'ISSUED':
        return 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30';
    }
  };

  return (
    <Badge variant="outline" className={cn("px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-md border", getStyle(), className)}>
      {status.replace(/_/g, ' ')}
    </Badge>
  );
}
