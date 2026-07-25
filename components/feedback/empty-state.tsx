import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ElementType;
}

export function EmptyState({
  title = 'No records found',
  description = 'There are no active records matching your current filter criteria.',
  actionLabel,
  onAction,
  icon: Icon = FolderOpen,
}: EmptyStateProps) {
  return (
    <Card className="border-border/40 shadow-sm">
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
          <Icon className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-sm">{description}</p>
        {actionLabel && onAction && (
          <Button onClick={onAction} variant="outline" className="mt-5 border-emerald-600/30 text-emerald-600 hover:bg-emerald-500/10">
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
