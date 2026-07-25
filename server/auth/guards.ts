import type { RoleCode } from "@/app/generated/prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/server/api/response";
import type { PermissionCode } from "@/server/auth/permissions";

export type AccessContext = {
  id: string;
  email: string;
  name: string | null;
  sessionVersion: number;
  roles: RoleCode[];
  permissions: string[];
};

export async function requireUser(): Promise<AccessContext> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new AppError(401, "UNAUTHENTICATED", "You must sign in to continue.");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: { include: { permission: true } },
            },
          },
        },
      },
    },
  });

  if (!user || user.status !== "ACTIVE") {
    throw new AppError(403, "ACCOUNT_DISABLED", "This account is not active.");
  }

  if (session.sessionVersion !== user.sessionVersion) {
    throw new AppError(401, "SESSION_REVOKED", "Your session has expired. Please sign in again.");
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    sessionVersion: user.sessionVersion,
    roles: user.roles.map(({ role }) => role.code),
    permissions: [
      ...new Set(
        user.roles.flatMap(({ role }) =>
          role.permissions.map(({ permission }) => permission.code),
        ),
      ),
    ],
  };
}

export async function optionalUser(): Promise<AccessContext | null> {
  try {
    return await requireUser();
  } catch (error) {
    if (error instanceof AppError && error.status === 401) return null;
    throw error;
  }
}

export async function requireRole(...allowed: RoleCode[]) {
  const user = await requireUser();
  if (!user.roles.some((role) => allowed.includes(role))) {
    throw new AppError(403, "FORBIDDEN", "Your role cannot perform this action.");
  }
  return user;
}

export async function requirePermission(permission: PermissionCode) {
  const user = await requireUser();
  if (!user.permissions.includes(permission)) {
    throw new AppError(403, "FORBIDDEN", "You do not have permission to perform this action.");
  }
  return user;
}
