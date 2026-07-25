export type BookAvailability = "available" | "limited" | "unavailable";

export type LibraryBook = {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  description: string;
  availability: BookAvailability;
  availableCopies: number;
  totalCopies: number;
  shelf: string;
};

export type BorrowedBook = {
  id: string;
  bookId: string;
  borrowedAt: string;
  dueAt: string;
  daysRemaining: number;
  renewalStatus: "available" | "used" | "unavailable";
};

export type LibraryFine = {
  id: string;
  bookId: string;
  reason: string;
  amount: number;
  status: "due" | "paid" | "waived";
  issuedAt: string;
};
