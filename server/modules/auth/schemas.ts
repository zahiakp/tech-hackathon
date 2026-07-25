import { z } from "zod";

export const requestOtpSchema = z.object({
  email: z.string().email().transform((value) => value.trim().toLowerCase()),
  purpose: z.enum(["EMAIL_VERIFICATION", "PASSWORD_RESET"]),
});

export const verifyOtpSchema = requestOtpSchema.extend({
  code: z.string().regex(/^\d{6}$/, "Enter the six-digit code."),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(32),
  password: z.string().min(8).max(128),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  phone: z.string().trim().max(30).nullable().optional(),
  studentId: z.string().trim().max(50).nullable().optional(),
  employeeId: z.string().trim().max(50).nullable().optional(),
  department: z.string().trim().max(100).nullable().optional(),
  course: z.string().trim().max(100).nullable().optional(),
  semester: z.number().int().min(1).max(20).nullable().optional(),
  campus: z.string().trim().max(100).nullable().optional(),
  bloodGroup: z.string().trim().max(10).nullable().optional(),
  bio: z.string().trim().max(1000).nullable().optional(),
  emergencyContactName: z.string().trim().max(100).nullable().optional(),
  emergencyContactPhone: z.string().trim().max(30).nullable().optional(),
});
