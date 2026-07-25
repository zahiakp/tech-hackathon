import React from 'react';
import { LoaderCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = 'Loading dashboard records...', className }: LoadingStateProps) {
  return (
    <Card className={`border-border/40 shadow-sm ${className || ''}`}>
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-400 mb-3" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">{message}</p>
      </CardContent>
    </Card>
  );
}
