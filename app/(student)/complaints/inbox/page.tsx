import { PageHeader } from "@/components/layout/page-header";
import { AnonymousInbox } from "@/features/complaints/components/anonymous-inbox";
import { anonymousInboxPreviewData } from "@/lib/mock-data/complaints";

export default function AnonymousInboxPage() {
  return (
    <div className="grid gap-6">
      <PageHeader
        description="Receive private follow-up without displaying student identity."
        eyebrow="Anonymous complaints"
        title="Private inbox"
      />
      <AnonymousInbox messages={anonymousInboxPreviewData} />
    </div>
  );
}
