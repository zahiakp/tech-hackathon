import { BookHeart, Clock3 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import type { WellbeingResource } from "@/features/support/types";

export function ResourceGrid({ resources }: { resources: WellbeingResource[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {resources.map((resource) => (
        <Card key={resource.id}>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <BookHeart className="size-5 text-primary" aria-hidden="true" />
              <StatusBadge label={resource.category} tone="info" />
            </div>
            <CardTitle>{resource.title}</CardTitle>
            <CardDescription>{resource.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock3 className="size-4" aria-hidden="true" />
            {resource.duration}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
