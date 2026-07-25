import type {
  AttendanceMark,
  BloodRequestState,
  BloodUrgency,
  CampusEventStatus,
  CampusStartupStage,
  EventRegistrationStatus,
  LibraryLoanStatus,
} from "@/app/generated/prisma/enums";

type Person = { id: string; name: string | null; email: string };

export type AttendanceSessionDto = {
  id: string;
  classCode: string;
  className: string;
  subject: string;
  date: string;
  qrActive: boolean;
  faculty: Person;
  entries: Array<{
    id: string;
    studentId: string;
    status: AttendanceMark;
    student: Person & {
      profile: { studentId: string | null; course: string | null } | null;
    };
  }>;
};

export type CampusEventDto = {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  venue: string;
  capacity: number;
  rewardPoints: number;
  status: CampusEventStatus;
  organizer: Person;
  registrations: Array<{
    id: string;
    studentId: string;
    status: EventRegistrationStatus;
    checkedInAt: string | null;
    student: Person;
  }>;
};

export type LibraryBookDto = {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
};

export type LibraryLoanDto = {
  id: string;
  dueAt: string;
  issuedAt: string;
  returnedAt: string | null;
  fineAmount: number;
  status: LibraryLoanStatus;
  book: LibraryBookDto;
  borrower: Person & {
    profile?: { studentId: string | null } | null;
  };
  issuedBy: { id: string; name: string | null };
};

export type BloodDonorDto = {
  id: string;
  bloodGroup: string;
  phone: string;
  available: boolean;
  lastDonationAt: string | null;
  user: Person;
};

export type BloodRequestDto = {
  id: string;
  patientName: string;
  bloodGroup: string;
  unitsRequired: number;
  hospitalName: string;
  contactNumber: string;
  requiredByDate: string;
  urgency: BloodUrgency;
  status: BloodRequestState;
  matchedDonors: number;
  createdBy: { id: string; name: string | null };
  verifiedBy: { id: string; name: string | null } | null;
};

export type CampusStartupDto = {
  id: string;
  startupName: string;
  category: string;
  pitchSummary: string;
  stage: CampusStartupStage;
  fundingRequested: number;
  teamSize: number;
  assignedMentor: string | null;
  hiringPostsCount: number;
  founder: Person;
  reviewedBy: { id: string; name: string | null } | null;
};
