import { z } from "zod";
import {
  AttendanceMark,
  BloodRequestState,
  BloodUrgency,
  CampusEventStatus,
  CampusStartupStage,
} from "@/app/generated/prisma/enums";

const requiredText = (label: string, max = 160) =>
  z.string().trim().min(1, `${label} is required.`).max(max);

export const createAttendanceSchema = z.object({
  classCode: requiredText("Class code", 30),
  className: requiredText("Class name", 100),
  subject: requiredText("Subject", 100),
  date: z.coerce.date(),
  qrActive: z.boolean().optional().default(false),
});

export const updateAttendanceSchema = z.object({
  qrActive: z.boolean().optional(),
  entries: z
    .array(
      z.object({
        studentId: z.string().min(1),
        status: z.nativeEnum(AttendanceMark),
      }),
    )
    .max(500)
    .optional(),
});

export const createEventSchema = z.object({
  title: requiredText("Title", 140),
  description: requiredText("Description", 2000),
  category: requiredText("Category", 80),
  date: z.coerce.date(),
  venue: requiredText("Venue", 160),
  capacity: z.coerce.number().int().min(1).max(10000),
  rewardPoints: z.coerce.number().int().min(0).max(10000).default(0),
  status: z.nativeEnum(CampusEventStatus).optional().default("UPCOMING"),
});

export const updateEventSchema = z.object({
  status: z.nativeEnum(CampusEventStatus),
});

export const registerEventSchema = z.object({
  studentId: z.string().min(1).optional(),
});

export const createBookSchema = z.object({
  isbn: requiredText("ISBN", 32),
  title: requiredText("Title", 180),
  author: requiredText("Author", 140),
  category: requiredText("Category", 80),
  totalCopies: z.coerce.number().int().min(1).max(10000),
  shelfLocation: requiredText("Shelf location", 80),
});

export const issueBookSchema = z.object({
  bookId: z.string().min(1),
  borrowerEmail: z.string().trim().toLowerCase().email(),
  dueAt: z.coerce.date(),
});

export const donorSchema = z.object({
  type: z.literal("donor"),
  bloodGroup: requiredText("Blood group", 8),
  phone: requiredText("Phone", 30),
  contactConsent: z.boolean(),
  available: z.boolean().optional().default(true),
});

export const bloodRequestSchema = z.object({
  type: z.literal("request"),
  patientName: requiredText("Patient name", 120),
  bloodGroup: requiredText("Blood group", 8),
  unitsRequired: z.coerce.number().int().min(1).max(20),
  hospitalName: requiredText("Hospital", 160),
  contactNumber: requiredText("Contact number", 30),
  requiredByDate: z.coerce.date(),
  urgency: z.nativeEnum(BloodUrgency),
});

export const createBloodSchema = z.discriminatedUnion("type", [
  donorSchema,
  bloodRequestSchema,
]);

export const updateBloodRequestSchema = z.object({
  status: z.nativeEnum(BloodRequestState),
});

export const createStartupSchema = z.object({
  founderEmail: z.string().trim().toLowerCase().email().optional(),
  startupName: requiredText("Startup name", 140),
  category: requiredText("Category", 80),
  pitchSummary: requiredText("Pitch summary", 3000),
  fundingRequested: z.coerce.number().min(0).max(100000000).default(0),
  teamSize: z.coerce.number().int().min(1).max(1000).default(1),
  hiringPostsCount: z.coerce.number().int().min(0).max(1000).default(0),
});

export const updateStartupSchema = z.object({
  stage: z.nativeEnum(CampusStartupStage),
  assignedMentor: z.string().trim().max(140).nullable().optional(),
});
