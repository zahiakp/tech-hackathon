import { ComplaintStatus, Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { apiHandler, parsePagination } from "@/server/api/handler";
import { created, paginated } from "@/server/api/response";
import { requirePermission, requireUser } from "@/server/auth/guards";
import { PERMISSIONS } from "@/server/auth/permissions";
import { createComplaintSchema } from "@/server/modules/complaints/schemas";
import { canManageComplaints, createNamedComplaint } from "@/server/modules/complaints/service";

export async function POST(request: Request) {
  return apiHandler(request, async (requestId) => {
    const user = await requirePermission(PERMISSIONS.COMPLAINT_CREATE);
    const input = createComplaintSchema.parse(await request.json());
    return created(await createNamedComplaint(user, input, request, requestId));
  });
}

export async function GET(request: Request) {
  return apiHandler(request, async () => {
    const user = await requireUser();
    const { page, limit, skip } = parsePagination(request.url);
    const statusParam = new URL(request.url).searchParams.get("status");
    const status = statusParam && Object.values(ComplaintStatus).includes(statusParam as ComplaintStatus) ? statusParam as ComplaintStatus : undefined;
    const where: Prisma.ComplaintWhereInput = {
      ...(canManageComplaints(user) ? {} : { OR: [{ reporterId: user.id }, { assignedToId: user.id }] }),
      ...(status ? { status } : {}),
    };
    const [items, total] = await prisma.$transaction([
      prisma.complaint.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit, include: { category: true, assignedTo: { select: { id: true, name: true } } } }),
      prisma.complaint.count({ where }),
    ]);
    return paginated(items.map(({ trackingTokenHash, ...item }) => { void trackingTokenHash; return item; }), { page, limit, total });
  });
}
