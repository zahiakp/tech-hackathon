import Link from "next/link";
import { CircleDollarSign } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { buttonVariants } from "@/components/ui/button";
import { BorrowedBookList } from "@/features/library/components/borrowed-book-list";
import { borrowedBooks, libraryBooks } from "@/lib/mock-data/library";

export default function BorrowedBooksPage() {
  return <div className="grid gap-6"><PageHeader action={<Link className={buttonVariants({ variant: "outline" })} href="/library/fines"><CircleDollarSign />View fines</Link>} description="Monitor due dates and preview renewal availability." eyebrow="My library" title="Borrowed books" /><BorrowedBookList books={libraryBooks} borrowed={borrowedBooks} /></div>;
}
