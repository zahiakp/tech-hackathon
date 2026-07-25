import { apiHandler, parsePagination } from "@/server/api/handler";
import { paginated } from "@/server/api/response";
import { requireRole } from "@/server/auth/guards";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  return apiHandler(request, async () => {
    await requireRole("ADMIN");
    const { page, limit, skip } = parsePagination(request.url);
    const [items, total] = await prisma.$transaction([
      prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, skip, take: limit, include: { actor: { select: { id: true, name: true, email: true } } } }),
      prisma.auditLog.count(),
    ]);
    return paginated(items, { page, limit, total });
  });
}
