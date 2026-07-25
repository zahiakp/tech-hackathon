import { FileImage, FileText } from "lucide-react";

import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import type { ComplaintAttachment } from "@/features/complaints/types";

type ComplaintAttachmentsProps = {
  attachments: ComplaintAttachment[];
};

export function ComplaintAttachments({
  attachments,
}: ComplaintAttachmentsProps) {
  if (attachments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No evidence was attached to this complaint.
      </p>
    );
  }

  return (
    <AttachmentGroup aria-label="Complaint evidence">
      {attachments.map((attachment) => {
        const Icon = attachment.type === "PDF" ? FileText : FileImage;

        return (
          <Attachment key={attachment.id}>
            <AttachmentMedia>
              <Icon aria-hidden="true" />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{attachment.name}</AttachmentTitle>
              <AttachmentDescription>
                {attachment.type} · {attachment.size}
              </AttachmentDescription>
            </AttachmentContent>
          </Attachment>
        );
      })}
    </AttachmentGroup>
  );
}
