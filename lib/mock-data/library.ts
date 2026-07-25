import type {
  BorrowedBook,
  LibraryBook,
  LibraryFine,
} from "@/features/library/types";

export const libraryBooks: LibraryBook[] = [
  { id: "clean-code", title: "Clean Code", author: "Robert C. Martin", category: "Software Engineering", isbn: "978-0132350884", description: "Principles and practices for writing maintainable software.", availability: "available", availableCopies: 3, totalCopies: 6, shelf: "CS-B12" },
  { id: "design-everyday-things", title: "The Design of Everyday Things", author: "Don Norman", category: "Design", isbn: "978-0465050659", description: "A foundational exploration of human-centred product design.", availability: "limited", availableCopies: 1, totalCopies: 4, shelf: "DS-A07" },
  { id: "atomic-habits", title: "Atomic Habits", author: "James Clear", category: "Personal Development", isbn: "978-0735211292", description: "A practical framework for building better habits over time.", availability: "unavailable", availableCopies: 0, totalCopies: 8, shelf: "PD-C03" },
  { id: "database-system-concepts", title: "Database System Concepts", author: "Silberschatz, Korth & Sudarshan", category: "Computer Science", isbn: "978-0078022159", description: "A comprehensive introduction to database architecture and design.", availability: "available", availableCopies: 2, totalCopies: 5, shelf: "CS-B18" },
  { id: "psychology-money", title: "The Psychology of Money", author: "Morgan Housel", category: "Finance", isbn: "978-0857197689", description: "Short lessons on behaviour, wealth, and financial decision-making.", availability: "limited", availableCopies: 1, totalCopies: 5, shelf: "FN-D02" },
];

export const borrowedBooks: BorrowedBook[] = [
  { id: "borrow-01", bookId: "clean-code", borrowedAt: "10 Jul 2026", dueAt: "31 Jul 2026", daysRemaining: 6, renewalStatus: "available" },
  { id: "borrow-02", bookId: "design-everyday-things", borrowedAt: "02 Jul 2026", dueAt: "27 Jul 2026", daysRemaining: 2, renewalStatus: "used" },
  { id: "borrow-03", bookId: "atomic-habits", borrowedAt: "18 Jun 2026", dueAt: "09 Jul 2026", daysRemaining: -16, renewalStatus: "unavailable" },
];

export const libraryFines: LibraryFine[] = [
  { id: "fine-01", bookId: "atomic-habits", reason: "Overdue return · 16 days", amount: 160, status: "due", issuedAt: "10 Jul 2026" },
  { id: "fine-02", bookId: "database-system-concepts", reason: "Late return · 3 days", amount: 30, status: "paid", issuedAt: "02 Jun 2026" },
];
