import type {
  AnonymousInboxMessage,
  ComplaintRecord,
} from "@/features/complaints/types";

export const complaintPreviewData: ComplaintRecord[] = [
  {
    id: "complaint-1",
    reference: "CMP-1042",
    title: "Broken lights near the north block",
    summary:
      "Several pathway lights near the north academic block have not been working after sunset.",
    category: "facilities",
    submittedAt: "22 Jul 2026",
    updatedAt: "25 Jul 2026",
    status: "in-review",
    identity: "named",
    attachments: [
      {
        id: "attachment-1",
        name: "north-block-lights.jpg",
        type: "Image",
        size: "1.8 MB",
      },
    ],
    timeline: [
      {
        id: "timeline-1",
        title: "Complaint submitted",
        description: "Your complaint was recorded for review.",
        timestamp: "22 Jul, 10:15 AM",
        status: "submitted",
      },
      {
        id: "timeline-2",
        title: "Assigned to facilities",
        description: "The campus facilities team received the complaint.",
        timestamp: "23 Jul, 9:05 AM",
        status: "assigned",
      },
      {
        id: "timeline-3",
        title: "Inspection in progress",
        description: "A maintenance inspection has been scheduled.",
        timestamp: "25 Jul, 2:40 PM",
        status: "in-review",
      },
    ],
  },
  {
    id: "complaint-2",
    reference: "CMP-1018",
    title: "Crowding on the evening shuttle",
    summary:
      "The evening shuttle is frequently overcrowded during the final departure.",
    category: "transport",
    submittedAt: "12 Jul 2026",
    updatedAt: "20 Jul 2026",
    status: "resolved",
    identity: "anonymous",
    attachments: [],
    timeline: [
      {
        id: "timeline-4",
        title: "Anonymous complaint submitted",
        description: "A private inbox was created for follow-up messages.",
        timestamp: "12 Jul, 4:30 PM",
        status: "submitted",
      },
      {
        id: "timeline-5",
        title: "Transport team review",
        description: "The transport team reviewed passenger demand.",
        timestamp: "15 Jul, 11:20 AM",
        status: "in-review",
      },
      {
        id: "timeline-6",
        title: "Additional shuttle scheduled",
        description: "A second evening shuttle was added for peak days.",
        timestamp: "20 Jul, 3:00 PM",
        status: "resolved",
      },
    ],
  },
  {
    id: "complaint-3",
    reference: "CMP-0996",
    title: "Incorrect internal assessment entry",
    summary:
      "One internal assessment mark does not match the evaluated answer sheet.",
    category: "academic",
    submittedAt: "01 Jul 2026",
    updatedAt: "04 Jul 2026",
    status: "closed",
    identity: "named",
    attachments: [
      {
        id: "attachment-2",
        name: "assessment-copy.pdf",
        type: "PDF",
        size: "640 KB",
      },
    ],
    timeline: [
      {
        id: "timeline-7",
        title: "Complaint submitted",
        description: "The academic office received the correction request.",
        timestamp: "01 Jul, 1:10 PM",
        status: "submitted",
      },
      {
        id: "timeline-8",
        title: "Record corrected",
        description: "The verified internal mark was updated.",
        timestamp: "03 Jul, 5:15 PM",
        status: "resolved",
      },
      {
        id: "timeline-9",
        title: "Complaint closed",
        description: "No further action is required.",
        timestamp: "04 Jul, 9:00 AM",
        status: "closed",
      },
    ],
  },
];

export const anonymousInboxPreviewData: AnonymousInboxMessage[] = [
  {
    id: "message-1",
    subject: "Update on CMP-1018",
    preview:
      "An additional evening shuttle has been scheduled on high-demand days.",
    receivedAt: "20 Jul",
    unread: true,
  },
  {
    id: "message-2",
    subject: "Transport team question",
    preview:
      "Which departure time usually has the highest passenger demand?",
    receivedAt: "15 Jul",
    unread: false,
  },
];
