"use client";

import { useMemo, useState } from "react";
import { BookSearch, Search } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { Input } from "@/components/ui/input";
import { BookCard } from "@/features/library/components/book-card";
import type { LibraryBook } from "@/features/library/types";

export function BookCatalog({ books }: { books: LibraryBook[] }) {
  const [query, setQuery] = useState("");
  const visible = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return books;
    return books.filter((book) => [book.title, book.author, book.category, book.isbn].some((item) => item.toLowerCase().includes(value)));
  }, [books, query]);
  return (
    <div className="grid gap-5">
      <div className="relative max-w-2xl"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" onChange={(event) => setQuery(event.target.value)} placeholder="Search by title, author, category, or ISBN" value={query} /></div>
      {visible.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visible.map((book) => <BookCard book={book} key={book.id} />)}</div> : <EmptyState icon={BookSearch} title="No matching books" description="Try another title, author, category, or ISBN." />}
    </div>
  );
}
