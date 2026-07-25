import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { apiHandler, parsePagination } from "@/server/api/handler";
import { created, paginated } from "@/server/api/response";
import { requireUser } from "@/server/auth/guards";
import { supportRequestSchema } from "@/server/modules/support/schemas";
import { createSupportRequest } from "@/server/modules/support/service";

export async function POST(request: Request) {
  return apiHandler(request, async () => {
    const user = await requireUser();
    const input = supportRequestSchema.parse(await request.json());
    return created(await createSupportRequest(user, input));
  });
}

export async function GET(request: Request) {
  return apiHandler(request, async () => {
    const user = await requireUser();
    const { page, limit, skip } = parsePagination(request.url);
    const provider = await prisma.supportProfile.findUnique({ where: { userId: user.id } });
    const where: Prisma.SupportRequestWhereInput = user.roles.includes("ADMIN") ? {} : provider ? { OR: [{ studentId: user.id }, { assignedProfileId: provider.id }] } : { studentId: user.id };
    const [items, total] = await prisma.$transaction([
      prisma.supportRequest.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit, include: { student: { select: { id: true, name: true } }, assignedProfile: { include: { user: { select: { id: true, name: true } } } }, appointment: true } }),
      prisma.supportRequest.count({ where }),
    ]);
    return paginated(items, { page, limit, total });
  });
}
