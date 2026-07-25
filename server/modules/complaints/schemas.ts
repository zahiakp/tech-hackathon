import { z } from "zod";

const complaintBase = z.object({
  categoryId: z.string().cuid(),
  title: z.string().trim().min(5).max(160),
  description: z.string().trim().min(10).max(5000),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
});

export const createComplaintSchema = complaintBase;
export const createAnonymousComplaintSchema = complaintBase.extend({
  contactEmail: z.string().email().transform((value) => value.trim().toLowerCase()).optional(),
});
export const trackComplaintSchema = z.object({ referenceCode: z.string().trim().min(8), trackingToken: z.string().min(32) });
export const assignComplaintSchema = z.object({ assignedToId: z.string().cuid() });
export const updateComplaintStatusSchema = z.object({
  status: z.enum(["ASSIGNED", "IN_REVIEW", "ESCALATED", "RESOLVED", "CLOSED"]),
  note: z.string().trim().max(1000).optional(),
});
export const createComplaintMessageSchema = z.object({ body: z.string().trim().min(1).max(3000), trackingToken: z.string().min(32).optional() });
export const complaintFeedbackSchema = z.object({ rating: z.number().int().min(1).max(5), comment: z.string().trim().max(1500).optional(), trackingToken: z.string().min(32).optional() });
