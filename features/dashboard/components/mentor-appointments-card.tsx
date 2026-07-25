import { CalendarClock, UserRound } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { SectionHeader } from "@/components/shared/section-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { MentorAppointment } from "@/features/dashboard/types";

type MentorAppointmentsCardProps = {
  appointments: MentorAppointment[];
};

export function MentorAppointmentsCard({
  appointments,
}: MentorAppointmentsCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="border-b">
        <SectionHeader
          description="Your upcoming mentor sessions"
          title="Mentor appointments"
        />
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <EmptyState
            description="Booked mentor sessions will appear here."
            icon={CalendarClock}
            title="No appointments"
          />
        ) : (
          <ul className="divide-y">
            {appointments.map((appointment) => (
              <li
                className="flex gap-3 py-4 first:pt-0 last:pb-0"
                key={appointment.id}
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <UserRound className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{appointment.mentorName}</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.purpose}
                      </p>
                    </div>
                    <StatusBadge
                      label={appointment.status}
                      tone={appointment.status === "confirmed" ? "success" : "warning"}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {appointment.date} at {appointment.time}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
