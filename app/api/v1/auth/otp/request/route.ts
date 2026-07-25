import { apiHandler } from "@/server/api/handler";
import { ok } from "@/server/api/response";
import { requestOtpSchema } from "@/server/modules/auth/schemas";
import { requestOtp } from "@/server/modules/auth/service";
import { enforceRateLimit } from "@/server/security/rate-limit";
import { getRequestIp, hashIp } from "@/server/security/crypto";

export async function POST(request: Request) {
  return apiHandler(request, async () => {
    const input = requestOtpSchema.parse(await request.json());
    await enforceRateLimit(`otp:${hashIp(getRequestIp(request)) ?? "unknown"}:${input.email}`, 5, 15 * 60_000);
    return ok(await requestOtp(input.email, input.purpose));
  });
}
