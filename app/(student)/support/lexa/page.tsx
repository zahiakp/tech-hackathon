import { ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageHeader } from "@/components/layout/page-header";
import { SupportChat } from "@/features/support/components/support-chat";
import type { SupportMessage } from "@/features/support/types";

const initialMessages: SupportMessage[] = [
  {
    id: "lexa-welcome",
    sender: "support",
    body: "Hi, I’m Lexa. I can help you find approved campus support, counselling, mentoring, and well-being resources.",
    time: "Now",
  },
  {
    id: "lexa-safety",
    sender: "support",
    body: "I’m not a therapist or an emergency service. If you are in immediate danger, use SOS or contact campus security now.",
    time: "Now",
  },
];

export default function LexaPage() {
  return (
    <div className="grid gap-6">
      <PageHeader
        description="Ask about approved campus resources, support people, and next steps."
        eyebrow="Vaxa support assistant"
        title="Talk with Lexa"
      />
      <Alert className="border-primary/20 bg-primary/5">
        <ShieldCheck />
        <AlertTitle>Resource guidance, not clinical care</AlertTitle>
        <AlertDescription>
          Lexa uses approved campus resources and automatically prioritizes SOS
          and human support when a message indicates immediate risk.
        </AlertDescription>
      </Alert>
      <SupportChat
        automated
        initialMessages={initialMessages}
        responseEndpoint="/support/lexa"
      />
    </div>
  );
}
