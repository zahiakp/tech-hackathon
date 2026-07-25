import Link from "next/link";
import { AlertTriangle, CalendarCheck2, ClipboardPenLine, FilePlus2, Percent, Rows3 } from "lucide-react";

import { PreviewAlert } from "@/components/feedback/preview-alert";
import { PageHeader } from "@/components/layout/page-header";
import { DataCard } from "@/components/shared/data-card";
import { buttonVariants } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { subjectAttendancePreview } from "@/lib/mock-data/attendance";

const attendanceLinks = [
  { href: "/attendance/daily", title: "Daily attendance", description: "Review class-by-class attendance records.", icon: Rows3 },
  { href: "/attendance/subjects", title: "Subject-wise attendance", description: "Compare progress and required percentage.", icon: CalendarCheck2 },
  { href: "/attendance/leave/new", title: "Leave request", description: "Preview a new absence request.", icon: FilePlus2 },
  { href: "/attendance/corrections/new", title: "Correction request", description: "Flag an attendance record for review.", icon: ClipboardPenLine },
];

export default function AttendancePage() {
  const attended = subjectAttendancePreview.reduce((sum, subject) => sum + subject.attended, 0);
  const total = subjectAttendancePreview.reduce((sum, subject) => sum + subject.total, 0);
  const percentage = Math.round((attended / total) * 100);
  const lowSubjects = subjectAttendancePreview.filter((subject) => (subject.attended / subject.total) * 100 < subject.requiredPercentage);
  return (
    <div className="grid gap-6">
      <PageHeader action={<Link className={buttonVariants({ variant: "outline" })} href="/attendance/daily">View daily log</Link>} description="Understand your current attendance and request corrections when needed." eyebrow="Academics" title="Attendance" />
      <PreviewAlert description="Attendance records and percentages are preview data and are not connected to an academic system." />
      <div className="grid gap-4 sm:grid-cols-2">
        <DataCard title="Overall attendance" value={`${percentage}%`} description={`${attended} of ${total} recorded classes`} icon={Percent} />
        <DataCard title="Subjects below target" value={lowSubjects.length} description="Minimum target is 75%" icon={AlertTriangle} />
      </div>
      {lowSubjects.length > 0 && <Alert variant="destructive"><AlertTriangle /><AlertTitle>Low-attendance warning</AlertTitle><AlertDescription>{lowSubjects.map((subject) => subject.subject).join(", ")} currently require attention. Review subject-wise details before planning absences.</AlertDescription></Alert>}
      <div className="grid gap-4 sm:grid-cols-2">
        {attendanceLinks.map((item) => <Link className="group" href={item.href} key={item.href}><Card className="h-full transition-colors hover:border-primary/40"><CardHeader><item.icon className="size-5 text-primary" /><CardTitle>{item.title}</CardTitle><CardDescription>{item.description}</CardDescription></CardHeader></Card></Link>)}
      </div>
    </div>
  );
}
