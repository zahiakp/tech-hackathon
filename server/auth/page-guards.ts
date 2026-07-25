import { redirect } from "next/navigation";
import type { RoleCode } from "@/app/generated/prisma/enums";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type PageUser = {
  id: string;
  name: string | null;
  email: string;
  roles: RoleCode[];
};

export async function requirePageUser(): Promise<PageUser> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { roles: { include: { role: true } } },
  });

  if (
    !user ||
    user.status !== "ACTIVE" ||
    user.sessionVersion !== session.sessionVersion
  ) {
    redirect("/login");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    roles: user.roles.map(({ role }) => role.code),
  };
}

export async function requirePageRole(
  ...allowedRoles: RoleCode[]
): Promise<PageUser> {
  const user = await requirePageUser();
  if (!user.roles.some((role) => allowedRoles.includes(role))) {
    redirect("/dashboard");
  }
  return user;
}
