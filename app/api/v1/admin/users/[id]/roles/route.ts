import { z } from "zod";
import { RoleCode } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/server/api/handler";
import { AppError, ok } from "@/server/api/response";
import { requirePermission } from "@/server/auth/guards";
import { PERMISSIONS } from "@/server/auth/permissions";
import { writeAudit } from "@/server/modules/audit/service";

const schema = z.object({ roles: z.array(z.nativeEnum(RoleCode)).min(1) });

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  return apiHandler(request, async (requestId) => {
    const actor = await requirePermission(PERMISSIONS.ROLE_MANAGE);
    const { id } = await context.params;
    const input = schema.parse(await request.json());
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new AppError(404, "NOT_FOUND", "User not found.");
    const roles = await prisma.role.findMany({ where: { code: { in: input.roles } } });
    if (roles.length !== new Set(input.roles).size) throw new AppError(400, "INVALID_ROLE", "One or more roles do not exist.");
    await prisma.$transaction(async (tx) => {
      await tx.userRole.deleteMany({ where: { userId: id } });
      await tx.userRole.createMany({ data: roles.map((role) => ({ userId: id, roleId: role.id, assignedById: actor.id })) });
      await tx.user.update({ where: { id }, data: { sessionVersion: { increment: 1 } } });
    });
    await writeAudit({ request, requestId, actorId: actor.id, action: "roles.replaced", entityType: "User", entityId: id, metadata: { roles: input.roles } });
    return ok({ userId: id, roles: input.roles });
  });
}
