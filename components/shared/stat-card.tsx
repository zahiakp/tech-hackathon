import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconBgColor?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconBgColor = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  className,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden border-border/60 shadow-sm transition-all duration-200 hover:shadow-md hover:border-border", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl p-2.5 transition-transform duration-200 hover:scale-105", iconBgColor)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-foreground">{value}</span>
          {change && (
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                changeType === 'positive' && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                changeType === 'negative' && "bg-rose-500/10 text-rose-600 dark:text-rose-400",
                changeType === 'neutral' && "bg-muted text-muted-foreground"
              )}
            >
              {change}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1.5 text-xs text-muted-foreground/80">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
