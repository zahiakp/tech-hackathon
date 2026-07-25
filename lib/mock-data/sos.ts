import type {
  EmergencyContact,
  EmergencyStatusPreview,
  EmergencyType,
} from "@/features/sos/types";

export const emergencyTypes: EmergencyType[] = [
  {
    id: "medical",
    title: "Medical emergency",
    description: "Injury, sudden illness, or urgent medical assistance.",
  },
  {
    id: "security",
    title: "Security threat",
    description: "Threatening behaviour, harassment, or immediate danger.",
  },
  {
    id: "fire",
    title: "Fire or smoke",
    description: "Visible fire, smoke, or a suspected fire hazard.",
  },
  {
    id: "personal-safety",
    title: "Personal safety",
    description: "You feel unsafe and need immediate campus assistance.",
  },
  {
    id: "other",
    title: "Other emergency",
    description: "Any urgent situation not covered by the options above.",
  },
];

export const emergencyStatusPreviews: EmergencyStatusPreview[] = [
  {
    status: "pending",
    title: "Request pending",
    description: "The alert is waiting to be accepted by a responder.",
    updatedAt: "Just now",
  },
  {
    status: "active",
    title: "Response active",
    description: "A campus responder has accepted the emergency request.",
    updatedAt: "Updated a moment ago",
  },
  {
    status: "cancelled",
    title: "Alert cancelled",
    description: "The emergency request was cancelled as a false alarm.",
    updatedAt: "Cancelled just now",
  },
  {
    status: "failed",
    title: "Alert not sent",
    description: "The request could not reach the emergency service.",
    updatedAt: "Connection failed",
  },
  {
    status: "resolved",
    title: "Emergency resolved",
    description: "The response team marked the incident as resolved.",
    updatedAt: "Resolved today",
  },
];

export const emergencyContacts: EmergencyContact[] = [
  {
    id: "campus-security",
    title: "Campus security",
    description: "Security incidents and immediate safety support.",
    availability: "Available 24/7",
  },
  {
    id: "medical-centre",
    title: "Campus medical centre",
    description: "First aid and urgent medical assistance on campus.",
    availability: "Campus hours",
  },
  {
    id: "student-support",
    title: "Student support desk",
    description: "Guidance and follow-up after an emergency.",
    availability: "Working days",
  },
];
