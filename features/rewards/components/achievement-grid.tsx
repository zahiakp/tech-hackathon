import { Award, LockKeyhole } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { AchievementBadge } from "@/features/rewards/types";
import { cn } from "@/lib/utils";

export function AchievementGrid({ badges }: { badges: AchievementBadge[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {badges.map((badge) => {
        const earned = badge.progress === 100;
        return <Card className={cn(!earned && "opacity-80")} key={badge.id}><CardHeader className="flex-row items-start"><span className={cn("grid size-12 place-items-center rounded-full", earned ? "bg-amber-500/15 text-amber-600" : "bg-muted text-muted-foreground")}>{earned ? <Award /> : <LockKeyhole />}</span><div className="flex-1"><div className="flex items-start justify-between gap-2"><CardTitle>{badge.title}</CardTitle><StatusBadge label={earned ? "Earned" : "In progress"} tone={earned ? "success" : "muted"} /></div><CardDescription>{badge.description}</CardDescription></div></CardHeader><CardContent className="grid gap-2"><Progress value={badge.progress} /><div className="flex justify-between text-xs text-muted-foreground"><span>{badge.progress}% complete</span>{badge.earnedAt && <span>{badge.earnedAt}</span>}</div></CardContent></Card>;
      })}
    </div>
  );
}
