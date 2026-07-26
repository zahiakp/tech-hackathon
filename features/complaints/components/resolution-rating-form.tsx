"use client";

import { useState, type FormEvent } from "react";
import { Star } from "lucide-react";

import { FormActions } from "@/components/forms/form-actions";
import { FormField } from "@/components/forms/form-field";
import { SuccessState } from "@/components/feedback/success-state";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function ResolutionRatingForm() {
  const [rating, setRating] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rating) {
      setSubmitted(true);
    }
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit}>

      {submitted && (
        <SuccessState
          description="The rating interaction is complete, but no feedback was submitted."
          title="Rating preview complete"
        />
      )}

      <FormField
        description="Choose one star for poor and five stars for excellent."
        id="resolution-rating"
        label="How satisfied are you with the resolution?"
        required
      >
        <RadioGroup
          className="grid grid-cols-5 gap-2"
          onValueChange={setRating}
          value={rating}
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <Label
              className={cn(
                "min-h-16 cursor-pointer flex-col justify-center rounded-xl border p-2",
                Number(rating) === value &&
                  "border-primary bg-primary/5 ring-2 ring-primary/15",
              )}
              htmlFor={`rating-${value}`}
              key={value}
            >
              <RadioGroupItem
                className="sr-only"
                id={`rating-${value}`}
                value={String(value)}
              />
              <Star
                className={cn(
                  "size-6",
                  Number(rating) >= value
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground",
                )}
                aria-hidden="true"
              />
              <span className="text-xs">{value}</span>
            </Label>
          ))}
        </RadioGroup>
      </FormField>

      <FormField
        description="Optional feedback about what went well or could improve."
        id="rating-feedback"
        label="Additional feedback"
      >
        <Textarea
          className="min-h-28"
          id="rating-feedback"
          placeholder="Share your feedback..."
        />
      </FormField>

      <FormActions>
        <Button disabled={!rating} type="submit">
          Preview rating
        </Button>
      </FormActions>
    </form>
  );
}
