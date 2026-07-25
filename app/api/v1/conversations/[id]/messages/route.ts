import { prisma } from "@/lib/prisma";
import { apiHandler, parsePagination } from "@/server/api/handler";
import { created, paginated } from "@/server/api/response";
import { requireUser } from "@/server/auth/guards";
import { chatMessageSchema } from "@/server/modules/support/schemas";
import { requireConversationAccess, sendChatMessage } from "@/server/modules/support/service";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  return apiHandler(request, async (requestId) => {
    const user = await requireUser();
    const { id } = await context.params;
    await requireConversationAccess(id, user, { request, requestId });
    const { page, limit, skip } = parsePagination(request.url);
    const [items, total] = await prisma.$transaction([
      prisma.chatMessage.findMany({ where: { conversationId: id }, orderBy: { createdAt: "desc" }, skip, take: limit, include: { sender: { select: { id: true, name: true, image: true } } } }),
      prisma.chatMessage.count({ where: { conversationId: id } }),
    ]);
    return paginated(items.reverse(), { page, limit, total });
  });
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  return apiHandler(request, async () => {
    const user = await requireUser();
    const { id } = await context.params;
    const input = chatMessageSchema.parse(await request.json());
    return created(await sendChatMessage(id, input.body, user));
  });
}
