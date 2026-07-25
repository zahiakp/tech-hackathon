"use client";

import { useState, type FormEvent } from "react";
import { Bot, Send, UserRound } from "lucide-react";

import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
} from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SupportMessage } from "@/features/support/types";

export function SupportChat({
  initialMessages,
  automated = false,
}: {
  initialMessages: SupportMessage[];
  automated?: boolean;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = draft.trim();
    if (!body) return;
    setMessages((current) => [
      ...current,
      {
        id: `local-${current.length}`,
        sender: "student",
        body,
        time: "Now",
      },
    ]);
    setDraft("");
  }

  return (
    <div className="grid min-h-[34rem] grid-rows-[1fr_auto] overflow-hidden rounded-xl border bg-card">
      <MessageScrollerProvider>
        <MessageScroller>
          <MessageScrollerViewport>
            <MessageScrollerContent className="p-4 sm:p-6">
              {messages.map((message) => (
                <MessageScrollerItem key={message.id}>
                  <Message align={message.sender === "student" ? "end" : "start"}>
                    <MessageAvatar>
                      {message.sender === "student" ? (
                        <UserRound className="size-4" />
                      ) : automated ? (
                        <Bot className="size-4" />
                      ) : (
                        <span className="text-xs font-semibold">AM</span>
                      )}
                    </MessageAvatar>
                    <MessageContent>
                      <MessageGroup
                        className={
                          message.sender === "student"
                            ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-primary-foreground"
                            : "max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-4 py-3"
                        }
                      >
                        <p className="leading-6">{message.body}</p>
                      </MessageGroup>
                      <MessageFooter>{message.time}</MessageFooter>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
      <form className="flex gap-2 border-t p-3" onSubmit={send}>
        <Input
          aria-label="Message"
          onChange={(event) => setDraft(event.target.value)}
          placeholder={automated ? "Ask about well-being resources..." : "Write a message..."}
          value={draft}
        />
        <Button aria-label="Send message" disabled={!draft.trim()} size="icon" type="submit">
          <Send />
        </Button>
      </form>
    </div>
  );
}
