import { CircleDollarSign } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LibraryBook, LibraryFine } from "@/features/library/types";

export function FineList({ fines, books }: { fines: LibraryFine[]; books: LibraryBook[] }) {
  return (
    <div className="grid gap-4">
      {fines.map((fine) => {
        const book = books.find((item) => item.id === fine.bookId);
        return <Card key={fine.id}><CardHeader className="flex-row items-start justify-between"><div><CardTitle>{book?.title}</CardTitle><p className="text-sm text-muted-foreground">{fine.reason}</p></div><StatusBadge label={fine.status} tone={fine.status === "due" ? "destructive" : "success"} /></CardHeader><CardContent className="flex items-center justify-between gap-4"><p className="flex items-center gap-2 text-sm text-muted-foreground"><CircleDollarSign className="size-4" />Issued {fine.issuedAt}</p><p className="text-2xl font-bold">₹{fine.amount}</p></CardContent></Card>;
      })}
    </div>
  );
}
