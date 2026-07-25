import type {
  SupportAppointment,
  SupportMessage,
  SupportPerson,
  WellbeingResource,
} from "@/features/support/types";

export const supportPeople: SupportPerson[] = [
  {
    id: "mentor-ananya",
    name: "Ananya Menon",
    role: "mentor",
    specialty: "Academic planning",
    availability: "Today · 3:30 PM",
    languages: ["English", "Malayalam"],
    initials: "AM",
    bio: "Helps students create sustainable study plans and navigate campus life.",
  },
  {
    id: "mentor-farhan",
    name: "Farhan Ali",
    role: "mentor",
    specialty: "Career guidance",
    availability: "Tomorrow · 11:00 AM",
    languages: ["English", "Hindi"],
    initials: "FA",
    bio: "Supports career exploration, internships, and peer-to-peer goal setting.",
  },
  {
    id: "counsellor-meera",
    name: "Dr. Meera Nair",
    role: "counsellor",
    specialty: "Stress and anxiety",
    availability: "Tomorrow · 2:00 PM",
    languages: ["English", "Malayalam"],
    initials: "MN",
    bio: "Licensed counsellor focused on stress management and student well-being.",
  },
  {
    id: "counsellor-joseph",
    name: "Joseph Mathew",
    role: "counsellor",
    specialty: "Personal well-being",
    availability: "Monday · 10:30 AM",
    languages: ["English", "Tamil"],
    initials: "JM",
    bio: "Provides confidential support for personal and social challenges.",
  },
];

export const supportAppointments: SupportAppointment[] = [
  {
    id: "appointment-01",
    personId: "mentor-ananya",
    date: "28 Jul 2026",
    time: "3:30 PM",
    mode: "Video call",
    status: "confirmed",
  },
  {
    id: "appointment-02",
    personId: "counsellor-meera",
    date: "18 Jul 2026",
    time: "2:00 PM",
    mode: "In person",
    status: "completed",
  },
];

export const wellbeingResources: WellbeingResource[] = [
  {
    id: "resource-01",
    title: "Reset in five minutes",
    category: "Mindfulness",
    duration: "5 min",
    description: "A short breathing routine for stressful moments between classes.",
  },
  {
    id: "resource-02",
    title: "Build a healthier study rhythm",
    category: "Study balance",
    duration: "8 min",
    description: "Practical ways to plan focused work, rest, and recovery.",
  },
  {
    id: "resource-03",
    title: "When to ask for support",
    category: "Self-care",
    duration: "6 min",
    description: "Recognize signs that a conversation with a mentor or counsellor may help.",
  },
  {
    id: "resource-04",
    title: "Sleep before an exam",
    category: "Sleep",
    duration: "7 min",
    description: "Simple techniques to settle racing thoughts and improve rest.",
  },
];

export const supportMessages: SupportMessage[] = [
  {
    id: "message-01",
    sender: "support",
    body: "Hi! I’m Ananya, your peer mentor. What would you like to talk about today?",
    time: "10:12 AM",
  },
  {
    id: "message-02",
    sender: "student",
    body: "I’m finding it difficult to balance assignments and club work.",
    time: "10:14 AM",
  },
  {
    id: "message-03",
    sender: "support",
    body: "We can break both into priorities and build a manageable plan together.",
    time: "10:15 AM",
  },
];
