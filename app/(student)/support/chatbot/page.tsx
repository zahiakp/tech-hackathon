import { PreviewAlert } from "@/components/feedback/preview-alert";
import { PageHeader } from "@/components/layout/page-header";
import { SupportChat } from "@/features/support/components/support-chat";
import type { SupportMessage } from "@/features/support/types";

const chatbotMessages: SupportMessage[] = [
  { id: "bot-1", sender: "support", body: "Hi, I can help you find campus support and well-being resources. I’m a UI preview, not an emergency or clinical service.", time: "Now" },
  { id: "bot-2", sender: "support", body: "You can ask about mentors, counselling, stress resources, or booking an appointment.", time: "Now" },
];

export default function ChatbotPage() {
  return (
    <div className="grid gap-6">
      <PageHeader description="Explore campus support options through a guided conversation." eyebrow="Well-being assistant" title="How can we help?" />
      <PreviewAlert description="This chatbot has no AI or backend connection. Typed messages remain local and receive no automated response." />
      <SupportChat automated initialMessages={chatbotMessages} />
    </div>
  );
}
