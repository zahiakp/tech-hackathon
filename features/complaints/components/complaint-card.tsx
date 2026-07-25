import Link from "next/link";
import { ArrowRight, EyeOff, UserRound } from "lucide-react";

import { ComplaintStatusBadge } from "@/features/complaints/components/complaint-status-badge";
import { complaintCategoryLabels } from "@/features/complaints/constants";
import type { ComplaintRecord } from "@/features/complaints/types";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ComplaintCardProps = {
  complaint: ComplaintRecord;
};

export function ComplaintCard({ complaint }: ComplaintCardProps) {
  const IdentityIcon = complaint.identity === "anonymous" ? EyeOff : UserRound;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-medium text-muted-foreground">
            {complaint.reference}
          </p>
          <ComplaintStatusBadge status={complaint.status} />
        </div>
        <CardTitle>{complaint.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {complaint.summary}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm">
        <p>
          <span className="text-muted-foreground">Category:</span>{" "}
          {complaintCategoryLabels[complaint.category]}
        </p>
        <p className="flex items-center gap-1.5">
          <IdentityIcon className="size-4 text-muted-foreground" aria-hidden="true" />
          <span className="capitalize">{complaint.identity}</span>
        </p>
        <p className="text-xs text-muted-foreground">
          Updated {complaint.updatedAt}
        </p>
      </CardContent>
      <CardFooter>
        <Link
          className={buttonVariants({ variant: "ghost" })}
          href={`/complaints/${complaint.id}`}
        >
          Track complaint
          <ArrowRight />
        </Link>
      </CardFooter>
    </Card>
  );
}
