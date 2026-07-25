import Link from "next/link";
import { BookMarked, CircleDollarSign } from "lucide-react";

import { PreviewAlert } from "@/components/feedback/preview-alert";
import { PageHeader } from "@/components/layout/page-header";
import { buttonVariants } from "@/components/ui/button";
import { BookCatalog } from "@/features/library/components/book-catalog";
import { libraryBooks } from "@/lib/mock-data/library";

export default function LibraryPage() {
  return (
    <div className="grid gap-6">
      <PageHeader action={<div className="flex flex-wrap gap-2"><Link className={buttonVariants({ variant: "outline" })} href="/library/fines"><CircleDollarSign />Fines</Link><Link className={buttonVariants()} href="/library/borrowed"><BookMarked />Borrowed books</Link></div>} description="Search the catalogue, check availability, and manage current loans." eyebrow="Campus library" title="Library" />
      <PreviewAlert description="Books, availability, loans, and fines are preview data and are not connected to a library system." />
      <BookCatalog books={libraryBooks} />
    </div>
  );
}
