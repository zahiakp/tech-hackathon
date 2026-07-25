import type { AppointmentStatus } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/server/api/response";
import type { AccessContext } from "@/server/auth/guards";
import { publishRealtime } from "@/server/integrations/pusher";
import { writeAudit } from "@/server/modules/audit/service";
import { createNotification } from "@/server/modules/notifications/service";

export async function upsertSupportProfile(user: AccessContext, input: { type: "MENTOR" | "COUNSELLOR"; specialties: string[]; languages: string[]; bio?: string }) {
  if (input.type === "COUNSELLOR" && !user.roles.some((role) => role === "COUNSELLOR" || role === "ADMIN")) {
    throw new AppError(403, "FORBIDDEN", "Only counsellors can create counsellor profiles.");
  }
  if (input.type === "MENTOR" && !user.roles.some((role) => role === "STUDENT" || role === "FACULTY" || role === "ADMIN")) {
    throw new AppError(403, "FORBIDDEN", "This account cannot create a mentor profile.");
  }
  return prisma.supportProfile.upsert({
    where: { userId: user.id },
    create: { userId: user.id, ...input },
    update: input,
    include: { user: { select: { id: true, name: true, image: true, profile: true } } },
  });
}

export async function createAvailability(profileId: string, user: AccessContext, input: { startAt: Date; endAt: Date }) {
  const profile = await prisma.supportProfile.findUnique({ where: { id: profileId } });
  if (!profile) throw new AppError(404, "NOT_FOUND", "Support profile not found.");
  if (profile.userId !== user.id && !user.roles.includes("ADMIN")) throw new AppError(403, "FORBIDDEN", "You cannot manage this profile.");
  if (input.startAt <= new Date()) throw new AppError(400, "INVALID_TIME", "Availability must be in the future.");
  return prisma.availabilitySlot.create({ data: { supportProfileId: profileId, ...input } });
}

export async function createSupportRequest(user: AccessContext, input: { subject: string; description?: string; urgency: "LOW" | "MEDIUM" | "HIGH" | "URGENT" }) {
  return prisma.supportRequest.create({ data: { studentId: user.id, ...input } });
}

export async function bookAppointment(user: AccessContext, input: { slotId: string; supportRequestId?: string; notes?: string }) {
  const slot = await prisma.availabilitySlot.findUnique({ where: { id: input.slotId }, include: { supportProfile: true } });
  if (!slot || slot.startAt <= new Date()) throw new AppError(404, "SLOT_NOT_AVAILABLE", "The selected slot is not available.");
  if (input.supportRequestId) {
    const request = await prisma.supportRequest.findUnique({ where: { id: input.supportRequestId } });
    if (!request || request.studentId !== user.id) throw new AppError(400, "INVALID_SUPPORT_REQUEST", "The support request is invalid.");
  }

  const appointment = await prisma.$transaction(async (tx) => {
    const claimed = await tx.availabilitySlot.updateMany({ where: { id: slot.id, booked: false }, data: { booked: true } });
    if (!claimed.count) throw new AppError(409, "SLOT_ALREADY_BOOKED", "This slot was booked by another user.");
    const created = await tx.appointment.create({
      data: {
        studentId: user.id, supportProfileId: slot.supportProfileId, slotId: slot.id,
        supportRequestId: input.supportRequestId, startAt: slot.startAt, endAt: slot.endAt, notes: input.notes,
      },
    });
    if (input.supportRequestId) await tx.supportRequest.update({ where: { id: input.supportRequestId }, data: { status: "MATCHED", assignedProfileId: slot.supportProfileId } });
    const conversation = await tx.conversation.create({ data: { appointmentId: created.id } });
    await tx.conversationParticipant.createMany({ data: [
      { conversationId: conversation.id, userId: user.id },
      { conversationId: conversation.id, userId: slot.supportProfile.userId },
    ], skipDuplicates: true });
    return tx.appointment.findUniqueOrThrow({
      where: { id: created.id },
      include: { supportProfile: { include: { user: { select: { id: true, name: true, email: true } } } }, conversation: true },
    });
  });

  await createNotification({
    userId: slot.supportProfile.userId, type: "APPOINTMENT", title: "New appointment request",
    body: `${user.name ?? "A student"} requested an appointment.`, actionUrl: `/dashboard/appointments/${appointment.id}`,
    metadata: { appointmentId: appointment.id },
  });
  await publishRealtime(`private-user-${slot.supportProfile.userId}`, "appointment.updated", { id: appointment.id, status: appointment.status, startAt: appointment.startAt.toISOString() });
  return appointment;
}

