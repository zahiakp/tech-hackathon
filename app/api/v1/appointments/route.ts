import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { apiHandler, parsePagination } from "@/server/api/handler";
import { created, paginated } from "@/server/api/response";
import { requireUser } from "@/server/auth/guards";
import { bookAppointmentSchema } from "@/server/modules/support/schemas";
import { bookAppointment } from "@/server/modules/support/service";

export async function POST(request: Request) {
  return apiHandler(request, async () => {
    const user = await requireUser();
    const input = bookAppointmentSchema.parse(await request.json());
    return created(await bookAppointment(user, input));
  });
}

export async function GET(request: Request) {
  return apiHandler(request, async () => {
    const user = await requireUser();
    const profile = await prisma.supportProfile.findUnique({ where: { userId: user.id } });
    const { page, limit, skip } = parsePagination(request.url);
    const where: Prisma.AppointmentWhereInput = user.roles.includes("ADMIN") ? {} : profile ? { OR: [{ studentId: user.id }, { supportProfileId: profile.id }] } : { studentId: user.id };
    const [items, total] = await prisma.$transaction([
      prisma.appointment.findMany({ where, orderBy: { startAt: "desc" }, skip, take: limit, include: { student: { select: { id: true, name: true } }, supportProfile: { include: { user: { select: { id: true, name: true } } } }, conversation: true } }),
      prisma.appointment.count({ where }),
    ]);
    return paginated(items, { page, limit, total });
  });
}
