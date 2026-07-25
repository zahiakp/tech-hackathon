import { AlertTriangle, BookOpenCheck } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { SubjectAttendance } from "@/features/attendance/types";

export function SubjectAttendanceList({ subjects }: { subjects: SubjectAttendance[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {subjects.map((subject) => {
        const percentage = Math.round((subject.attended / subject.total) * 100);
        const low = percentage < subject.requiredPercentage;
        return (
          <Card key={subject.id}>
            <CardHeader className="flex-row items-start justify-between">
              <div>
                <p className="text-sm font-medium text-primary">{subject.code}</p>
                <CardTitle>{subject.subject}</CardTitle>
              </div>
              <StatusBadge icon={low ? AlertTriangle : BookOpenCheck} label={low ? "Below target" : "On track"} tone={low ? "destructive" : "success"} />
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="flex items-end justify-between"><p className="text-3xl font-bold">{percentage}%</p><p className="text-sm text-muted-foreground">{subject.attended} of {subject.total} classes</p></div>
              <Progress value={percentage} />
              <p className="text-xs text-muted-foreground">Required attendance: {subject.requiredPercentage}%</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
