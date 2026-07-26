import Link from "next/link";
import { FilePlus2 } from "lucide-react";

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

      <ComplaintsOverview complaints={complaintPreviewData} />
    </div>
  );
}
