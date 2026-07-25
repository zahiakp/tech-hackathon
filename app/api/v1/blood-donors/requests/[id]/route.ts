import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/server/api/handler";
import { AppError, ok } from "@/server/api/response";
import { requirePermission } from "@/server/auth/guards";
import { PERMISSIONS } from "@/server/auth/permissions";
import { updateBloodRequestSchema } from "@/server/modules/operational/schemas";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return apiHandler(request, async () => {
    const user = await requirePermission(PERMISSIONS.BLOOD_REQUEST_MANAGE);
    const { id } = await context.params;
    const input = updateBloodRequestSchema.parse(await request.json());
    const current = await prisma.bloodRequest.findUnique({ where: { id } });
    if (!current) throw new AppError(404, "NOT_FOUND", "Blood request not found.");
    return ok(
      await prisma.bloodRequest.update({
        where: { id },
        data: {
          status: input.status,
          verifiedById:
            input.status === "MATCHED" || input.status === "FULFILLED"
              ? user.id
              : current.verifiedById,
        },
        include: {
          createdBy: { select: { id: true, name: true } },
          verifiedBy: { select: { id: true, name: true } },
        },
      }),
    );
  });
}
