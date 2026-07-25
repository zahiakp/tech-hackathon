export const USER_ROLES = {
  STUDENT: 'STUDENT',
  FACULTY: 'FACULTY',
  COUNSELLOR: 'COUNSELLOR',
  SECURITY: 'SECURITY',
  LIBRARY_STAFF: 'LIBRARY_STAFF',
  EVENT_ORGANISER: 'EVENT_ORGANISER',
  BLOOD_BANK_ADMIN: 'BLOOD_BANK_ADMIN',
  STARTUP_ADMIN: 'STARTUP_ADMIN',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const COMPLAINT_STATUS = {
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  ASSIGNED: 'ASSIGNED',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED',
  REOPENED: 'REOPENED',
} as const;

export type ComplaintStatus = typeof COMPLAINT_STATUS[keyof typeof COMPLAINT_STATUS];

export const SOS_STATUS = {
  TRIGGERED: 'TRIGGERED',
  DISPATCHED: 'DISPATCHED',
  ON_SCENE: 'ON_SCENE',
  RESOLVED: 'RESOLVED',
  FALSE_ALARM: 'FALSE_ALARM',
} as const;

export type SOSStatus = typeof SOS_STATUS[keyof typeof SOS_STATUS];

export const SOS_PRIORITY = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
} as const;

export type SOSPriority = typeof SOS_PRIORITY[keyof typeof SOS_PRIORITY];

export const ATTENDANCE_STATUS = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  LATE: 'LATE',
  EXCUSED: 'EXCUSED',
} as const;

export type AttendanceStatus = typeof ATTENDANCE_STATUS[keyof typeof ATTENDANCE_STATUS];

export const BOOK_STATUS = {
  AVAILABLE: 'AVAILABLE',
  ISSUED: 'ISSUED',
  RESERVED: 'RESERVED',
  MAINTENANCE: 'MAINTENANCE',
} as const;

export type BookStatus = typeof BOOK_STATUS[keyof typeof BOOK_STATUS];

export const STARTUP_STAGE = {
  APPLIED: 'APPLIED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  INCUBATING: 'INCUBATING',
  GRADUATED: 'GRADUATED',
  REJECTED: 'REJECTED',
} as const;

export type StartupStage = typeof STARTUP_STAGE[keyof typeof STARTUP_STAGE];

export const BLOOD_REQUEST_STATUS = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  FULFILLED: 'FULFILLED',
  CANCELLED: 'CANCELLED',
} as const;

export type BloodRequestStatus = typeof BLOOD_REQUEST_STATUS[keyof typeof BLOOD_REQUEST_STATUS];
