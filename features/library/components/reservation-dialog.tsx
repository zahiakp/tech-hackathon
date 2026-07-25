"use client";

import { useState } from "react";
import { BookmarkPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { LibraryBook } from "@/features/library/types";

export function ReservationDialog({ book }: { book: LibraryBook }) {
  const [complete, setComplete] = useState(false);
  return (
    <Dialog onOpenChange={(open) => { if (!open) setComplete(false); }}>
      <DialogTrigger render={<Button />}><BookmarkPlus />{book.availability === "unavailable" ? "Join waitlist" : "Reserve book"}</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{complete ? "Reservation preview ready" : `Reserve ${book.title}?`}</DialogTitle><DialogDescription>{complete ? "No reservation was saved or sent to the library system." : `${book.availableCopies} of ${book.totalCopies} preview copies are available. The library will normally hold an available copy for a limited pickup window.`}</DialogDescription></DialogHeader>
        {!complete && <div className="rounded-xl bg-muted/50 p-4 text-sm"><p className="font-medium">{book.title}</p><p className="text-muted-foreground">{book.author}</p><p className="mt-3">Pickup shelf: {book.shelf}</p></div>}
        <DialogFooter>{complete ? <DialogClose render={<Button />}>Done</DialogClose> : <><DialogClose render={<Button variant="outline" />}>Cancel</DialogClose><Button onClick={() => setComplete(true)}>Preview reservation</Button></>}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
