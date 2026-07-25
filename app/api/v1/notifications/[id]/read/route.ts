import { apiHandler } from "@/server/api/handler";
import { AppError, ok } from "@/server/api/response";
import { requireUser } from "@/server/auth/guards";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  return apiHandler(request, async () => {
    const user = await requireUser();
    const { id } = await context.params;
    const result = await prisma.notification.updateMany({ where: { id, userId: user.id }, data: { readAt: new Date() } });
    if (!result.count) throw new AppError(404, "NOT_FOUND", "Notification not found.");
    return ok({ read: true });
  });
}
