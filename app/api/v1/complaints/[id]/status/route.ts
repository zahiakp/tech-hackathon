import { apiHandler } from "@/server/api/handler";
import { ok } from "@/server/api/response";
import { requirePermission } from "@/server/auth/guards";
import { PERMISSIONS } from "@/server/auth/permissions";
import { updateComplaintStatusSchema } from "@/server/modules/complaints/schemas";
import { updateComplaintStatus } from "@/server/modules/complaints/service";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  return apiHandler(request, async (requestId) => {
    const user = await requirePermission(PERMISSIONS.COMPLAINT_UPDATE_STATUS);
    const { id } = await context.params;
    const input = updateComplaintStatusSchema.parse(await request.json());
    return ok(await updateComplaintStatus(id, input.status, input.note, user, request, requestId));
  });
}
