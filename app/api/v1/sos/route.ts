import { Prisma } from "@/app/generated/prisma/client";
import { SosStatus } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { apiHandler, parsePagination } from "@/server/api/handler";
import { created, paginated } from "@/server/api/response";
import { requirePermission, requireUser } from "@/server/auth/guards";
import { PERMISSIONS } from "@/server/auth/permissions";
import { createSosSchema } from "@/server/modules/sos/schemas";
import { canReadAllSos, createSos } from "@/server/modules/sos/service";

export async function POST(request: Request) {
  return apiHandler(request, async (requestId) => {
    const user = await requirePermission(PERMISSIONS.SOS_CREATE);
    const input = createSosSchema.parse(await request.json());
    return created(await createSos(user, input, request, requestId));
  });
}

export async function GET(request: Request) {
  return apiHandler(request, async () => {
    const user = await requireUser();
    const { page, limit, skip } = parsePagination(request.url);
    const statusParam = new URL(request.url).searchParams.get("status");
    const status = statusParam && Object.values(SosStatus).includes(statusParam as SosStatus) ? statusParam as SosStatus : undefined;
    const where: Prisma.SosIncidentWhereInput = {
      ...(canReadAllSos(user) ? {} : { creatorId: user.id }),
      ...(status ? { status } : {}),
    };
    const [items, total] = await prisma.$transaction([
      prisma.sosIncident.findMany({
        where, orderBy: { createdAt: "desc" }, skip, take: limit,
        include: { creator: { select: { id: true, name: true } }, assignments: { include: { securityUser: { select: { id: true, name: true } } } } },
      }),
      prisma.sosIncident.count({ where }),
    ]);
    return paginated(items, { page, limit, total });
  });
}
