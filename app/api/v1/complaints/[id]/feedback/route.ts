import { apiHandler } from "@/server/api/handler";
import { created } from "@/server/api/response";
import { optionalUser } from "@/server/auth/guards";
import { complaintFeedbackSchema } from "@/server/modules/complaints/schemas";
import { addComplaintFeedback } from "@/server/modules/complaints/service";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  return apiHandler(request, async () => {
    const user = await optionalUser();
    const { id } = await context.params;
    const input = complaintFeedbackSchema.parse(await request.json());
    return created(await addComplaintFeedback(id, input.rating, input.comment, user, input.trackingToken));
  });
}
