"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  EyeOff,
  FileUp,
  Paperclip,
  Send,
  Trash2,
  UserRound,
} from "lucide-react";

import { FormActions } from "@/components/forms/form-actions";
import { FormField } from "@/components/forms/form-field";
import { PreviewAlert } from "@/components/feedback/preview-alert";
import { SuccessState } from "@/components/feedback/success-state";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { complaintCategories } from "@/features/complaints/constants";
import type {
  ComplaintCategory,
  ComplaintIdentity,
} from "@/features/complaints/types";
import { cn } from "@/lib/utils";

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ComplaintForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [identity, setIdentity] = useState<ComplaintIdentity>("named");
  const [category, setCategory] = useState<ComplaintCategory | "">("");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previewComplete, setPreviewComplete] = useState(false);

  const canPreview = Boolean(category && title.trim() && details.trim());

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    setFiles(Array.from(event.target.files ?? []).slice(0, 4));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canPreview) {
      setPreviewComplete(true);
    }
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit}>
      <PreviewAlert description="This form does not create or upload a complaint. Data and selected files remain local to the current UI preview." />

      {previewComplete && (
        <SuccessState
          description="The form is complete for UI review. Nothing was saved or sent."
          title="Complaint preview ready"
        />
      )}

      <FormField
        description="Anonymous complaints use a private inbox instead of displaying your identity."
        id="complaint-identity"
        label="How would you like to submit?"
        required
      >
        <RadioGroup
          className="grid gap-3 sm:grid-cols-2"
          onValueChange={(value) => setIdentity(value as ComplaintIdentity)}
          value={identity}
        >
          {[
            {
              value: "named" as const,
              label: "Named complaint",
              description: "Your student identity is attached.",
              icon: UserRound,
            },
            {
              value: "anonymous" as const,
              label: "Anonymous complaint",
              description: "Follow-up happens through a private inbox.",
              icon: EyeOff,
            },
          ].map((option) => (
            <Label
              className={cn(
                "min-h-20 cursor-pointer items-start rounded-xl border p-4",
                identity === option.value &&
                  "border-primary bg-primary/5 ring-2 ring-primary/15",
              )}
              htmlFor={`identity-${option.value}`}
              key={option.value}
            >
              <RadioGroupItem
                id={`identity-${option.value}`}
                value={option.value}
              />
              <option.icon className="size-5 shrink-0 text-primary" aria-hidden="true" />
              <span className="grid gap-1">
                <span className="font-semibold">{option.label}</span>
                <span className="text-sm font-normal leading-5 text-muted-foreground">
                  {option.description}
                </span>
              </span>
            </Label>
          ))}
        </RadioGroup>
      </FormField>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField id="complaint-category" label="Category" required>
          <Select
            onValueChange={(value) => setCategory(value as ComplaintCategory)}
            value={category}
          >
            <SelectTrigger className="h-11 w-full" id="complaint-category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {complaintCategories.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField id="complaint-title" label="Subject" required>
          <Input
            className="h-11"
            id="complaint-title"
            maxLength={120}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Briefly describe the issue"
            value={title}
          />
        </FormField>
      </div>

      <FormField
        description="Include where and when the issue happened, without sharing unnecessary sensitive information."
        id="complaint-details"
        label="Complaint details"
        required
      >
        <Textarea
          className="min-h-36 resize-y"
          id="complaint-details"
          maxLength={1500}
          onChange={(event) => setDetails(event.target.value)}
          placeholder="Explain what happened and what support you need..."
          value={details}
        />
      </FormField>

      <FormField
        description="Up to four images or PDF documents. Files are previewed locally and not uploaded."
        id="complaint-evidence"
        label="Evidence"
      >
        <Input
          accept="image/*,.pdf"
          className="sr-only"
          id="complaint-evidence"
          multiple
          onChange={handleFiles}
          ref={fileInputRef}
          type="file"
        />
        <Button
          className="w-full justify-center border-dashed sm:w-fit"
          onClick={() => fileInputRef.current?.click()}
          type="button"
          variant="outline"
        >
          <FileUp />
          Choose evidence
        </Button>

        {files.length > 0 && (
          <AttachmentGroup className="mt-2">
            {files.map((file) => (
              <Attachment key={`${file.name}-${file.lastModified}`}>
                <AttachmentMedia>
                  <Paperclip aria-hidden="true" />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>{file.name}</AttachmentTitle>
                  <AttachmentDescription>
                    {formatFileSize(file.size)} · Local preview
                  </AttachmentDescription>
                </AttachmentContent>
                <AttachmentActions>
                  <AttachmentAction
                    aria-label={`Remove ${file.name}`}
                    onClick={() =>
                      setFiles((current) =>
                        current.filter(
                          (item) =>
                            !(
                              item.name === file.name &&
                              item.lastModified === file.lastModified
                            ),
                        ),
                      )
                    }
                    type="button"
                  >
                    <Trash2 />
                  </AttachmentAction>
                </AttachmentActions>
              </Attachment>
            ))}
          </AttachmentGroup>
        )}
      </FormField>

      <FormActions>
        <Button
          onClick={() => {
            setCategory("");
            setTitle("");
            setDetails("");
            setFiles([]);
            setPreviewComplete(false);
          }}
          type="button"
          variant="outline"
        >
          Clear
        </Button>
        <Button disabled={!canPreview} type="submit">
          <Send />
          Preview submission
        </Button>
      </FormActions>
    </form>
  );
}
