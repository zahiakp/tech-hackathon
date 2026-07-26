"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Flame,
  HeartPulse,
  HelpCircle,
  ShieldAlert,
  UserRoundCheck,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type {
  EmergencyType,
  EmergencyTypeId,
} from "@/features/sos/types";
import { cn } from "@/lib/utils";

type EmergencyTypeSelectorProps = {
  types: EmergencyType[];
};

const typeIcons: Record<EmergencyTypeId, LucideIcon> = {
  medical: HeartPulse,
  security: ShieldAlert,
  fire: Flame,
  "personal-safety": UserRoundCheck,
  other: HelpCircle,
};

export function EmergencyTypeSelector({
  types,
}: EmergencyTypeSelectorProps) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<EmergencyTypeId | "">("");

  return (
    <div className="grid gap-6">


      <RadioGroup
        aria-label="Emergency type"
        onValueChange={(value) => setSelectedType(value as EmergencyTypeId)}
        value={selectedType}
      >
        {types.map((type) => {
          const Icon = typeIcons[type.id];
          const isSelected = selectedType === type.id;

          return (
            <Label
              className={cn(
                "min-h-20 cursor-pointer items-start rounded-xl border p-4 transition-colors",
                "hover:border-primary/40 hover:bg-primary/5",
                isSelected && "border-primary bg-primary/5 ring-2 ring-primary/15",
              )}
              htmlFor={type.id}
              key={type.id}
            >
              <RadioGroupItem id={type.id} value={type.id} />
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-foreground">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="grid gap-1">
                <span className="font-semibold">{type.title}</span>
                <span className="text-sm font-normal leading-5 text-muted-foreground">
                  {type.description}
                </span>
              </span>
            </Label>
          );
        })}
      </RadioGroup>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button onClick={() => router.push("/sos")} type="button" variant="outline">
          <ArrowLeft />
          Back
        </Button>
        <Button
          disabled={!selectedType}
          onClick={() => router.push(`/sos/location?type=${selectedType}`)}
          type="button"
        >
          Continue
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
