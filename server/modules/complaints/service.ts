import { randomBytes } from "node:crypto";
import type { ComplaintStatus } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/server/api/response";
import type { AccessContext } from "@/server/auth/guards";
import { publishRealtime } from "@/server/integrations/pusher";
import { writeAudit } from "@/server/modules/audit/service";
import { notifyUsers } from "@/server/modules/notifications/service";
import { randomToken, safeEqual, sha256 } from "@/server/security/crypto";

const staffRoles = ["COORDINATOR", "ADMIN"] as const;
export const complaintTransitions: Partial<Record<ComplaintStatus, ComplaintStatus[]>> = {
  SUBMITTED: ["ASSIGNED", "IN_REVIEW", "ESCALATED"],
  ASSIGNED: ["IN_REVIEW", "ESCALATED", "RESOLVED"],
  IN_REVIEW: ["ESCALATED", "RESOLVED"],
  ESCALATED: ["IN_REVIEW", "RESOLVED"],
  RESOLVED: ["CLOSED", "IN_REVIEW"],
};
const complaintInclude = {
  category: true,
  reporter: { select: { id: true, name: true, email: true } },
  assignedTo: { select: { id: true, name: true, email: true } },
  attachments: { orderBy: { createdAt: "asc" as const } },
  messages: { orderBy: { createdAt: "asc" as const }, include: { author: { select: { id: true, name: true } } } },
  statusEvents: { orderBy: { createdAt: "asc" as const }, include: { actor: { select: { id: true, name: true } } } },
  feedback: true,
};

export function canManageComplaints(user: AccessContext) {
  return user.roles.some((role) => staffRoles.includes(role as (typeof staffRoles)[number]));
}

function referenceCode() {
  return `CMP-${new Date().getUTCFullYear()}-${randomBytes(4).toString("hex").toUpperCase()}`;
}

async function notifyComplaintStaff(complaintId: string, reference: string) {
  const staff = await prisma.userRole.findMany({
    where: { role: { code: { in: [...staffRoles] } }, user: { status: "ACTIVE" } }, select: { userId: true },
  });
  await notifyUsers([...new Set(staff.map(({ userId }) => userId))], {
    type: "COMPLAINT", title: "New complaint", body: `${reference} requires review.`,
    actionUrl: `/dashboard/complaints/${complaintId}`, metadata: { complaintId },
  });
}

