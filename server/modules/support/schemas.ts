import { z } from "zod";

export const supportProfileSchema = z.object({
  type: z.enum(["MENTOR", "COUNSELLOR"]),
  specialties: z.array(z.string().trim().min(2).max(80)).max(20).default([]),
  languages: z.array(z.string().trim().min(2).max(40)).max(10).default([]),
  bio: z.string().trim().max(1500).optional(),
});
export const availabilitySchema = z.object({
  startAt: z.string().datetime().transform((value) => new Date(value)),
  endAt: z.string().datetime().transform((value) => new Date(value)),
}).refine((value) => value.endAt > value.startAt, { message: "End time must be after start time.", path: ["endAt"] });
export const supportRequestSchema = z.object({
  subject: z.string().trim().min(4).max(160),
  description: z.string().trim().max(3000).optional(),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
});
export const bookAppointmentSchema = z.object({
  slotId: z.string().cuid(),
  supportRequestId: z.string().cuid().optional(),
  notes: z.string().trim().max(1000).optional(),
});
export const appointmentStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"]),
  notes: z.string().trim().max(1000).optional(),
});
export const chatMessageSchema = z.object({ body: z.string().trim().min(1).max(5000) });
