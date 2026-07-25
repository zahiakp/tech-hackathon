import type { RoleCode } from "@/app/generated/prisma/enums";

export function landingPathForRoles(roles: readonly RoleCode[]) {
  if (roles.includes("ADMIN")) return "/admin";
  if (roles.includes("SECURITY")) return "/security";
  if (roles.includes("COORDINATOR")) return "/admin/complaints";
  if (roles.includes("COUNSELLOR")) return "/counsellor/appointments";
  if (roles.includes("FACULTY")) return "/faculty/attendance";
  if (roles.includes("LIBRARY_STAFF")) return "/library-staff";
  return "/student";
}
