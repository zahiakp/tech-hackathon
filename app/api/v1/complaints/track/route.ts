import { apiHandler } from "@/server/api/handler";
import { ok } from "@/server/api/response";
import { trackComplaintSchema } from "@/server/modules/complaints/schemas";
import { trackComplaint } from "@/server/modules/complaints/service";
import { enforceRateLimit } from "@/server/security/rate-limit";
import { getRequestIp, hashIp } from "@/server/security/crypto";

export async function POST(request: Request) {
  return apiHandler(request, async (requestId) => {
    await enforceRateLimit(`complaint:track:${hashIp(getRequestIp(request)) ?? "unknown"}`, 20, 15 * 60_000);
    const input = trackComplaintSchema.parse(await request.json());
    return ok(await trackComplaint(input.referenceCode, input.trackingToken, request, requestId));
  });
}
