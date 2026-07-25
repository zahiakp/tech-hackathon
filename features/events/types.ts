export type EventRecord = {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  seatsLeft: number;
  imageTone: string;
  registrationStatus: "open" | "closing soon" | "closed";
};

export type EventSession = {
  id: string;
  eventId: string;
  title: string;
  speaker: string;
  time: string;
  venue: string;
};

export type EventRegistration = {
  id: string;
  eventId: string;
  status: "confirmed" | "attended" | "cancelled";
  registeredAt: string;
  passReference: string;
};

export type EventCertificate = {
  id: string;
  eventId: string;
  issuedAt: string;
  certificateNumber: string;
};
