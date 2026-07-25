import { RoleCode } from "@/app/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { apiHandler, parsePagination } from "@/server/api/handler";
import { paginated } from "@/server/api/response";
import { requireRole } from "@/server/auth/guards";

export async function GET(request: Request) {
  return apiHandler(request, async () => {
    await requireRole("ADMIN");
    const { page, limit, skip } = parsePagination(request.url);
    const roleParam = new URL(request.url).searchParams.get("role");
    const role = roleParam && Object.values(RoleCode).includes(roleParam as RoleCode) ? roleParam as RoleCode : undefined;
    const where = role ? { roles: { some: { role: { code: role } } } } : {};
    const [items, total] = await prisma.$transaction([
      prisma.user.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" }, select: { id: true, name: true, email: true, status: true, profile: true, roles: { select: { role: { select: { code: true, name: true } } } }, createdAt: true } }),
      prisma.user.count({ where }),
    ]);
    return paginated(items, { page, limit, total });
  });
}
