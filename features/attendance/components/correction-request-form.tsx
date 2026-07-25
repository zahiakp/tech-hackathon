"use client";

import { useState, type FormEvent } from "react";
import { CheckCheck } from "lucide-react";

import { PreviewAlert } from "@/components/feedback/preview-alert";
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
import { dailyAttendancePreview } from "@/lib/mock-data/attendance";

export function CorrectionRequestForm() {
  const [recordId, setRecordId] = useState("");
  const [expected, setExpected] = useState("");
  const [reason, setReason] = useState("");
  const [complete, setComplete] = useState(false);
  const valid = Boolean(recordId && expected && reason.trim());

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (valid) setComplete(true);
  }

  return (
    <form className="grid gap-6" onSubmit={submit}>
      <PreviewAlert description="This correction request is not submitted or applied to attendance records." />
      {complete && <SuccessState title="Correction preview ready" description="The selected record and explanation are ready for UI review." />}
      <FormField id="attendance-record" label="Attendance record" required>
        <Select onValueChange={(value) => setRecordId(value ?? "")} value={recordId}>
          <SelectTrigger className="w-full" id="attendance-record"><SelectValue placeholder="Choose a class record" /></SelectTrigger>
          <SelectContent>{dailyAttendancePreview.map((record) => <SelectItem key={record.id} value={record.id}>{record.date} · {record.subject} · {record.status}</SelectItem>)}</SelectContent>
        </Select>
      </FormField>
      <FormField id="expected-status" label="Expected status" required>
        <Select onValueChange={(value) => setExpected(value ?? "")} value={expected}>
          <SelectTrigger className="w-full" id="expected-status"><SelectValue placeholder="Choose corrected status" /></SelectTrigger>
          <SelectContent><SelectItem value="present">Present</SelectItem><SelectItem value="late">Late</SelectItem><SelectItem value="excused">Excused</SelectItem></SelectContent>
        </Select>
      </FormField>
      <FormField id="correction-reason" label="Explanation" required><Textarea className="min-h-32" id="correction-reason" maxLength={600} onChange={(event) => setReason(event.target.value)} placeholder="Explain why this record should be reviewed..." value={reason} /></FormField>
      <FormActions><Button disabled={!valid} type="submit"><CheckCheck />Preview correction</Button></FormActions>
    </form>
  );
}
