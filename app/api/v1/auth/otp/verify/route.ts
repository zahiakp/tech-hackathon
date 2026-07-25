import { apiHandler } from "@/server/api/handler";
import { ok } from "@/server/api/response";
import { verifyOtpSchema } from "@/server/modules/auth/schemas";
import { verifyOtp } from "@/server/modules/auth/service";

export async function POST(request: Request) {
  return apiHandler(request, async () => {
    const input = verifyOtpSchema.parse(await request.json());
    return ok(await verifyOtp(input.email, input.purpose, input.code));
  });
}
