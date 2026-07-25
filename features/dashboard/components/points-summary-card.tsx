import { Award, TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { PointsSummary } from "@/features/dashboard/types";

type PointsSummaryCardProps = {
  points: PointsSummary;
};

export function PointsSummaryCard({ points }: PointsSummaryCardProps) {
  const milestoneProgress = Math.min(
    100,
    Math.round((points.balance / points.nextMilestone) * 100),
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="size-4 text-primary" aria-hidden="true" />
          Current Numix
        </CardTitle>
        <CardDescription>Your campus participation balance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <p className="text-3xl font-bold tracking-tight">
            {points.balance.toLocaleString()}
          </p>
          <p className="flex items-center gap-1 text-sm font-medium text-emerald-700 dark:text-emerald-300">
            <TrendingUp className="size-4" aria-hidden="true" />
            +{points.earnedThisWeek} this week
          </p>
        </div>
        <div className="space-y-2">
          <Progress value={milestoneProgress} />
          <p className="text-xs text-muted-foreground">
            {points.nextMilestone - points.balance} Numix to the next milestone
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
