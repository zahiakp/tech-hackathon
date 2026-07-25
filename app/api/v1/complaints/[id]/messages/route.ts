import { apiHandler } from "@/server/api/handler";
import { created } from "@/server/api/response";
import { optionalUser } from "@/server/auth/guards";
import { createComplaintMessageSchema } from "@/server/modules/complaints/schemas";
import { addComplaintMessage } from "@/server/modules/complaints/service";
import { enforceRateLimit } from "@/server/security/rate-limit";
import { getRequestIp, hashIp } from "@/server/security/crypto";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  return apiHandler(request, async () => {
    const user = await optionalUser();
    const { id } = await context.params;
    const input = createComplaintMessageSchema.parse(await request.json());
    if (!user) await enforceRateLimit(`complaint:message:${hashIp(getRequestIp(request)) ?? "unknown"}`, 15, 15 * 60_000);
    return created(await addComplaintMessage(id, input.body, user, input.trackingToken));
  });
}
