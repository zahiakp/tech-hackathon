import Link from "next/link";
import { FilePlus2 } from "lucide-react";

import { PreviewAlert } from "@/components/feedback/preview-alert";
import { PageHeader } from "@/components/layout/page-header";
import { buttonVariants } from "@/components/ui/button";
import { ComplaintsOverview } from "@/features/complaints/components/complaints-overview";
import { complaintPreviewData } from "@/lib/mock-data/complaints";

export default function ComplaintsPage() {
  return (
    <div className="grid gap-6">
      <PageHeader
        action={
          <Link className={buttonVariants()} href="/complaints/new">
            <FilePlus2 />
            New complaint
          </Link>
        }
        description="Track named and anonymous complaints through one consistent status flow."
        eyebrow="Student support"
        title="Complaints"
      />
      <PreviewAlert description="Complaint records are typed preview data and are not loaded from or saved to a backend." />
      <ComplaintsOverview complaints={complaintPreviewData} />
    </div>
  );
}
