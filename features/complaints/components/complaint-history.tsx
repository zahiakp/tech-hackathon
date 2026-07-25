import Link from "next/link";
import { ArrowRight, History } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { ComplaintCard } from "@/features/complaints/components/complaint-card";
import { ComplaintStatusBadge } from "@/features/complaints/components/complaint-status-badge";
import { complaintCategoryLabels } from "@/features/complaints/constants";
import type { ComplaintRecord } from "@/features/complaints/types";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ComplaintHistoryProps = {
  complaints: ComplaintRecord[];
};

export function ComplaintHistory({ complaints }: ComplaintHistoryProps) {
  if (complaints.length === 0) {
    return (
      <EmptyState
        description="Submitted complaint records will appear here."
        icon={History}
        title="No complaint history"
      />
    );
  }

  return (
    <>
      <div className="grid gap-4 md:hidden">
        {complaints.map((complaint) => (
          <ComplaintCard complaint={complaint} key={complaint.id} />
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-xl border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Complaint</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {complaints.map((complaint) => (
              <TableRow key={complaint.id}>
                <TableCell className="font-mono text-xs">
                  {complaint.reference}
                </TableCell>
                <TableCell className="max-w-64">
                  <p className="truncate font-medium">{complaint.title}</p>
                </TableCell>
                <TableCell>
                  {complaintCategoryLabels[complaint.category]}
                </TableCell>
                <TableCell>{complaint.submittedAt}</TableCell>
                <TableCell>
                  <ComplaintStatusBadge status={complaint.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    aria-label={`View ${complaint.reference}`}
                    className={buttonVariants({
                      variant: "ghost",
                      size: "icon-sm",
                    })}
                    href={`/complaints/${complaint.id}`}
                  >
                    <ArrowRight />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
