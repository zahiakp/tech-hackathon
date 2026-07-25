export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export type DailyAttendanceRecord = {
  id: string;
  date: string;
  day: string;
  subject: string;
  time: string;
  status: AttendanceStatus;
};

export type SubjectAttendance = {
  id: string;
  code: string;
  subject: string;
  attended: number;
  total: number;
  requiredPercentage: number;
};
