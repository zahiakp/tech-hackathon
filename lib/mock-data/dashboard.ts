import type { DashboardData } from "@/features/dashboard/types";

export const dashboardPreviewData: DashboardData = {
  announcements: [
    {
      id: "announcement-1",
      title: "Semester registration closes this week",
      summary:
        "Complete course registration before Friday to avoid a late submission.",
      postedAt: "Today, 9:30 AM",
      priority: "important",
    },
    {
      id: "announcement-2",
      title: "Library extended hours",
      summary:
        "The central library will remain open until 9 PM during assessment week.",
      postedAt: "Yesterday",
      priority: "normal",
    },
  ],
  attendance: {
    percentage: 82,
    presentClasses: 74,
    totalClasses: 90,
    status: "good",
  },
  events: [
    {
      id: "event-1",
      title: "Campus Innovation Meetup",
      date: "29 Jul",
      time: "3:30 PM",
      location: "Main Auditorium",
      status: "upcoming",
    },
    {
      id: "event-2",
      title: "Inter-department Football",
      date: "02 Aug",
      time: "4:00 PM",
      location: "College Ground",
      status: "upcoming",
    },
  ],
  points: {
    balance: 1240,
    earnedThisWeek: 85,
    nextMilestone: 1500,
  },
  borrowedBooks: [
    {
      id: "book-1",
      title: "Clean Architecture",
      author: "Robert C. Martin",
      dueDate: "31 Jul",
      status: "borrowed",
    },
    {
      id: "book-2",
      title: "Designing Data-Intensive Applications",
      author: "Martin Kleppmann",
      dueDate: "27 Jul",
      status: "due-soon",
    },
  ],
  complaintUpdates: [
    {
      id: "complaint-1",
      reference: "CMP-1042",
      category: "Campus facilities",
      updatedAt: "Updated 2 hours ago",
      status: "in-review",
    },
  ],
  mentorAppointments: [
    {
      id: "appointment-1",
      mentorName: "Dr. Meera Nair",
      purpose: "Academic guidance",
      date: "30 Jul",
      time: "11:30 AM",
      status: "confirmed",
    },
  ],
  emergencyShortcuts: [
    {
      id: "emergency-1",
      title: "Emergency SOS",
      description: "Alert the campus emergency response team.",
      kind: "sos",
      href: "/sos",
    },
    {
      id: "emergency-2",
      title: "Campus security",
      description: "Reach the campus security desk quickly.",
      kind: "security",
      href: "/sos/contacts",
    },
    {
      id: "emergency-3",
      title: "Medical support",
      description: "Request help from the campus medical centre.",
      kind: "medical",
      href: "/sos/contacts",
    },
  ],
};
