export type DashboardPriority = "normal" | "important" | "urgent";

export type DashboardAnnouncement = {
  id: string;
  title: string;
  summary: string;
  postedAt: string;
  priority: DashboardPriority;
};

export type AttendanceSummary = {
  percentage: number;
  presentClasses: number;
  totalClasses: number;
  status: "good" | "warning" | "critical";
};

export type DashboardEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  status: "upcoming" | "ongoing";
};

export type PointsSummary = {
  balance: number;
  earnedThisWeek: number;
  nextMilestone: number;
};

export type BorrowedBook = {
  id: string;
  title: string;
  author: string;
  dueDate: string;
  status: "borrowed" | "due-soon" | "overdue";
};

export type ComplaintUpdate = {
  id: string;
  reference: string;
  category: string;
  updatedAt: string;
  status: "submitted" | "in-review" | "resolved";
};

export type MentorAppointment = {
  id: string;
  mentorName: string;
  purpose: string;
  date: string;
  time: string;
  status: "pending" | "confirmed";
};

export type EmergencyShortcut = {
  id: string;
  title: string;
  description: string;
  kind: "sos" | "security" | "medical";
  href: string;
};

export type DashboardData = {
  announcements: DashboardAnnouncement[];
  attendance: AttendanceSummary;
  events: DashboardEvent[];
  points: PointsSummary;
  borrowedBooks: BorrowedBook[];
  complaintUpdates: ComplaintUpdate[];
  mentorAppointments: MentorAppointment[];
  emergencyShortcuts: EmergencyShortcut[];
};
