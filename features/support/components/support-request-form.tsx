"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";

import { SuccessState } from "@/components/feedback/success-state";
import { FormActions } from "@/components/forms/form-actions";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function SupportRequestForm() {
  const [supportType, setSupportType] = useState("");
  const [urgency, setUrgency] = useState("");
  const [details, setDetails] = useState("");
  const [complete, setComplete] = useState(false);
  const valid = Boolean(supportType && urgency && details.trim());

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (valid) setComplete(true);
  }

  return (
    <form className="grid gap-6" onSubmit={submit}>

      {complete && (
        <SuccessState
          description="The request is complete for UI review. Nothing was submitted."
          title="Support request preview ready"
        />
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="support-type" label="Support type" required>
          <Select onValueChange={(value) => setSupportType(value ?? "")} value={supportType}>
            <SelectTrigger className="w-full" id="support-type">
              <SelectValue placeholder="Choose support" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="academic">Academic support</SelectItem>
              <SelectItem value="wellbeing">Well-being</SelectItem>
              <SelectItem value="career">Career guidance</SelectItem>
              <SelectItem value="personal">Personal support</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <FormField id="support-urgency" label="How soon?" required>
          <Select onValueChange={(value) => setUrgency(value ?? "")} value={urgency}>
            <SelectTrigger className="w-full" id="support-urgency">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="soon">As soon as possible</SelectItem>
              <SelectItem value="week">Within a week</SelectItem>
              <SelectItem value="flexible">I’m flexible</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </div>
      <FormField
        description="Avoid adding medical records or highly sensitive personal information."
        id="support-details"
        label="What support do you need?"
        required
      >
        <Textarea
          className="min-h-36"
          id="support-details"
          maxLength={1000}
          onChange={(event) => setDetails(event.target.value)}
          placeholder="Share enough context for the support team..."
          value={details}
        />
      </FormField>
      <FormActions>
        <Button disabled={!valid} type="submit">
          <Send />
          Preview request
        </Button>
      </FormActions>
    </form>
  );
}
