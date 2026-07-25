"use client";

import { useState } from "react";
import { CalendarClock, RefreshCw } from "lucide-react";

import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BorrowedBook, LibraryBook } from "@/features/library/types";

export function BorrowedBookList({ borrowed, books }: { borrowed: BorrowedBook[]; books: LibraryBook[] }) {
  const [renewedId, setRenewedId] = useState<string>();
  return (
    <div className="grid gap-4">
      {borrowed.map((record) => {
        const book = books.find((item) => item.id === record.bookId);
        const overdue = record.daysRemaining < 0;
        const dueSoon = record.daysRemaining >= 0 && record.daysRemaining <= 3;
        const canRenew = record.renewalStatus === "available" && renewedId !== record.id;
        return (
          <Card key={record.id}>
            <CardHeader className="flex-row items-start justify-between gap-3"><div><CardTitle>{book?.title}</CardTitle><p className="text-sm text-muted-foreground">{book?.author}</p></div><StatusBadge label={overdue ? `${Math.abs(record.daysRemaining)} days overdue` : dueSoon ? `Due in ${record.daysRemaining} days` : `${record.daysRemaining} days left`} tone={overdue ? "destructive" : dueSoon ? "warning" : "success"} /></CardHeader>
            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="grid gap-1 text-sm text-muted-foreground"><p>Borrowed {record.borrowedAt}</p><p className="flex items-center gap-2 font-medium text-foreground"><CalendarClock className="size-4 text-primary" />Due {record.dueAt}</p></div>{canRenew ? <ConfirmDialog trigger={<Button variant="outline"><RefreshCw />Renew preview</Button>} title={`Renew ${book?.title}?`} description="This is a UI preview. The due date will not change in a library system." confirmLabel="Preview renewal" onConfirm={() => setRenewedId(record.id)} /> : <StatusBadge label={renewedId === record.id ? "Renewal preview ready" : record.renewalStatus === "used" ? "Renewal already used" : "Renewal unavailable"} tone={renewedId === record.id ? "success" : "muted"} />}</CardContent>
          </Card>
        );
      })}
    </div>
  );
}
