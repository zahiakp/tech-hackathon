import { ArrowLeft, BookCopy, Hash, LibraryBig, MapPinned } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReservationDialog } from "@/features/library/components/reservation-dialog";
import { libraryBooks } from "@/lib/mock-data/library";

export default async function BookDetailsPage({ params }: { params: Promise<{ bookId: string }> }) {
  const { bookId } = await params;
  const book = libraryBooks.find((item) => item.id === bookId);
  if (!book) return <EmptyState title="Book not found" description="The requested preview book does not exist." action={<Link className={buttonVariants({ variant: "outline" })} href="/library"><ArrowLeft />Back to library</Link>} />;
  const tone = book.availability === "available" ? "success" : book.availability === "limited" ? "warning" : "destructive";
  return (
    <div className="grid gap-6">
      <PageHeader action={<ReservationDialog book={book} />} description={book.author} eyebrow={book.category} title={book.title} />

      <div className="grid gap-6 lg:grid-cols-[1fr_0.65fr]">
        <Card><CardHeader><CardTitle>About this book</CardTitle><CardDescription>{book.description}</CardDescription></CardHeader><CardContent className="grid gap-3 text-sm text-muted-foreground"><p className="flex items-center gap-2"><Hash className="size-4 text-primary" />ISBN {book.isbn}</p><p className="flex items-center gap-2"><MapPinned className="size-4 text-primary" />Shelf {book.shelf}</p></CardContent></Card>
        <Card><CardHeader className="flex-row items-start justify-between"><div><CardTitle>Availability</CardTitle><CardDescription>Current preview inventory</CardDescription></div><StatusBadge label={book.availability} tone={tone} /></CardHeader><CardContent className="grid gap-3"><p className="flex items-center gap-2"><BookCopy className="size-4 text-primary" />{book.availableCopies} available</p><p className="flex items-center gap-2 text-sm text-muted-foreground"><LibraryBig className="size-4" />{book.totalCopies} total copies</p></CardContent></Card>
      </div>
    </div>
  );
}
