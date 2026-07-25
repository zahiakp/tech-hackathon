import type { UserRole, ComplaintStatus, SOSStatus, SOSPriority, AttendanceStatus, BookStatus, StartupStage, BloodRequestStatus } from '@/lib/constants/roles';
export type { UserRole, ComplaintStatus, SOSStatus, SOSPriority, AttendanceStatus, BookStatus, StartupStage, BloodRequestStatus };



export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  campus: string;
  department?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  avatarUrl?: string;
}

export interface SOSIncident {
  id: string;
  referenceCode: string;
  studentId: string;
  studentName: string;
  studentPhone: string;
  location: string;
  coordinates: { lat: number; lng: number };
  status: SOSStatus;
  priority: SOSPriority;
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  reportedAt: string;
  resolvedAt?: string;
  notes?: string;
}

export interface ComplaintRecord {
  id: string;
  referenceNumber: string;
  title: string;
  description: string;
  category: string;
  status: ComplaintStatus;
  isAnonymous: boolean;
  studentId?: string;
  studentName?: string;
  assignedDepartment: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  createdAt: string;
  updatedAt: string;
  campus: string;
  resolutionTimeHours?: number;
  internalNotes?: { id: string; author: string; note: string; createdAt: string }[];
}

export interface CounsellorAppointment {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  appointmentDate: string;
  timeSlot: string;
  status: 'REQUESTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  topic: string;
  restrictedNotes?: string;
  followUpRequired: boolean;
}

export interface ClassAttendanceRecord {
  id: string;
  classCode: string;
  className: string;
  subject: string;
  facultyId: string;
  facultyName: string;
  date: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  qrActive: boolean;
  students: {
    studentId: string;
    studentName: string;
    rollNumber: string;
    status: AttendanceStatus;
  }[];
}

export interface EventRecord {
  id: string;
  title: string;
  description: string;
  category: string;
  organiserName: string;
  date: string;
  venue: string;
  capacity: number;
  registeredCount: number;
  attendedCount: number;
  rewardPoints: number;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  subSessions: { id: string; name: string; time: string; venue: string }[];
}

export interface LibraryBookRecord {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  issuedCopies: number;
  shelfLocation: string;
  status: BookStatus;
}

export interface LibraryIssueRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  studentId: string;
  studentName: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  fineAmount: number;
  status: 'ISSUED' | 'RETURNED' | 'OVERDUE';
}

export interface BloodRequestRecord {
  id: string;
  patientName: string;
  bloodGroup: string;
  unitsRequired: number;
  hospitalName: string;
  contactNumber: string;
  requiredByDate: string;
  urgency: 'CRITICAL' | 'URGENT' | 'STANDARD';
  status: BloodRequestStatus;
  verifiedBy?: string;
  matchedDonorsCount: number;
}

export interface StartupProfileRecord {
  id: string;
  startupName: string;
  founderName: string;
  founderEmail: string;
  category: string;
  pitchSummary: string;
  stage: StartupStage;
  fundingRequested: number;
  teamSize: number;
  assignedMentor?: string;
  submittedAt: string;
  hiringPostsCount: number;
}
