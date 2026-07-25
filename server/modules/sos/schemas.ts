import { z } from "zod";

export const createSosSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().min(0).max(10000).optional(),
  capturedAt: z.string().datetime().transform((value) => new Date(value)),
  note: z.string().trim().max(500).optional(),
});

export const updateSosStatusSchema = z.object({
  status: z.enum(["ACKNOWLEDGED", "DISPATCHED", "RESOLVED"]),
  note: z.string().trim().max(500).optional(),
  assignedSecurityUserId: z.string().cuid().optional(),
});

export const cancelSosSchema = z.object({
  note: z.string().trim().max(500).optional(),
});
