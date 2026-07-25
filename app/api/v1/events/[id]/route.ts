import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/server/api/handler";
import { AppError, ok } from "@/server/api/response";
import { requirePermission } from "@/server/auth/guards";
import { PERMISSIONS } from "@/server/auth/permissions";
import { updateEventSchema } from "@/server/modules/operational/schemas";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return apiHandler(request, async () => {
    await requirePermission(PERMISSIONS.EVENT_MANAGE);
    const { id } = await context.params;
    const input = updateEventSchema.parse(await request.json());
    const current = await prisma.campusEvent.findUnique({ where: { id } });
    if (!current) throw new AppError(404, "NOT_FOUND", "Event not found.");
    return ok(
      await prisma.campusEvent.update({
        where: { id },
        data: { status: input.status },
        include: {
          organizer: { select: { id: true, name: true, email: true } },
          registrations: {
            include: {
              student: { select: { id: true, name: true, email: true } },
            },
          },
        },
      }),
    );
  });
}
