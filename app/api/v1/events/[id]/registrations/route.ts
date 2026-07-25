import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/server/api/handler";
import { AppError, created } from "@/server/api/response";
import { requirePermission } from "@/server/auth/guards";
import { PERMISSIONS } from "@/server/auth/permissions";
import { registerEventSchema } from "@/server/modules/operational/schemas";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return apiHandler(request, async () => {
    const user = await requirePermission(PERMISSIONS.EVENT_REGISTER);
    const { id } = await context.params;
    const input = registerEventSchema.parse(await request.json());
    const studentId =
      user.roles.includes("ADMIN") && input.studentId ? input.studentId : user.id;

    const registration = await prisma.$transaction(async (tx) => {
      const event = await tx.campusEvent.findUnique({ where: { id } });
      if (!event || event.status === "CANCELLED" || event.status === "COMPLETED") {
        throw new AppError(409, "EVENT_CLOSED", "This event is not accepting registrations.");
      }
      const reserved = await tx.eventRegistration.count({
        where: { eventId: id, status: { in: ["REGISTERED", "CHECKED_IN"] } },
      });
      return tx.eventRegistration.create({
        data: {
          eventId: id,
          studentId,
          status: reserved >= event.capacity ? "WAITLISTED" : "REGISTERED",
        },
        include: {
          student: { select: { id: true, name: true, email: true } },
        },
      });
    });
    return created(registration);
  });
}
