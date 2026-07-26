import Link from "next/link";
import { CalendarPlus, Video } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supportAppointments, supportPeople } from "@/lib/mock-data/support";

export default function AppointmentsPage() {
  return (
    <div className="grid gap-6">
      <PageHeader
        action={<Link className={buttonVariants()} href="/support/appointments/new"><CalendarPlus />Book appointment</Link>}
        description="Review upcoming and completed mentor or counsellor conversations."
        eyebrow="Student care"
        title="My appointments"
      />

      <div className="grid gap-4 md:grid-cols-2">
        {supportAppointments.map((appointment) => {
          const person = supportPeople.find((item) => item.id === appointment.personId);
          return (
            <Card key={appointment.id}>
              <CardHeader className="flex-row items-start justify-between">
                <div>
                  <CardTitle>{person?.name ?? "Support professional"}</CardTitle>
                  <p className="text-sm text-muted-foreground">{person?.specialty}</p>
                </div>
                <StatusBadge label={appointment.status} tone={appointment.status === "confirmed" ? "success" : "muted"} />
              </CardHeader>
              <CardContent className="grid gap-2 text-sm">
                <p className="font-medium">{appointment.date} · {appointment.time}</p>
                <p className="flex items-center gap-2 text-muted-foreground"><Video className="size-4" />{appointment.mode}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
