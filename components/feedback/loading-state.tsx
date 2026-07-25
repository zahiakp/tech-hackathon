import React from 'react';
import { LoaderCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingStateProps {
  message?: string;
  label?: string;
  className?: string;
  rows?: number;
}

export function LoadingState({ message, label = 'Loading dashboard records...', className, rows }: LoadingStateProps) {
  const displayText = message || label;

  if (rows) {
    return (
      <div aria-label={label} aria-live="polite" className={`grid gap-4 ${className || ''}`} role="status">
        <span className="sr-only">{label}</span>
        {Array.from({ length: rows }, (_, index) => (
          <div className="space-y-3 rounded-xl border p-4" key={index}>
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-7 w-2/3" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <Card className={`border-border/40 shadow-sm ${className || ''}`}>
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-400 mb-3" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">{displayText}</p>
      </CardContent>
    </Card>
  );
}
