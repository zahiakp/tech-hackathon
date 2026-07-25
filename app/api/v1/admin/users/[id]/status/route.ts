import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/server/api/handler";
import { AppError, ok } from "@/server/api/response";
import { requirePermission } from "@/server/auth/guards";
import { PERMISSIONS } from "@/server/auth/permissions";
import { writeAudit } from "@/server/modules/audit/service";

const schema = z.object({ active: z.boolean() });

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return apiHandler(request, async (requestId) => {
    const actor = await requirePermission(PERMISSIONS.ROLE_MANAGE);
    const { id } = await context.params;
    const { active } = schema.parse(await request.json());

    if (actor.id === id && !active) {
      throw new AppError(
        400,
        "CANNOT_DISABLE_SELF",
        "You cannot disable your own account.",
      );
    }

    const current = await prisma.user.findUnique({ where: { id } });
    if (!current) throw new AppError(404, "NOT_FOUND", "User not found.");

    const user = await prisma.user.update({
      where: { id },
      data: {
        status: active ? "ACTIVE" : "SUSPENDED",
        sessionVersion: { increment: 1 },
      },
      select: { id: true, status: true, sessionVersion: true },
    });

    await writeAudit({
      request,
      requestId,
      actorId: actor.id,
      action: active ? "user.activated" : "user.suspended",
      entityType: "User",
      entityId: id,
      metadata: { from: current.status, to: user.status },
    });

    return ok(user);
  });
}
