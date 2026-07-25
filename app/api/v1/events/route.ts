import { prisma } from "@/lib/prisma";
import { apiHandler, parsePagination } from "@/server/api/handler";
import { created, paginated } from "@/server/api/response";
import { requirePermission } from "@/server/auth/guards";
import { PERMISSIONS } from "@/server/auth/permissions";
import { createEventSchema } from "@/server/modules/operational/schemas";

const include = {
  organizer: { select: { id: true, name: true, email: true } },
  registrations: { include: { student: { select: { id: true, name: true, email: true } } }, orderBy: { createdAt: "asc" as const } },
};

export async function GET(request: Request) {
  return apiHandler(request, async () => {
    await requirePermission(PERMISSIONS.EVENT_READ);
    const { page, limit, skip } = parsePagination(request.url);
    const [items, total] = await prisma.$transaction([
      prisma.campusEvent.findMany({ include, orderBy: { date: "desc" }, skip, take: limit }),
      prisma.campusEvent.count(),
    ]);
    return paginated(items, { page, limit, total });
  });
}

export async function POST(request: Request) {
  return apiHandler(request, async () => {
    const user = await requirePermission(PERMISSIONS.EVENT_MANAGE);
    const input = createEventSchema.parse(await request.json());
    return created(await prisma.campusEvent.create({ data: { ...input, organizerId: user.id }, include }));
  });
}