import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/server/api/handler";
import { AppError, ok } from "@/server/api/response";
import { requirePermission } from "@/server/auth/guards";
import { PERMISSIONS } from "@/server/auth/permissions";

const FINE_PER_DAY = 5;

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return apiHandler(request, async () => {
    await requirePermission(PERMISSIONS.LIBRARY_MANAGE);
    const { id } = await context.params;
    const current = await prisma.libraryLoan.findUnique({ where: { id } });
    if (!current) throw new AppError(404, "NOT_FOUND", "Loan not found.");
    if (current.returnedAt) throw new AppError(409, "ALREADY_RETURNED", "This loan is already closed.");
    const returnedAt = new Date();
    const overdueMs = Math.max(0, returnedAt.getTime() - current.dueAt.getTime());
    const fineAmount = Math.ceil(overdueMs / 86_400_000) * FINE_PER_DAY;
    const loan = await prisma.$transaction(async (tx) => {
      const updated = await tx.libraryLoan.update({
        where: { id },
        data: { returnedAt, fineAmount, status: "RETURNED" },
        include: {
          book: true,
          borrower: { select: { id: true, name: true, email: true } },
        },
      });
      await tx.libraryBook.update({
        where: { id: current.bookId },
        data: { availableCopies: { increment: 1 } },
      });
      return updated;
    });
    return ok(loan);
  });
}
