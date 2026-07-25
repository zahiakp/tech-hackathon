import { PreviewAlert } from "@/components/feedback/preview-alert";
import { PageHeader } from "@/components/layout/page-header";
import { SupportDirectory } from "@/features/support/components/support-directory";
import { supportPeople } from "@/lib/mock-data/support";

export default function CounsellorsPage() {
  return (
    <div className="grid gap-6">
      <PageHeader description="Browse confidential support for stress, anxiety, and personal well-being." eyebrow="Well-being" title="Browse counsellors" />
      <PreviewAlert description="Counsellor profiles and availability are preview data." />
      <SupportDirectory people={supportPeople} role="counsellor" />
    </div>
  );
}
