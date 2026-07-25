import { PageHeader } from "@/components/layout/page-header";
import { PreviewAlert } from "@/components/feedback/preview-alert";
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
      <PreviewAlert description="History is shown from isolated preview data until the complaints API is available." />
      <ComplaintHistory complaints={complaintPreviewData} />
    </div>
  );
}
