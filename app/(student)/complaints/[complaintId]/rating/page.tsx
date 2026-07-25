import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ResolutionRatingForm } from "@/features/complaints/components/resolution-rating-form";
import { complaintPreviewData } from "@/lib/mock-data/complaints";

export default async function ResolutionRatingPage({
  params,
}: {
  params: Promise<{ complaintId: string }>;
}) {
  const { complaintId } = await params;
  const complaint = complaintPreviewData.find(
    (item) => item.id === complaintId,
  );

  if (
    !complaint ||
    (complaint.status !== "resolved" && complaint.status !== "closed")
  ) {
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
        description="Rating becomes available after a complaint is resolved."
        title="Resolution rating unavailable"
      />
    );
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        description={`Share feedback for ${complaint.reference}.`}
        eyebrow="Complaint resolution"
        title="Rate your experience"
      />
      <Card className="max-w-2xl">
        <CardContent>
          <ResolutionRatingForm />
        </CardContent>
      </Card>
    </div>
  );
}
