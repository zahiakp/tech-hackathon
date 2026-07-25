import { Inbox, Mail, MailOpen } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { PreviewAlert } from "@/components/feedback/preview-alert";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AnonymousInboxMessage } from "@/features/complaints/types";

type AnonymousInboxProps = {
  messages: AnonymousInboxMessage[];
};

export function AnonymousInbox({ messages }: AnonymousInboxProps) {
  return (
    <div className="grid gap-6">
      <PreviewAlert description="Messages are preview data. A real anonymous inbox needs a secure access token and backend ownership checks." />
      {messages.length === 0 ? (
        <EmptyState
          description="Private replies to anonymous complaints will appear here."
          icon={Inbox}
          title="Inbox is empty"
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Private messages</CardTitle>
            <CardDescription>
              Follow-up without displaying student identity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {messages.map((message) => {
                const Icon = message.unread ? Mail : MailOpen;

                return (
                  <li className="flex gap-3 py-4 first:pt-0 last:pb-0" key={message.id}>
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-medium">{message.subject}</p>
                        {message.unread && (
                          <StatusBadge label="New" tone="info" />
                        )}
                      </div>
                      <p className="mt-1 text-sm leading-5 text-muted-foreground">
                        {message.preview}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {message.receivedAt}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
