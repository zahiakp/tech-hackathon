"use client";

import { useState, type FormEvent } from "react";
import { Bot, LoaderCircle, Send, UserRound } from "lucide-react";
import { Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup } from "@/components/ui/message";
import { MessageScroller, MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport } from "@/components/ui/message-scroller";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SupportMessage } from "@/features/support/types";
import { ApiClientError, apiFetch } from "@/lib/api-client";

type LexaResponse = {
  answer: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "IMMINENT";
  escalate: boolean;
  recommendedResources: Array<{ id: string; title: string; contact: string | null; url: string | null }>;
};

export function SupportChat({ initialMessages, automated = false, responseEndpoint }: { initialMessages: SupportMessage[]; automated?: boolean; responseEndpoint?: string }) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = draft.trim();
    if (!body || sending) return;
    const userMessage: SupportMessage = { id: crypto.randomUUID(), sender: "student", body, time: "Now" };
    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setError("");
    if (!responseEndpoint) return;

    setSending(true);
    try {
      const response = await apiFetch<LexaResponse>(responseEndpoint, { method: "POST", body: JSON.stringify({ message: body }) });
      const resources = response.data.recommendedResources.map((resource) => `${resource.title}${resource.contact ? ` — ${resource.contact}` : ""}`);
      setMessages((current) => [...current, { id: crypto.randomUUID(), sender: "support", body: [response.data.answer, resources.length ? `Recommended: ${resources.join("; ")}` : ""].filter(Boolean).join("\n\n"), time: "Now" }]);
    } catch (cause) {
      setError(cause instanceof ApiClientError ? cause.message : "Lexa could not respond. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="grid min-h-[34rem] grid-rows-[1fr_auto] overflow-hidden rounded-xl border bg-card">
      <MessageScrollerProvider><MessageScroller><MessageScrollerViewport><MessageScrollerContent className="p-4 sm:p-6">{messages.map((message) => <MessageScrollerItem key={message.id}><Message align={message.sender === "student" ? "end" : "start"}><MessageAvatar>{message.sender === "student" ? <UserRound className="size-4" /> : automated ? <Bot className="size-4" /> : <span className="text-xs font-semibold">AM</span>}</MessageAvatar><MessageContent><MessageGroup className={message.sender === "student" ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-primary-foreground" : "max-w-[85%] whitespace-pre-line rounded-2xl rounded-bl-sm bg-muted px-4 py-3"}><p className="leading-6">{message.body}</p></MessageGroup><MessageFooter>{message.time}</MessageFooter></MessageContent></Message></MessageScrollerItem>)}</MessageScrollerContent></MessageScrollerViewport><MessageScrollerButton /></MessageScroller></MessageScrollerProvider>
      <div className="border-t"><form className="flex gap-2 p-3" onSubmit={send}><Input aria-label="Message" onChange={(event) => setDraft(event.target.value)} placeholder={automated ? "Ask Lexa about campus support..." : "Write a message..."} value={draft} /><Button aria-label="Send message" disabled={!draft.trim() || sending} size="icon" type="submit">{sending ? <LoaderCircle className="animate-spin" /> : <Send />}</Button></form>{error && <p className="px-3 pb-3 text-sm text-destructive">{error}</p>}</div>
    </div>
  );
}