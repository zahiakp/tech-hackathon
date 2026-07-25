import { apiHandler } from "@/server/api/handler";
import { ok } from "@/server/api/response";
import { requireUser } from "@/server/auth/guards";
import { prisma } from "@/lib/prisma";
import { updateProfileSchema } from "@/server/modules/auth/schemas";
import { writeAudit } from "@/server/modules/audit/service";

export async function GET(request: Request) {
  return apiHandler(request, async () => {
    const access = await requireUser();
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: access.id },
      select: {
        id: true, name: true, email: true, emailVerified: true, image: true,
        status: true, profile: true,
        roles: { select: { role: { select: { code: true, name: true } } } },
        createdAt: true, updatedAt: true,
      },
    });
    return ok(user);
  });
}

export async function PATCH(request: Request) {
  return apiHandler(request, async (requestId) => {
    const access = await requireUser();
    const input = updateProfileSchema.parse(await request.json());
    const { name, ...profile } = input;
    const user = await prisma.$transaction(async (tx) => {
      if (name !== undefined) await tx.user.update({ where: { id: access.id }, data: { name } });
      await tx.userProfile.upsert({
        where: { userId: access.id },
        create: { userId: access.id, ...profile },
        update: profile,
      });
      return tx.user.findUniqueOrThrow({ where: { id: access.id }, include: { profile: true } });
    });
    await writeAudit({
      request, requestId, actorId: access.id, action: "profile.updated", entityType: "User", entityId: access.id,
      metadata: { changedFields: Object.keys(input) },
    });
    return ok(user);
  });
}
