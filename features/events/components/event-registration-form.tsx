"use client";

import { useState, type FormEvent } from "react";
import { TicketCheck } from "lucide-react";

import { SuccessState } from "@/components/feedback/success-state";
import { FormActions } from "@/components/forms/form-actions";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import type { EventRecord, EventSession } from "@/features/events/types";

export function EventRegistrationForm({ event, sessions }: { event: EventRecord; sessions: EventSession[] }) {
  const [sessionId, setSessionId] = useState(sessions[0]?.id ?? "");
  const [notes, setNotes] = useState("");
  const [complete, setComplete] = useState(false);

  function submit(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    if (sessionId) setComplete(true);
  }

  return (
    <form className="grid gap-6" onSubmit={submit}>

      {complete && <SuccessState title="Registration preview ready" description={`Your preview selection for ${event.title} is complete.`} />}
      <FormField id="event-session" label="Preferred sub-session" required>
        <RadioGroup className="grid gap-3" onValueChange={setSessionId} value={sessionId}>
          {sessions.map((session) => (
            <Label className="items-start rounded-xl border p-4" htmlFor={session.id} key={session.id}>
              <RadioGroupItem id={session.id} value={session.id} />
              <span className="grid gap-1">
                <span className="font-medium">{session.title}</span>
                <span className="text-sm font-normal text-muted-foreground">{session.time} · {session.venue} · {session.speaker}</span>
              </span>
            </Label>
          ))}
        </RadioGroup>
      </FormField>
      <FormField id="accessibility-notes" label="Accessibility or participation notes" description="Optional. Share only information needed by the event team.">
        <Textarea id="accessibility-notes" maxLength={500} onChange={(event) => setNotes(event.target.value)} placeholder="Optional notes..." value={notes} />
      </FormField>
      <FormActions>
        <Button disabled={!sessionId} type="submit"><TicketCheck />Preview registration</Button>
      </FormActions>
    </form>
  );
}
