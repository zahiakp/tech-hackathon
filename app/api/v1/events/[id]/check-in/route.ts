import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/server/api/handler";
import { AppError, ok } from "@/server/api/response";
import { requirePermission } from "@/server/auth/guards";
import { PERMISSIONS } from "@/server/auth/permissions";

const schema = z.object({ studentId: z.string().min(1) });

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return apiHandler(request, async () => {
    await requirePermission(PERMISSIONS.EVENT_MANAGE);
    const { id } = await context.params;
    const { studentId } = schema.parse(await request.json());
    const registration = await prisma.eventRegistration.findUnique({
      where: { eventId_studentId: { eventId: id, studentId } },
    });
    if (!registration || registration.status !== "REGISTERED") {
      throw new AppError(409, "NOT_REGISTERED", "A confirmed registration is required.");
    }
    return ok(
      await prisma.eventRegistration.update({
        where: { id: registration.id },
        data: { status: "CHECKED_IN", checkedInAt: new Date() },
      }),
    );
  });
}