export async function createNamedComplaint(user: AccessContext, input: { categoryId: string; title: string; description: string; priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT" }, request: Request, requestId: string) {
  const complaint = await prisma.$transaction(async (tx) => {
    const created = await tx.complaint.create({ data: { ...input, reporterId: user.id, referenceCode: referenceCode() } });
    await tx.complaintStatusEvent.create({ data: { complaintId: created.id, toStatus: "SUBMITTED", actorId: user.id } });
    return tx.complaint.findUniqueOrThrow({ where: { id: created.id }, include: complaintInclude });
  });
  await notifyComplaintStaff(complaint.id, complaint.referenceCode);
  await publishRealtime("private-complaints", "complaint.updated", { id: complaint.id, referenceCode: complaint.referenceCode, status: complaint.status });
  await writeAudit({ request, requestId, actorId: user.id, action: "complaint.created", entityType: "Complaint", entityId: complaint.id });
  return complaint;
}

export async function createAnonymousComplaint(input: { categoryId: string; title: string; description: string; priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"; contactEmail?: string }, request: Request, requestId: string) {
  const trackingToken = randomToken();
  const complaint = await prisma.$transaction(async (tx) => {
    const created = await tx.complaint.create({ data: { ...input, anonymous: true, referenceCode: referenceCode(), trackingTokenHash: sha256(trackingToken) } });
    await tx.complaintStatusEvent.create({ data: { complaintId: created.id, toStatus: "SUBMITTED" } });
    return created;
  });
  await notifyComplaintStaff(complaint.id, complaint.referenceCode);
  await publishRealtime("private-complaints", "complaint.updated", { id: complaint.id, referenceCode: complaint.referenceCode, status: complaint.status });
  await writeAudit({ request, requestId, action: "complaint.anonymous_created", entityType: "Complaint", entityId: complaint.id });
  return { id: complaint.id, referenceCode: complaint.referenceCode, trackingToken, status: complaint.status, createdAt: complaint.createdAt };
}

export async function validateAnonymousAccess(complaintId: string, token?: string) {
  if (!token) return false;
  const complaint = await prisma.complaint.findUnique({ where: { id: complaintId }, select: { trackingTokenHash: true } });
  return Boolean(complaint?.trackingTokenHash && safeEqual(complaint.trackingTokenHash, sha256(token)));
}

export async function trackComplaint(referenceCode: string, token: string, request: Request, requestId: string) {
  const complaint = await prisma.complaint.findUnique({ where: { referenceCode }, include: complaintInclude });
  if (!complaint?.trackingTokenHash || !safeEqual(complaint.trackingTokenHash, sha256(token))) throw new AppError(404, "NOT_FOUND", "Complaint not found.");
  await writeAudit({ request, requestId, action: "complaint.anonymous_viewed", entityType: "Complaint", entityId: complaint.id });
  return { ...complaint, trackingTokenHash: undefined, reporter: undefined, contactEmail: undefined };
}

export async function getComplaint(id: string, user: AccessContext) {
  const complaint = await prisma.complaint.findUnique({ where: { id }, include: complaintInclude });
  if (!complaint) throw new AppError(404, "NOT_FOUND", "Complaint not found.");
  if (!canManageComplaints(user) && complaint.reporterId !== user.id && complaint.assignedToId !== user.id) throw new AppError(403, "FORBIDDEN", "You cannot view this complaint.");
  return { ...complaint, trackingTokenHash: undefined };
}

export async function assignComplaint(id: string, assignedToId: string, user: AccessContext, request: Request, requestId: string) {
  if (!canManageComplaints(user)) throw new AppError(403, "FORBIDDEN", "Only coordinators and admins can assign complaints.");
  const assignee = await prisma.user.findFirst({ where: { id: assignedToId, status: "ACTIVE", roles: { some: { role: { code: { in: ["FACULTY", "COUNSELLOR", "COORDINATOR", "ADMIN"] } } } } } });
  if (!assignee) throw new AppError(400, "INVALID_ASSIGNEE", "The selected assignee is not eligible.");
  const current = await prisma.complaint.findUnique({ where: { id } });
  if (!current) throw new AppError(404, "NOT_FOUND", "Complaint not found.");
  const status: ComplaintStatus = current.status === "SUBMITTED" ? "ASSIGNED" : current.status;
  const complaint = await prisma.$transaction(async (tx) => {
    await tx.complaint.update({ where: { id }, data: { assignedToId, status } });
    if (status !== current.status) await tx.complaintStatusEvent.create({ data: { complaintId: id, fromStatus: current.status, toStatus: status, actorId: user.id, note: "Complaint assigned" } });
    return tx.complaint.findUniqueOrThrow({ where: { id }, include: complaintInclude });
  });
  await notifyUsers([assignedToId], { type: "COMPLAINT", title: "Complaint assigned", body: `${complaint.referenceCode} was assigned to you.`, actionUrl: `/dashboard/complaints/${id}`, metadata: { complaintId: id } });
  await publishComplaintUpdate(complaint);
  await writeAudit({ request, requestId, actorId: user.id, action: "complaint.assigned", entityType: "Complaint", entityId: id, metadata: { assignedToId } });
  return complaint;
}

async function publishComplaintUpdate(complaint: { id: string; reporterId: string | null; assignedToId: string | null; status: ComplaintStatus; updatedAt: Date }) {
  const payload = { id: complaint.id, status: complaint.status, updatedAt: complaint.updatedAt.toISOString() };
  const channels = [publishRealtime("private-complaints", "complaint.updated", payload)];
  if (complaint.reporterId) channels.push(publishRealtime(`private-user-${complaint.reporterId}`, "complaint.updated", payload));
  if (complaint.assignedToId) channels.push(publishRealtime(`private-user-${complaint.assignedToId}`, "complaint.updated", payload));
  await Promise.all(channels);
}

export async function updateComplaintStatus(id: string, status: ComplaintStatus, note: string | undefined, user: AccessContext, request: Request, requestId: string) {
  if (!canManageComplaints(user)) throw new AppError(403, "FORBIDDEN", "Only coordinators and admins can update complaint status.");
  const current = await prisma.complaint.findUnique({ where: { id } });
  if (!current) throw new AppError(404, "NOT_FOUND", "Complaint not found.");
  if (!complaintTransitions[current.status]?.includes(status)) throw new AppError(409, "INVALID_STATUS_TRANSITION", `Cannot change ${current.status} to ${status}.`);
  const complaint = await prisma.$transaction(async (tx) => {
    await tx.complaint.update({ where: { id }, data: { status, resolvedAt: status === "RESOLVED" ? new Date() : undefined, closedAt: status === "CLOSED" ? new Date() : undefined, escalatedAt: status === "ESCALATED" ? new Date() : undefined } });
    await tx.complaintStatusEvent.create({ data: { complaintId: id, fromStatus: current.status, toStatus: status, actorId: user.id, note } });
    return tx.complaint.findUniqueOrThrow({ where: { id }, include: complaintInclude });
  });
  if (complaint.reporterId) await notifyUsers([complaint.reporterId], { type: "COMPLAINT", title: "Complaint updated", body: `${complaint.referenceCode} is now ${status.toLowerCase().replaceAll("_", " ")}.`, actionUrl: `/dashboard/complaints/${id}`, metadata: { complaintId: id, status } });
  await publishComplaintUpdate(complaint);
  await writeAudit({ request, requestId, actorId: user.id, action: "complaint.status_updated", entityType: "Complaint", entityId: id, metadata: { from: current.status, to: status } });
  return complaint;
}

export async function addComplaintMessage(id: string, body: string, user: AccessContext | null, trackingToken: string | undefined) {
  const complaint = await prisma.complaint.findUnique({ where: { id } });
  if (!complaint) throw new AppError(404, "NOT_FOUND", "Complaint not found.");
  const anonymousAllowed = complaint.anonymous && await validateAnonymousAccess(id, trackingToken);
  const userAllowed = user && (canManageComplaints(user) || complaint.reporterId === user.id || complaint.assignedToId === user.id);
  if (!anonymousAllowed && !userAllowed) throw new AppError(403, "FORBIDDEN", "You cannot message on this complaint.");
  const message = await prisma.complaintMessage.create({ data: { complaintId: id, authorId: user?.id, body, fromStaff: Boolean(user && canManageComplaints(user)) } });
  await publishComplaintUpdate(complaint);
  return message;
}

export async function addComplaintFeedback(id: string, rating: number, comment: string | undefined, user: AccessContext | null, trackingToken: string | undefined) {
  const complaint = await prisma.complaint.findUnique({ where: { id } });
  if (!complaint) throw new AppError(404, "NOT_FOUND", "Complaint not found.");
  if (!["RESOLVED", "CLOSED"].includes(complaint.status)) throw new AppError(409, "COMPLAINT_NOT_RESOLVED", "Feedback is available after resolution.");
  const allowed = complaint.reporterId === user?.id || (complaint.anonymous && await validateAnonymousAccess(id, trackingToken));
  if (!allowed) throw new AppError(403, "FORBIDDEN", "You cannot submit feedback for this complaint.");
  return prisma.complaintFeedback.create({ data: { complaintId: id, authorId: user?.id, rating, comment } });
}
