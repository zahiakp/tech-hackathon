import { AlertTriangle, CircleDollarSign } from "lucide-react";

import { PreviewAlert } from "@/components/feedback/preview-alert";
import { PageHeader } from "@/components/layout/page-header";
import { DataCard } from "@/components/shared/data-card";
import { FineList } from "@/features/library/components/fine-list";
import { libraryBooks, libraryFines } from "@/lib/mock-data/library";

export default function LibraryFinesPage() {
  const due = libraryFines.filter((fine) => fine.status === "due");
  const total = due.reduce((sum, fine) => sum + fine.amount, 0);
  return <div className="grid gap-6"><PageHeader description="Review outstanding and resolved library charges." eyebrow="My library" title="Fine details" /><PreviewAlert description="Fine amounts and payment states are preview data. No payment action is connected." /><div className="grid gap-4 sm:grid-cols-2"><DataCard title="Outstanding total" value={`₹${total}`} description={`${due.length} fine requiring attention`} icon={CircleDollarSign} /><DataCard title="Overdue items" value={1} description="Return overdue books to prevent additional charges" icon={AlertTriangle} /></div><FineList books={libraryBooks} fines={libraryFines} /></div>;
}
