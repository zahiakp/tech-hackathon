import type { LucideIcon } from "lucide-react";
import { Construction } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ModuleUnavailableProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
};

export function ModuleUnavailable({
  title,
  description,
  icon: Icon = Construction,
}: ModuleUnavailableProps) {
  return (
    <Card className="border-amber-500/30 bg-amber-500/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-amber-500/15 text-amber-700">
            <Icon className="size-5" />
          </span>
          <div>
            <Badge variant="outline">Backend module pending</Badge>
            <CardTitle className="mt-2 text-lg">{title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          This screen is intentionally read-only until its API stops returning
          501 MODULE_NOT_AVAILABLE.
        </p>
      </CardContent>
    </Card>
  );
}
