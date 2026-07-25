import { apiHandler } from "@/server/api/handler";
import { ok } from "@/server/api/response";
import { requireUser } from "@/server/auth/guards";
import { campusChatbot, chatbotRequestSchema } from "@/server/modules/chatbot/service";
import { enforceRateLimit } from "@/server/security/rate-limit";

export async function POST(request: Request) {
  return apiHandler(request, async () => {
    const user = await requireUser();
    await enforceRateLimit(`chatbot:${user.id}`, 20, 60 * 60_000);
    const input = chatbotRequestSchema.parse(await request.json());
    return ok(await campusChatbot(user, input.message));
  });
}
