"use client";

import { useState, type FormEvent } from "react";
import { Send, Star } from "lucide-react";

import { PreviewAlert } from "@/components/feedback/preview-alert";
import { SuccessState } from "@/components/feedback/success-state";
import { FormActions } from "@/components/forms/form-actions";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function EventFeedbackForm() {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [complete, setComplete] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rating) setComplete(true);
  }

  return (
    <form className="grid gap-6" onSubmit={submit}>
      <PreviewAlert description="Feedback is not sent or stored." />
      {complete && <SuccessState title="Feedback preview ready" description="Your rating is complete for UI review." />}
      <FormField id="event-rating" label="Overall experience" required>
        <div className="flex gap-1" id="event-rating">
          {[1, 2, 3, 4, 5].map((value) => (
            <Button aria-label={`${value} stars`} key={value} onClick={() => setRating(value)} size="icon" type="button" variant="ghost">
              <Star className={cn("size-6", value <= rating && "fill-amber-400 text-amber-500")} />
            </Button>
          ))}
        </div>
      </FormField>
      <FormField id="event-feedback" label="Tell us more">
        <Textarea id="event-feedback" maxLength={800} onChange={(event) => setFeedback(event.target.value)} placeholder="What worked well? What could improve?" value={feedback} />
      </FormField>
      <FormActions><Button disabled={!rating} type="submit"><Send />Preview feedback</Button></FormActions>
    </form>
  );
}
