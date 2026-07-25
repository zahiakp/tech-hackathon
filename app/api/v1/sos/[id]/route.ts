import { apiHandler } from "@/server/api/handler";
import { ok } from "@/server/api/response";
import { requireUser } from "@/server/auth/guards";
import { getSos } from "@/server/modules/sos/service";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  return apiHandler(request, async () => {
    const user = await requireUser();
    const { id } = await context.params;
    return ok(await getSos(id, user));
  });
}
