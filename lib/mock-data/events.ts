import type {
  EventCertificate,
  EventRecord,
  EventRegistration,
  EventSession,
} from "@/features/events/types";

export const eventsPreviewData: EventRecord[] = [
  {
    id: "tech-summit-2026",
    title: "Campus Tech Summit",
    category: "Technology",
    date: "30 Jul 2026",
    time: "9:30 AM – 4:00 PM",
    venue: "Main Auditorium",
    description: "Student demos, industry conversations, and practical sessions on emerging technology.",
    seatsLeft: 24,
    imageTone: "from-emerald-500/25 to-cyan-500/10",
    registrationStatus: "open",
  },
  {
    id: "wellbeing-week",
    title: "Well-being Week",
    category: "Well-being",
    date: "03 Aug 2026",
    time: "10:00 AM – 3:00 PM",
    venue: "Student Centre",
    description: "Workshops, guided activities, and campus support introductions.",
    seatsLeft: 8,
    imageTone: "from-violet-500/20 to-emerald-500/10",
    registrationStatus: "closing soon",
  },
  {
    id: "career-connect",
    title: "Career Connect",
    category: "Career",
    date: "12 Aug 2026",
    time: "11:00 AM – 5:00 PM",
    venue: "Innovation Hall",
    description: "Meet recruiters, improve your portfolio, and learn from alumni panels.",
    seatsLeft: 0,
    imageTone: "from-amber-500/20 to-orange-500/10",
    registrationStatus: "closed",
  },
];

export const eventSessions: EventSession[] = [
  { id: "session-01", eventId: "tech-summit-2026", title: "Responsible AI on campus", speaker: "Dr. Lina George", time: "10:00 AM", venue: "Auditorium A" },
  { id: "session-02", eventId: "tech-summit-2026", title: "Student product showcase", speaker: "Innovation Club", time: "12:00 PM", venue: "Expo Floor" },
  { id: "session-03", eventId: "tech-summit-2026", title: "Careers in emerging technology", speaker: "Alumni panel", time: "2:30 PM", venue: "Auditorium A" },
  { id: "session-04", eventId: "wellbeing-week", title: "Mindful study habits", speaker: "Dr. Meera Nair", time: "11:00 AM", venue: "Studio 2" },
];

export const eventRegistrations: EventRegistration[] = [
  { id: "registration-01", eventId: "tech-summit-2026", status: "confirmed", registeredAt: "22 Jul 2026", passReference: "EVT-TECH-2841" },
  { id: "registration-02", eventId: "wellbeing-week", status: "attended", registeredAt: "10 Jul 2026", passReference: "EVT-WELL-1904" },
];

export const eventCertificates: EventCertificate[] = [
  { id: "certificate-01", eventId: "wellbeing-week", issuedAt: "08 Aug 2026", certificateNumber: "VOXA-CERT-2026-01904" },
];
