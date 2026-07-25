import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/server/api/handler";
import { AppError, ok } from "@/server/api/response";
import { requirePermission } from "@/server/auth/guards";
import { PERMISSIONS } from "@/server/auth/permissions";
import { updateStartupSchema } from "@/server/modules/operational/schemas";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return apiHandler(request, async () => {
    const user = await requirePermission(PERMISSIONS.STARTUP_MANAGE);
    const { id } = await context.params;
    const input = updateStartupSchema.parse(await request.json());
    const current = await prisma.campusStartup.findUnique({ where: { id } });
    if (!current) throw new AppError(404, "NOT_FOUND", "Startup not found.");
    return ok(
      await prisma.campusStartup.update({
        where: { id },
        data: {
          stage: input.stage,
          assignedMentor: input.assignedMentor,
          reviewedById: user.id,
        },
        include: {
          founder: {
            select: { id: true, name: true, email: true, profile: true },
          },
          reviewedBy: { select: { id: true, name: true } },
        },
      }),
    );
  });
}
