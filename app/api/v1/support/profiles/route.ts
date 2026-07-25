import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/server/api/handler";
import { created, ok } from "@/server/api/response";
import { requireUser } from "@/server/auth/guards";
import { supportProfileSchema } from "@/server/modules/support/schemas";
import { upsertSupportProfile } from "@/server/modules/support/service";

export async function GET(request: Request) {
  return apiHandler(request, async () => {
    await requireUser();
    const type = new URL(request.url).searchParams.get("type");
    return ok(await prisma.supportProfile.findMany({
      where: { active: true, ...(type === "MENTOR" || type === "COUNSELLOR" ? { type } : {}) },
      include: { user: { select: { id: true, name: true, image: true, profile: { select: { department: true, course: true, campus: true } } } } },
      orderBy: { createdAt: "desc" },
    }));
  });
}

export async function POST(request: Request) {
  return apiHandler(request, async () => {
    const user = await requireUser();
    const input = supportProfileSchema.parse(await request.json());
    return created(await upsertSupportProfile(user, input));
  });
}
