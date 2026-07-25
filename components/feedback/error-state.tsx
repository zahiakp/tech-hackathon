import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Failed to load system data',
  message = 'An unexpected error occurred while communicating with the management server. Please try again.',
  description,
  onRetry,
}: ErrorStateProps) {
  const displayMessage = description ?? message;

  return (
    <Alert variant="destructive" className="border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-300 p-6">
      <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
      <div className="ml-3">
        <AlertTitle className="text-base font-semibold">{title}</AlertTitle>
        <AlertDescription className="mt-1 text-sm text-rose-700 dark:text-rose-300/90">{displayMessage}</AlertDescription>
        {onRetry && (
          <Button
            onClick={onRetry}
            size="sm"
            variant="outline"
            className="mt-4 border-rose-500/30 bg-white dark:bg-zinc-900 text-rose-700 dark:text-rose-300 hover:bg-rose-500/10"
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5" /> Retry Request
          </Button>
        )}
      </div>
    </Alert>
  );
}
