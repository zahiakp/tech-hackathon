export type SupportRole = "mentor" | "counsellor";

export type SupportPerson = {
  id: string;
  name: string;
  role: SupportRole;
  specialty: string;
  availability: string;
  languages: string[];
  initials: string;
  bio: string;
};

export type SupportAppointment = {
  id: string;
  personId: string;
  date: string;
  time: string;
  mode: "In person" | "Video call";
  status: "confirmed" | "completed";
};

export type WellbeingResource = {
  id: string;
  title: string;
  category: string;
  duration: string;
  description: string;
};

export type SupportMessage = {
  id: string;
  sender: "student" | "support";
  body: string;
  time: string;
};
