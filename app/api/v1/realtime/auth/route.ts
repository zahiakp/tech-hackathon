import { apiHandler } from "@/server/api/handler";
import { AppError } from "@/server/api/response";
import { requireUser } from "@/server/auth/guards";
import { getPusher } from "@/server/integrations/pusher";
import { prisma } from "@/lib/prisma";

async function readBody(request: Request) {
  const type = request.headers.get("content-type") ?? "";
  if (type.includes("application/json")) return request.json() as Promise<{ socket_id?: string; channel_name?: string }>;
  const form = await request.formData();
  return { socket_id: String(form.get("socket_id") ?? ""), channel_name: String(form.get("channel_name") ?? "") };
}

export async function POST(request: Request) {
  return apiHandler(request, async () => {
    const user = await requireUser();
    const body = await readBody(request);
    const socketId = body.socket_id ?? "";
    const channel = body.channel_name ?? "";
    if (!socketId || !channel) throw new AppError(400, "VALIDATION_ERROR", "socket_id and channel_name are required.");

    let authorized = channel === `private-user-${user.id}`;
    if (channel === "private-security") authorized = user.roles.some((role) => role === "SECURITY" || role === "ADMIN");
    if (channel === "private-complaints") authorized = user.roles.some((role) => role === "COORDINATOR" || role === "ADMIN");
    if (channel.startsWith("private-conversation-")) {
      const conversationId = channel.slice("private-conversation-".length);
      authorized = user.roles.includes("ADMIN") || Boolean(await prisma.conversationParticipant.findUnique({ where: { conversationId_userId: { conversationId, userId: user.id } } }));
    }
    if (!authorized) throw new AppError(403, "FORBIDDEN", "You cannot subscribe to this channel.");

    const pusher = getPusher();
    if (!pusher) throw new AppError(503, "REALTIME_NOT_CONFIGURED", "Real-time service is not configured.");
    return Response.json(pusher.authorizeChannel(socketId, channel));
  });
}
