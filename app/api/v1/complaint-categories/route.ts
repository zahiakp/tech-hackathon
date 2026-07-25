import { prisma } from "@/lib/prisma";
import { ok } from "@/server/api/response";

export async function GET() {
  return ok(await prisma.complaintCategory.findMany({ where: { active: true }, orderBy: { name: "asc" } }));
}
