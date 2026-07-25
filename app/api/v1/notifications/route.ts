import { apiHandler, parsePagination } from "@/server/api/handler";
import { ok, paginated } from "@/server/api/response";
import { requireUser } from "@/server/auth/guards";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  return apiHandler(request, async () => {
    const user = await requireUser();
    const { page, limit, skip } = parsePagination(request.url);
    const [items, total, unread] = await prisma.$transaction([
      prisma.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.notification.count({ where: { userId: user.id } }),
      prisma.notification.count({ where: { userId: user.id, readAt: null } }),
    ]);
    const response = paginated(items, { page, limit, total });
    response.headers.set("x-unread-count", String(unread));
    return response;
  });
}

export async function PATCH(request: Request) {
  return apiHandler(request, async () => {
    const user = await requireUser();
    await prisma.notification.updateMany({ where: { userId: user.id, readAt: null }, data: { readAt: new Date() } });
    return ok({ read: true });
  });
}
