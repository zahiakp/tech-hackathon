import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/server/api/handler";
import { AppError, created } from "@/server/api/response";
import { requirePermission } from "@/server/auth/guards";
import { PERMISSIONS } from "@/server/auth/permissions";
import { issueBookSchema } from "@/server/modules/operational/schemas";

export async function POST(request: Request) {
  return apiHandler(request, async () => {
    const staff = await requirePermission(PERMISSIONS.LIBRARY_MANAGE);
    const input = issueBookSchema.parse(await request.json());
    const borrower = await prisma.user.findUnique({
      where: { email: input.borrowerEmail },
    });
    if (!borrower) throw new AppError(404, "BORROWER_NOT_FOUND", "No user has that email.");

    const loan = await prisma.$transaction(async (tx) => {
      const updated = await tx.libraryBook.updateMany({
        where: { id: input.bookId, availableCopies: { gt: 0 } },
        data: { availableCopies: { decrement: 1 } },
      });
      if (updated.count !== 1) {
        throw new AppError(409, "BOOK_UNAVAILABLE", "No copy is currently available.");
      }
      return tx.libraryLoan.create({
        data: {
          bookId: input.bookId,
          borrowerId: borrower.id,
          issuedById: staff.id,
          dueAt: input.dueAt,
        },
        include: {
          book: true,
          borrower: { select: { id: true, name: true, email: true } },
        },
      });
    });
    return created(loan);
  });
}
