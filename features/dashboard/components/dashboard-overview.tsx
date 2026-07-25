import { AnnouncementsCard } from "@/features/dashboard/components/announcements-card";
import { AttendanceSummaryCard } from "@/features/dashboard/components/attendance-summary-card";
import { BorrowedBooksCard } from "@/features/dashboard/components/borrowed-books-card";
import { ComplaintUpdatesCard } from "@/features/dashboard/components/complaint-updates-card";
import { EmergencyShortcutsCard } from "@/features/dashboard/components/emergency-shortcuts-card";
import { MentorAppointmentsCard } from "@/features/dashboard/components/mentor-appointments-card";
import { PointsSummaryCard } from "@/features/dashboard/components/points-summary-card";
import { UpcomingEventsCard } from "@/features/dashboard/components/upcoming-events-card";
import type { DashboardData } from "@/features/dashboard/types";

type DashboardOverviewProps = {
  data: DashboardData;
};

export function DashboardOverview({ data }: DashboardOverviewProps) {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <AttendanceSummaryCard attendance={data.attendance} />
        <PointsSummaryCard points={data.points} />
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-2">
        <AnnouncementsCard announcements={data.announcements} />
        <UpcomingEventsCard events={data.events} />
        <BorrowedBooksCard books={data.borrowedBooks} />
        <ComplaintUpdatesCard updates={data.complaintUpdates} />
      </div>

      <MentorAppointmentsCard appointments={data.mentorAppointments} />
      <EmergencyShortcutsCard shortcuts={data.emergencyShortcuts} />
    </div>
  );
}
