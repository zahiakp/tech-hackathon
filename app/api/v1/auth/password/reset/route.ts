import { apiHandler } from "@/server/api/handler";
import { ok } from "@/server/api/response";
import { resetPasswordSchema } from "@/server/modules/auth/schemas";
import { resetPassword } from "@/server/modules/auth/service";

export async function POST(request: Request) {
  return apiHandler(request, async (requestId) => {
    const input = resetPasswordSchema.parse(await request.json());
    return ok(await resetPassword(input.token, input.password, requestId));
  });
}
