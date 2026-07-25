import { prisma } from "@/lib/prisma";
import { getRequestIp, hashIp } from "@/server/security/crypto";

export async function writeAudit(input: {
  request?: Request;
  requestId?: string;
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  await prisma.auditLog.create({
    data: {
      actorId: input.actorId ?? undefined,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? undefined,
      requestId: input.requestId,
      ipHash: input.request ? hashIp(getRequestIp(input.request)) : undefined,
      metadata: input.metadata as never,
    },
  });
}
