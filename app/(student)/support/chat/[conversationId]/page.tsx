import { PreviewAlert } from "@/components/feedback/preview-alert";
import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { SupportChat } from "@/features/support/components/support-chat";
import { supportMessages, supportPeople } from "@/lib/mock-data/support";

export default async function SupportChatPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  const person = supportPeople.find((item) => item.id === conversationId);
  if (!person) {
    return <EmptyState title="Conversation not found" description="Choose a mentor or counsellor to open a preview conversation." />;
  }
  return (
    <div className="grid gap-6">
      <PageHeader description={`${person.specialty} · ${person.languages.join(", ")}`} eyebrow="Private conversation" title={person.name} />
      <PreviewAlert description="Messages remain in local component state and are not sent or stored." />
      <SupportChat initialMessages={supportMessages} />
    </div>
  );
}
