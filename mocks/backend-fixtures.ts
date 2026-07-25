export const backendFixtures = {
  attendance: { studentId: "demo-student", date: "2026-07-25", status: "PRESENT" },
  event: { id: "demo-event", name: "Innovation Day", capacity: 200, waitlistEnabled: true },
  reward: { id: "demo-reward", name: "Campus Store Voucher", points: 500 },
  book: { id: "demo-book", title: "Designing Data-Intensive Applications", availableCopies: 2 },
  donor: { id: "demo-donor", bloodGroup: "O+", available: true },
  startup: { id: "demo-startup", name: "Campus Labs", status: "PENDING_APPROVAL" },
} as const;
