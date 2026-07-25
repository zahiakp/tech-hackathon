import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/server/api/handler";
import { created, ok } from "@/server/api/response";
import { requirePermission } from "@/server/auth/guards";
import { PERMISSIONS } from "@/server/auth/permissions";
import { createBookSchema } from "@/server/modules/operational/schemas";

export async function GET(request: Request) {
  return apiHandler(request, async () => {
    await requirePermission(PERMISSIONS.LIBRARY_READ);
    const now = new Date();
    await prisma.libraryLoan.updateMany({ where: { status: "ISSUED", dueAt: { lt: now } }, data: { status: "OVERDUE" } });
    const [books, loans] = await prisma.$transaction([
      prisma.libraryBook.findMany({ orderBy: { title: "asc" } }),
      prisma.libraryLoan.findMany({
        include: { book: true, borrower: { select: { id: true, name: true, email: true, profile: true } }, issuedBy: { select: { id: true, name: true } } },
        orderBy: { issuedAt: "desc" },
        take: 100,
      }),
    ]);
    return ok({ books, loans });
  });
}

export async function POST(request: Request) {
  return apiHandler(request, async () => {
    await requirePermission(PERMISSIONS.LIBRARY_MANAGE);
    const input = createBookSchema.parse(await request.json());
    return created(await prisma.libraryBook.create({ data: { ...input, availableCopies: input.totalCopies } }));
  });
}