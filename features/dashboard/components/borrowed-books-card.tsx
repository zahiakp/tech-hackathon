import { BookOpen, Clock3 } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { SectionHeader } from "@/components/shared/section-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { BorrowedBook } from "@/features/dashboard/types";

type BorrowedBooksCardProps = {
  books: BorrowedBook[];
};

const bookStatus = {
  borrowed: { label: "Borrowed", tone: "muted" },
  "due-soon": { label: "Due soon", tone: "warning" },
  overdue: { label: "Overdue", tone: "destructive" },
} as const;

export function BorrowedBooksCard({ books }: BorrowedBooksCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="border-b">
        <SectionHeader
          description="Books currently issued to you"
          title="Borrowed books"
        />
      </CardHeader>
      <CardContent>
        {books.length === 0 ? (
          <EmptyState
            description="Books borrowed from the library will appear here."
            icon={BookOpen}
            title="No borrowed books"
          />
        ) : (
          <ul className="divide-y">
            {books.map((book) => {
              const status = bookStatus[book.status];

              return (
                <li className="flex gap-3 py-4 first:pt-0 last:pb-0" key={book.id}>
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <BookOpen className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{book.title}</p>
                        <p className="truncate text-sm text-muted-foreground">
                          {book.author}
                        </p>
                      </div>
                      <StatusBadge label={status.label} tone={status.tone} />
                    </div>
                    <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock3 className="size-3.5" aria-hidden="true" />
                      Due {book.dueDate}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
