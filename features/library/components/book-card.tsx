import Link from "next/link";
import { BookOpen, LibraryBig } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { LibraryBook } from "@/features/library/types";

const availabilityTone = {
  available: "success",
  limited: "warning",
  unavailable: "destructive",
} as const;

export function BookCard({ book }: { book: LibraryBook }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-3"><span className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary"><BookOpen /></span><StatusBadge label={book.availability} tone={availabilityTone[book.availability]} /></div>
        <CardTitle>{book.title}</CardTitle>
        <CardDescription>{book.author}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm"><p className="text-muted-foreground">{book.category}</p><p className="flex items-center gap-2"><LibraryBig className="size-4 text-primary" />{book.availableCopies} of {book.totalCopies} copies available</p></CardContent>
      <CardFooter><Link className={buttonVariants({ variant: "outline", className: "w-full" })} href={`/library/books/${book.id}`}>View book details</Link></CardFooter>
    </Card>
  );
}
