import type {
  DailyAttendanceRecord,
  SubjectAttendance,
} from "@/features/attendance/types";

export const dailyAttendancePreview: DailyAttendanceRecord[] = [
  { id: "daily-01", date: "25 Jul 2026", day: "Today", subject: "Data Structures", time: "9:00 AM", status: "present" },
  { id: "daily-02", date: "25 Jul 2026", day: "Today", subject: "Database Systems", time: "11:00 AM", status: "late" },
  { id: "daily-03", date: "25 Jul 2026", day: "Today", subject: "Software Engineering", time: "2:00 PM", status: "present" },
  { id: "daily-04", date: "24 Jul 2026", day: "Yesterday", subject: "Computer Networks", time: "10:00 AM", status: "absent" },
  { id: "daily-05", date: "24 Jul 2026", day: "Yesterday", subject: "Professional Skills", time: "1:00 PM", status: "excused" },
];

export const subjectAttendancePreview: SubjectAttendance[] = [
  { id: "subject-01", code: "CS401", subject: "Data Structures", attended: 32, total: 36, requiredPercentage: 75 },
  { id: "subject-02", code: "CS402", subject: "Database Systems", attended: 27, total: 36, requiredPercentage: 75 },
  { id: "subject-03", code: "CS403", subject: "Software Engineering", attended: 30, total: 34, requiredPercentage: 75 },
  { id: "subject-04", code: "CS404", subject: "Computer Networks", attended: 23, total: 34, requiredPercentage: 75 },
];
