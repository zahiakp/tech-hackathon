import { apiHandler } from "@/server/api/handler";
import { ok } from "@/server/api/response";
import { requireUser } from "@/server/auth/guards";
import { cancelSosSchema } from "@/server/modules/sos/schemas";
import { cancelSos } from "@/server/modules/sos/service";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  return apiHandler(request, async (requestId) => {
    const user = await requireUser();
    const { id } = await context.params;
    const input = cancelSosSchema.parse(await request.json());
    return ok(await cancelSos(id, user, input.note, request, requestId));
  });
}
