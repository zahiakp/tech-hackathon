"use client";

import { useState, type FormEvent } from "react";
import { CalendarCheck } from "lucide-react";

import { PreviewAlert } from "@/components/feedback/preview-alert";
import { SuccessState } from "@/components/feedback/success-state";
import { FormActions } from "@/components/forms/form-actions";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supportPeople } from "@/lib/mock-data/support";
import { cn } from "@/lib/utils";

const appointmentTimes = ["10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM"];

export function AppointmentBookingForm({
  initialPersonId,
}: {
  initialPersonId?: string;
}) {
  const validInitial = supportPeople.some((person) => person.id === initialPersonId);
  const [personId, setPersonId] = useState(validInitial ? initialPersonId! : "");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [mode, setMode] = useState("video");
  const [complete, setComplete] = useState(false);
  const valid = Boolean(personId && date && time);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (valid) setComplete(true);
  }

  return (
    <form className="grid gap-6" onSubmit={submit}>
      <PreviewAlert description="Availability is preview data. This booking is not written to a calendar or backend." />
      {complete && (
        <SuccessState
          description="The selected slot is ready for UI review. No appointment was created."
          title="Appointment preview ready"
        />
      )}
      <FormField id="appointment-person" label="Mentor or counsellor" required>
        <Select onValueChange={(value) => setPersonId(value ?? "")} value={personId}>
          <SelectTrigger className="w-full" id="appointment-person">
            <SelectValue placeholder="Choose a person" />
          </SelectTrigger>
          <SelectContent>
            {supportPeople.map((person) => (
              <SelectItem key={person.id} value={person.id}>
                {person.name} · {person.specialty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <div className="grid items-start gap-6 lg:grid-cols-[auto_1fr]">
        <FormField id="appointment-date" label="Date" required>
          <Calendar
            className="rounded-xl border"
            disabled={{ before: new Date(2026, 6, 25) }}
            mode="single"
            onSelect={setDate}
            selected={date}
          />
        </FormField>
        <div className="grid gap-6">
          <FormField id="appointment-time" label="Time" required>
            <RadioGroup
              className="grid grid-cols-2 gap-2"
              onValueChange={setTime}
              value={time}
            >
              {appointmentTimes.map((slot) => (
                <Label
                  className={cn(
                    "cursor-pointer justify-center rounded-lg border p-3",
                    time === slot && "border-primary bg-primary/5",
                  )}
                  htmlFor={`time-${slot}`}
                  key={slot}
                >
                  <RadioGroupItem id={`time-${slot}`} value={slot} />
                  {slot}
                </Label>
              ))}
            </RadioGroup>
          </FormField>
          <FormField id="appointment-mode" label="Meeting mode">
            <RadioGroup
              className="grid gap-2 sm:grid-cols-2"
              onValueChange={setMode}
              value={mode}
            >
              <Label className="rounded-lg border p-3" htmlFor="mode-video">
                <RadioGroupItem id="mode-video" value="video" />
                Video call
              </Label>
              <Label className="rounded-lg border p-3" htmlFor="mode-person">
                <RadioGroupItem id="mode-person" value="person" />
                In person
              </Label>
            </RadioGroup>
          </FormField>
        </div>
      </div>
      <FormActions>
        <Button disabled={!valid} type="submit">
          <CalendarCheck />
          Preview appointment
        </Button>
      </FormActions>
    </form>
  );
}
