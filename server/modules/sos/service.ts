import type { SosStatus } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/server/api/response";
import type { AccessContext } from "@/server/auth/guards";
import { publishRealtime } from "@/server/integrations/pusher";
import { writeAudit } from "@/server/modules/audit/service";
import { notifyUsers } from "@/server/modules/notifications/service";

export const sosTransitions: Partial<Record<SosStatus, SosStatus[]>> = {
  OPEN: ["ACKNOWLEDGED", "CANCELLED_FALSE_ALARM"],
  ACKNOWLEDGED: ["DISPATCHED"],
  DISPATCHED: ["RESOLVED"],
};

const includeIncident = {
  creator: { select: { id: true, name: true, email: true, profile: true } },
  assignments: { include: { securityUser: { select: { id: true, name: true, email: true } } } },
  statusEvents: { orderBy: { createdAt: "asc" as const }, include: { actor: { select: { id: true, name: true } } } },
};

export function canReadAllSos(user: AccessContext) {
  return user.roles.includes("SECURITY") || user.roles.includes("ADMIN");
}

export async function createSos(
  user: AccessContext,
  input: { latitude: number; longitude: number; accuracy?: number; capturedAt: Date; note?: string },
  request: Request,
  requestId: string,
) {
  const incident = await prisma.$transaction(async (tx) => {
    const created = await tx.sosIncident.create({ data: { creatorId: user.id, ...input } });
    await tx.sosStatusEvent.create({ data: { incidentId: created.id, toStatus: "OPEN", actorId: user.id } });
    return tx.sosIncident.findUniqueOrThrow({ where: { id: created.id }, include: includeIncident });
  });

  const responders = await prisma.userRole.findMany({
    where: { role: { code: { in: ["SECURITY", "ADMIN"] } }, user: { status: "ACTIVE" } },
    select: { userId: true },
  });
  const responderIds = [...new Set(responders.map(({ userId }) => userId))];
  await notifyUsers(responderIds, {
    type: "SOS",
    title: "New SOS incident",
    body: `${user.name ?? "A campus member"} requested emergency assistance.`,
    actionUrl: `/dashboard/sos/${incident.id}`,
    metadata: { incidentId: incident.id },
  });
  await publishRealtime("private-security", "sos.created", {
    id: incident.id,
    creator: incident.creator,
    status: incident.status,
    latitude: incident.latitude,
    longitude: incident.longitude,
    accuracy: incident.accuracy,
    capturedAt: incident.capturedAt.toISOString(),
    createdAt: incident.createdAt.toISOString(),
  });
  await writeAudit({ request, requestId, actorId: user.id, action: "sos.created", entityType: "SosIncident", entityId: incident.id });
  return incident;
}

export async function getSos(id: string, user: AccessContext) {
  const incident = await prisma.sosIncident.findUnique({ where: { id }, include: includeIncident });
  if (!incident) throw new AppError(404, "NOT_FOUND", "SOS incident not found.");
  if (!canReadAllSos(user) && incident.creatorId !== user.id) throw new AppError(403, "FORBIDDEN", "You cannot view this incident.");
  return incident;
}

export async function updateSosStatus(
  id: string,
  user: AccessContext,
  input: { status: "ACKNOWLEDGED" | "DISPATCHED" | "RESOLVED"; note?: string; assignedSecurityUserId?: string },
  request: Request,
  requestId: string,
) {
  if (!canReadAllSos(user)) throw new AppError(403, "FORBIDDEN", "Only security staff can update incidents.");
  const current = await prisma.sosIncident.findUnique({ where: { id } });
  if (!current) throw new AppError(404, "NOT_FOUND", "SOS incident not found.");
  if (!sosTransitions[current.status]?.includes(input.status)) throw new AppError(409, "INVALID_STATUS_TRANSITION", `Cannot change ${current.status} to ${input.status}.`);

  const timestampData = input.status === "ACKNOWLEDGED" ? { acknowledgedAt: new Date() } : input.status === "DISPATCHED" ? { dispatchedAt: new Date() } : { resolvedAt: new Date() };
  const assigneeId = input.assignedSecurityUserId ?? user.id;
  const incident = await prisma.$transaction(async (tx) => {
    await tx.sosIncident.update({ where: { id }, data: { status: input.status, ...timestampData } });
    await tx.sosStatusEvent.create({ data: { incidentId: id, fromStatus: current.status, toStatus: input.status, actorId: user.id, note: input.note } });
    if (input.status === "ACKNOWLEDGED") {
      await tx.sosAssignment.upsert({
        where: { incidentId_securityUserId: { incidentId: id, securityUserId: assigneeId } },
        create: { incidentId: id, securityUserId: assigneeId, assignedById: user.id },
        update: {},
      });
    }
    return tx.sosIncident.findUniqueOrThrow({ where: { id }, include: includeIncident });
  });

  await notifyUsers([incident.creatorId], {
    type: "SOS", title: "SOS status updated", body: `Your emergency request is now ${input.status.toLowerCase().replaceAll("_", " ")}.`,
    actionUrl: `/dashboard/sos/${id}`, metadata: { incidentId: id, status: input.status },
  });
  const payload = { id, status: input.status, updatedAt: incident.updatedAt.toISOString() };
  await Promise.all([
    publishRealtime("private-security", "sos.updated", payload),
    publishRealtime(`private-user-${incident.creatorId}`, "sos.updated", payload),
  ]);
  await writeAudit({ request, requestId, actorId: user.id, action: "sos.status_updated", entityType: "SosIncident", entityId: id, metadata: { from: current.status, to: input.status } });
  return incident;
}

export async function cancelSos(id: string, user: AccessContext, note: string | undefined, request: Request, requestId: string) {
  const current = await prisma.sosIncident.findUnique({ where: { id } });
  if (!current) throw new AppError(404, "NOT_FOUND", "SOS incident not found.");
  if (current.creatorId !== user.id) throw new AppError(403, "FORBIDDEN", "Only the creator can cancel this incident.");
  if (current.status !== "OPEN") throw new AppError(409, "INVALID_STATUS_TRANSITION", "Only an open SOS can be cancelled as a false alarm.");

  const incident = await prisma.$transaction(async (tx) => {
    await tx.sosIncident.update({ where: { id }, data: { status: "CANCELLED_FALSE_ALARM", cancelledAt: new Date() } });
    await tx.sosStatusEvent.create({ data: { incidentId: id, fromStatus: "OPEN", toStatus: "CANCELLED_FALSE_ALARM", actorId: user.id, note } });
    return tx.sosIncident.findUniqueOrThrow({ where: { id }, include: includeIncident });
  });
  await publishRealtime("private-security", "sos.updated", { id, status: incident.status, updatedAt: incident.updatedAt.toISOString() });
  await writeAudit({ request, requestId, actorId: user.id, action: "sos.false_alarm_cancelled", entityType: "SosIncident", entityId: id });
  return incident;
}
