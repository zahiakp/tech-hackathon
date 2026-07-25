import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DataCardProps = {
  title: string;
  value: ReactNode;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
};

export function DataCard({
  title,
  value,
  description,
  icon: Icon,
  action,
  className,
}: DataCardProps) {
  return (
    <Card className={cn("min-w-0", className)}>
      <CardHeader>
        <div className="flex items-center gap-2 text-muted-foreground">
          {Icon && <Icon className="size-4" aria-hidden="true" />}
          <CardTitle className="text-sm">{title}</CardTitle>
        </div>
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        {description && <CardDescription>{description}</CardDescription>}
      </CardContent>
    </Card>
  );
}
