import React from 'react';
import { LoaderCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface LoadingStateProps {
  message?: string;
  label?: string;
  className?: string;
}

export function LoadingState({ message, label = 'Loading dashboard records...', className }: LoadingStateProps) {
  const displayText = message || label;
  return (
    <Card className={`border-border/40 shadow-sm ${className || ''}`}>
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-400 mb-3" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">{displayText}</p>
      </CardContent>
    </Card>
  );
}
