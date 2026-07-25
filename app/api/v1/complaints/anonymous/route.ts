import { apiHandler } from "@/server/api/handler";
import { created } from "@/server/api/response";
import { createAnonymousComplaintSchema } from "@/server/modules/complaints/schemas";
import { createAnonymousComplaint } from "@/server/modules/complaints/service";
import { enforceRateLimit } from "@/server/security/rate-limit";
import { getRequestIp, hashIp } from "@/server/security/crypto";

export async function POST(request: Request) {
  return apiHandler(request, async (requestId) => {
    await enforceRateLimit(`complaint:create:${hashIp(getRequestIp(request)) ?? "unknown"}`, 5, 60 * 60_000);
    const input = createAnonymousComplaintSchema.parse(await request.json());
    return created(await createAnonymousComplaint(input, request, requestId));
  });
}
