import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ComplaintAttachments } from "@/features/complaints/components/complaint-attachments";
import { ComplaintStatusBadge } from "@/features/complaints/components/complaint-status-badge";
import { ComplaintStatusTimeline } from "@/features/complaints/components/complaint-status-timeline";
import { complaintCategoryLabels } from "@/features/complaints/constants";
import { complaintPreviewData } from "@/lib/mock-data/complaints";

export default async function ComplaintDetailsPage({
  params,
}: {
  params: Promise<{ complaintId: string }>;
}) {
  const { complaintId } = await params;
  const complaint = complaintPreviewData.find(
    (item) => item.id === complaintId,
  );

  if (!complaint) {
    return (
      <EmptyState
        action={
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/complaints"
          >
            <ArrowLeft />
            Back to complaints
          </Link>
        }
        description="The requested preview complaint does not exist."
        title="Complaint not found"
      />
    );
  }

  const canRate =
    complaint.status === "resolved" || complaint.status === "closed";

  return (
    <div className="grid gap-6">
      <PageHeader
        action={
          canRate ? (
            <Link
              className={buttonVariants({ variant: "outline" })}
              href={`/complaints/${complaint.id}/rating`}
            >
              <Star />
              Rate resolution
            </Link>
          ) : undefined
        }
        description={complaint.summary}
        eyebrow={complaint.reference}
        title={complaint.title}
      />


      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.65fr)]">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>Status timeline</CardTitle>
                <CardDescription>
                  One shared pattern for every complaint state
                </CardDescription>
              </div>
              <ComplaintStatusBadge status={complaint.status} />
            </div>
          </CardHeader>
          <CardContent>
            <ComplaintStatusTimeline items={complaint.timeline} />
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Complaint details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Category</p>
                <p className="font-medium">
                  {complaintCategoryLabels[complaint.category]}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Submission</p>
                <p className="font-medium capitalize">{complaint.identity}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Submitted</p>
                <p className="font-medium">{complaint.submittedAt}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last updated</p>
                <p className="font-medium">{complaint.updatedAt}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evidence</CardTitle>
            </CardHeader>
            <CardContent>
              <ComplaintAttachments attachments={complaint.attachments} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
