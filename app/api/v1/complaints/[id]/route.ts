import { apiHandler } from "@/server/api/handler";
import { ok } from "@/server/api/response";
import { requireUser } from "@/server/auth/guards";
import { getComplaint } from "@/server/modules/complaints/service";
import { writeAudit } from "@/server/modules/audit/service";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  return apiHandler(request, async (requestId) => {
    const user = await requireUser();
    const { id } = await context.params;
    const complaint = await getComplaint(id, user);
    await writeAudit({ request, requestId, actorId: user.id, action: "complaint.viewed", entityType: "Complaint", entityId: id });
    return ok(complaint);
  });
}
