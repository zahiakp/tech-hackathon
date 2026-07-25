"use client";

import { useState, type FormEvent } from "react";
import { CalendarPlus } from "lucide-react";

import { PreviewAlert } from "@/components/feedback/preview-alert";
import { SuccessState } from "@/components/feedback/success-state";
import { FormActions } from "@/components/forms/form-actions";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function LeaveRequestForm() {
  const [type, setType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");
  const [complete, setComplete] = useState(false);
  const valid = Boolean(type && from && to && reason.trim());

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (valid) setComplete(true);
  }

  return (
    <form className="grid gap-6" onSubmit={submit}>
      <PreviewAlert description="This leave request is not submitted to faculty or stored." />
      {complete && <SuccessState title="Leave request preview ready" description="The form is complete for UI review." />}
      <FormField id="leave-type" label="Leave type" required>
        <Select onValueChange={(value) => setType(value ?? "")} value={type}>
          <SelectTrigger className="w-full" id="leave-type"><SelectValue placeholder="Choose leave type" /></SelectTrigger>
          <SelectContent><SelectItem value="medical">Medical</SelectItem><SelectItem value="personal">Personal</SelectItem><SelectItem value="academic">Academic duty</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent>
        </Select>
      </FormField>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="leave-from" label="From" required><Input id="leave-from" onChange={(event) => setFrom(event.target.value)} type="date" value={from} /></FormField>
        <FormField id="leave-to" label="To" required><Input id="leave-to" min={from} onChange={(event) => setTo(event.target.value)} type="date" value={to} /></FormField>
      </div>
      <FormField id="leave-reason" label="Reason" required><Textarea className="min-h-32" id="leave-reason" maxLength={600} onChange={(event) => setReason(event.target.value)} placeholder="Briefly explain the request..." value={reason} /></FormField>
      <FormActions><Button disabled={!valid} type="submit"><CalendarPlus />Preview leave request</Button></FormActions>
    </form>
  );
}
