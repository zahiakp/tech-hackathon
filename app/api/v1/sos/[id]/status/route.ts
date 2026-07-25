import { apiHandler } from "@/server/api/handler";
import { ok } from "@/server/api/response";
import { requirePermission } from "@/server/auth/guards";
import { PERMISSIONS } from "@/server/auth/permissions";
import { updateSosStatusSchema } from "@/server/modules/sos/schemas";
import { updateSosStatus } from "@/server/modules/sos/service";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  return apiHandler(request, async (requestId) => {
    const user = await requirePermission(PERMISSIONS.SOS_UPDATE_STATUS);
    const { id } = await context.params;
    const input = updateSosStatusSchema.parse(await request.json());
    return ok(await updateSosStatus(id, user, input, request, requestId));
  });
}