export const appointmentTransitions: Record<AppointmentStatus, AppointmentStatus[]> = {
  REQUESTED: ["CONFIRMED", "CANCELLED"], CONFIRMED: ["COMPLETED", "CANCELLED", "NO_SHOW"],
  COMPLETED: [], CANCELLED: [], NO_SHOW: [],
};

export async function updateAppointmentStatus(id: string, status: AppointmentStatus, notes: string | undefined, user: AccessContext, request: Request, requestId: string) {
  const current = await prisma.appointment.findUnique({ where: { id }, include: { supportProfile: true } });
  if (!current) throw new AppError(404, "NOT_FOUND", "Appointment not found.");
  const provider = current.supportProfile.userId === user.id;
  const studentCancelling = current.studentId === user.id && status === "CANCELLED";
  if (!provider && !studentCancelling && !user.roles.includes("ADMIN")) throw new AppError(403, "FORBIDDEN", "You cannot update this appointment.");
  if (!appointmentTransitions[current.status].includes(status)) throw new AppError(409, "INVALID_STATUS_TRANSITION", `Cannot change ${current.status} to ${status}.`);
  const appointment = await prisma.$transaction(async (tx) => {
    const updated = await tx.appointment.update({ where: { id }, data: { status, notes: notes ?? current.notes } });
    if (status === "CANCELLED" && current.slotId) await tx.availabilitySlot.update({ where: { id: current.slotId }, data: { booked: false } });
    return updated;
  });
  const recipientId = user.id === current.studentId ? current.supportProfile.userId : current.studentId;
  await createNotification({ userId: recipientId, type: "APPOINTMENT", title: "Appointment updated", body: `Appointment status: ${status.toLowerCase()}.`, actionUrl: `/dashboard/appointments/${id}`, metadata: { appointmentId: id, status } });
  await Promise.all([
    publishRealtime(`private-user-${current.studentId}`, "appointment.updated", { id, status }),
    publishRealtime(`private-user-${current.supportProfile.userId}`, "appointment.updated", { id, status }),
  ]);
  await writeAudit({ request, requestId, actorId: user.id, action: "appointment.status_updated", entityType: "Appointment", entityId: id, metadata: { from: current.status, to: status } });
  return appointment;
}

export async function requireConversationAccess(conversationId: string, user: AccessContext, auditAdmin?: { request: Request; requestId: string }) {
  const participant = await prisma.conversationParticipant.findUnique({ where: { conversationId_userId: { conversationId, userId: user.id } } });
  if (participant) return;
  if (!user.roles.includes("ADMIN")) throw new AppError(403, "FORBIDDEN", "You cannot access this conversation.");
  if (auditAdmin) await writeAudit({ request: auditAdmin.request, requestId: auditAdmin.requestId, actorId: user.id, action: "chat.admin_transcript_viewed", entityType: "Conversation", entityId: conversationId });
}

export async function sendChatMessage(conversationId: string, body: string, user: AccessContext) {
  const participant = await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId: user.id } },
  });
  if (!participant) {
    throw new AppError(403, "FORBIDDEN", "Only conversation participants can send messages.");
  }
  const message = await prisma.chatMessage.create({ data: { conversationId, senderId: user.id, body }, include: { sender: { select: { id: true, name: true, image: true } } } });
  await publishRealtime(`private-conversation-${conversationId}`, "chat.message.created", {
    id: message.id, conversationId, sender: message.sender, body: message.body, createdAt: message.createdAt.toISOString(),
  });
  const recipients = await prisma.conversationParticipant.findMany({ where: { conversationId, userId: { not: user.id } }, select: { userId: true } });
  await Promise.all(recipients.map(({ userId }) => createNotification({ userId, type: "CHAT", title: "New support message", body: `${user.name ?? "A participant"} sent a message.`, actionUrl: `/dashboard/conversations/${conversationId}`, metadata: { conversationId } })));
  return message;
}

