export type ComplaintIdentity = "named" | "anonymous";

export type ComplaintStatus =
  | "submitted"
  | "assigned"
  | "in-review"
  | "awaiting-student"
  | "resolved"
  | "closed";

export type ComplaintCategory =
  | "academic"
  | "facilities"
  | "harassment"
  | "hostel"
  | "transport"
  | "other";

export type ComplaintTimelineItem = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: ComplaintStatus;
};

export type ComplaintAttachment = {
  id: string;
  name: string;
  type: string;
  size: string;
};

export type ComplaintRecord = {
  id: string;
  reference: string;
  title: string;
  summary: string;
  category: ComplaintCategory;
  submittedAt: string;
  updatedAt: string;
  status: ComplaintStatus;
  identity: ComplaintIdentity;
  attachments: ComplaintAttachment[];
  timeline: ComplaintTimelineItem[];
};

export type AnonymousInboxMessage = {
  id: string;
  subject: string;
  preview: string;
  receivedAt: string;
  unread: boolean;
};
