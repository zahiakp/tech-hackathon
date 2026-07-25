import { prisma } from "@/lib/prisma";
import { apiHandler, parsePagination } from "@/server/api/handler";
import { AppError, created, paginated } from "@/server/api/response";
import { requirePermission } from "@/server/auth/guards";
import { PERMISSIONS } from "@/server/auth/permissions";
import { createStartupSchema } from "@/server/modules/operational/schemas";

const include = { founder: { select: { id: true, name: true, email: true, profile: true } }, reviewedBy: { select: { id: true, name: true } } };

export async function GET(request: Request) {
  return apiHandler(request, async () => {
    const user = await requirePermission(PERMISSIONS.STARTUP_READ);
    const { page, limit, skip } = parsePagination(request.url);
    const where = user.roles.includes("ADMIN") ? {} : { founderId: user.id };
    const [items, total] = await prisma.$transaction([
      prisma.campusStartup.findMany({ where, include, orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.campusStartup.count({ where }),
    ]);
    return paginated(items, { page, limit, total });
  });
}

export async function POST(request: Request) {
  return apiHandler(request, async () => {
    const user = await requirePermission(PERMISSIONS.STARTUP_CREATE);
    const input = createStartupSchema.parse(await request.json());
    let founderId = user.id;
    if (user.roles.includes("ADMIN") && input.founderEmail) {
      const founder = await prisma.user.findUnique({ where: { email: input.founderEmail } });
      if (!founder) throw new AppError(404, "FOUNDER_NOT_FOUND", "No user has that founder email.");
      founderId = founder.id;
    }
    return created(await prisma.campusStartup.create({ data: { founderId, startupName: input.startupName, category: input.category, pitchSummary: input.pitchSummary, fundingRequested: input.fundingRequested, teamSize: input.teamSize, hiringPostsCount: input.hiringPostsCount }, include }));
  });
}