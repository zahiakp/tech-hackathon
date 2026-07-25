import { apiHandler } from "@/server/api/handler";
import { ok } from "@/server/api/response";
import { requireUser } from "@/server/auth/guards";
import { appointmentStatusSchema } from "@/server/modules/support/schemas";
import { updateAppointmentStatus } from "@/server/modules/support/service";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  return apiHandler(request, async (requestId) => {
    const user = await requireUser();
    const { id } = await context.params;
    const input = appointmentStatusSchema.parse(await request.json());
    return ok(await updateAppointmentStatus(id, input.status, input.notes, user, request, requestId));
  });
}
