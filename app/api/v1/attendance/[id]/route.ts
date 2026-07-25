import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/server/api/handler";
import { AppError, ok } from "@/server/api/response";
import { requirePermission } from "@/server/auth/guards";
import { PERMISSIONS } from "@/server/auth/permissions";
import { updateAttendanceSchema } from "@/server/modules/operational/schemas";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return apiHandler(request, async () => {
    const user = await requirePermission(PERMISSIONS.ATTENDANCE_MANAGE);
    const { id } = await context.params;
    const input = updateAttendanceSchema.parse(await request.json());
    const current = await prisma.attendanceSession.findUnique({
      where: { id },
      select: { facultyId: true },
    });
    if (!current) throw new AppError(404, "NOT_FOUND", "Attendance session not found.");
    if (!user.roles.includes("ADMIN") && current.facultyId !== user.id) {
      throw new AppError(403, "FORBIDDEN", "You cannot edit this attendance session.");
    }

    await prisma.$transaction(async (tx) => {
      if (input.qrActive !== undefined) {
        await tx.attendanceSession.update({
          where: { id },
          data: { qrActive: input.qrActive },
        });
      }
      for (const entry of input.entries ?? []) {
        await tx.attendanceEntry.update({
          where: {
            sessionId_studentId: { sessionId: id, studentId: entry.studentId },
          },
          data: { status: entry.status },
        });
      }
    });

    const session = await prisma.attendanceSession.findUniqueOrThrow({
      where: { id },
      include: {
        faculty: { select: { id: true, name: true, email: true } },
        entries: {
          include: {
            student: {
              select: { id: true, name: true, email: true, profile: true },
            },
          },
          orderBy: { student: { name: "asc" } },
        },
      },
    });
    return ok(session);
  });
}
