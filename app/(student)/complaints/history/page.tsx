import { PageHeader } from "@/components/layout/page-header";
import { ComplaintHistory } from "@/features/complaints/components/complaint-history";
import { complaintPreviewData } from "@/lib/mock-data/complaints";

export default function ComplaintHistoryPage() {
  return (
    <div className="grid gap-6">
      <PageHeader
        description="Review every complaint in a mobile list or desktop table."
        eyebrow="Complaints"
        title="Complaint history"
      />

      <ComplaintHistory complaints={complaintPreviewData} />
    </div>
  );
}
