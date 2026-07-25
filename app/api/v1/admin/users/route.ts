import { hash } from 'bcryptjs';
import { z } from 'zod';
import { RoleCode } from '@/app/generated/prisma/enums';
import { prisma } from '@/lib/prisma';
import { apiHandler, parsePagination } from '@/server/api/handler';
import { created, paginated } from '@/server/api/response';
import { requirePermission, requireRole } from '@/server/auth/guards';
import { PERMISSIONS } from '@/server/auth/permissions';
import { writeAudit } from '@/server/modules/audit/service';

const createUserSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email().transform((value) => value.trim().toLowerCase()),
  password: z.string().min(8).max(128),
  roles: z.array(z.nativeEnum(RoleCode)).min(1),
  campus: z.string().trim().max(100).optional(),
  department: z.string().trim().max(100).optional(),
});

export async function GET(request: Request) {
  return apiHandler(request, async () => {
    await requireRole('ADMIN');
    const { page, limit, skip } = parsePagination(request.url);
    const roleParam = new URL(request.url).searchParams.get('role');
    const role = roleParam && Object.values(RoleCode).includes(roleParam as RoleCode)
      ? (roleParam as RoleCode)
      : undefined;
    const where = role ? { roles: { some: { role: { code: role } } } } : {};
    const [items, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          profile: true,
          roles: { select: { role: { select: { code: true, name: true } } } },
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);
    return paginated(items, { page, limit, total });
  });
}

export async function POST(request: Request) {
  return apiHandler(request, async (requestId) => {
    const actor = await requirePermission(PERMISSIONS.ROLE_MANAGE);
    const input = createUserSchema.parse(await request.json());
    const roles = await prisma.role.findMany({
      where: { code: { in: input.roles } },
    });
    const passwordHash = await hash(input.password, 12);
    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          name: input.name,
          email: input.email,
          passwordHash,
          profile: {
            create: {
              campus: input.campus,
              department: input.department,
            },
          },
        },
      });
      await tx.userRole.createMany({
        data: roles.map((role) => ({
          userId: createdUser.id,
          roleId: role.id,
          assignedById: actor.id,
        })),
      });
      return tx.user.findUniqueOrThrow({
        where: { id: createdUser.id },
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          profile: true,
          roles: { select: { role: { select: { code: true, name: true } } } },
          createdAt: true,
        },
      });
    });
    await writeAudit({
      request,
      requestId,
      actorId: actor.id,
      action: 'user.admin_created',
      entityType: 'User',
      entityId: user.id,
      metadata: { roles: input.roles },
    });
    return created(user);
  });
}