import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/server/api/handler";
import { created, ok } from "@/server/api/response";
import { requireUser } from "@/server/auth/guards";
import { availabilitySchema } from "@/server/modules/support/schemas";
import { createAvailability } from "@/server/modules/support/service";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  return apiHandler(request, async () => {
    await requireUser();
    const { id } = await context.params;
    return ok(await prisma.availabilitySlot.findMany({ where: { supportProfileId: id, booked: false, startAt: { gt: new Date() } }, orderBy: { startAt: "asc" } }));
  });
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  return apiHandler(request, async () => {
    const user = await requireUser();
    const { id } = await context.params;
    const input = availabilitySchema.parse(await request.json());
    return created(await createAvailability(id, user, input));
  });
}
