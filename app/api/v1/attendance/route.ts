import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { apiHandler, parsePagination } from "@/server/api/handler";
import { created, paginated } from "@/server/api/response";
import { requirePermission } from "@/server/auth/guards";
import { PERMISSIONS } from "@/server/auth/permissions";
import { createAttendanceSchema } from "@/server/modules/operational/schemas";

const include = {
  faculty: { select: { id: true, name: true, email: true } },
  entries: {
    include: { student: { select: { id: true, name: true, email: true, profile: true } } },
    orderBy: { student: { name: "asc" as const } },
  },
};

export async function GET(request: Request) {
  return apiHandler(request, async () => {
    const user = await requirePermission(PERMISSIONS.ATTENDANCE_MANAGE);
    const { page, limit, skip } = parsePagination(request.url);
    const where: Prisma.AttendanceSessionWhereInput = user.roles.includes("ADMIN") ? {} : { facultyId: user.id };
    const [items, total] = await prisma.$transaction([
      prisma.attendanceSession.findMany({ where, include, orderBy: { date: "desc" }, skip, take: limit }),
      prisma.attendanceSession.count({ where }),
    ]);
    return paginated(items, { page, limit, total });
  });
}

export async function POST(request: Request) {
  return apiHandler(request, async () => {
    const user = await requirePermission(PERMISSIONS.ATTENDANCE_MANAGE);
    const input = createAttendanceSchema.parse(await request.json());
    const students = await prisma.user.findMany({
      where: { status: "ACTIVE", roles: { some: { role: { code: "STUDENT" } } } },
      select: { id: true },
    });
    const session = await prisma.attendanceSession.create({
      data: {
        facultyId: user.id,
        classCode: input.classCode,
        className: input.className,
        subject: input.subject,
        date: input.date,
        qrActive: input.qrActive,
        entries: { create: students.map(({ id }) => ({ studentId: id, status: "ABSENT" })) },
      },
      include,
    });
    return created(session);
  });
}