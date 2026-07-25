import { apiHandler } from "@/server/api/handler";
import { ok } from "@/server/api/response";
import { requirePermission } from "@/server/auth/guards";
import { PERMISSIONS } from "@/server/auth/permissions";
import { assignComplaintSchema } from "@/server/modules/complaints/schemas";
import { assignComplaint } from "@/server/modules/complaints/service";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  return apiHandler(request, async (requestId) => {
    const user = await requirePermission(PERMISSIONS.COMPLAINT_ASSIGN);
    const { id } = await context.params;
    const input = assignComplaintSchema.parse(await request.json());
    return ok(await assignComplaint(id, input.assignedToId, user, request, requestId));
  });
}
