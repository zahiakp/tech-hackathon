import "dotenv/config";
import { createHash } from "node:crypto";
import { hash } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";
import type { RoleCode } from "../app/generated/prisma/enums";

const databaseUrl = process.env.DATABASE_URL;
const demoPassword = process.env.DEMO_PASSWORD;

if (!databaseUrl) throw new Error("DATABASE_URL is required.");
if (!demoPassword || demoPassword.length < 8) {
  throw new Error("Set DEMO_PASSWORD to at least 8 characters.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

const ids = {
  sosResolved: "cmseed000000000000000001",
  sosOpen: "cmseed000000000000000002",
  complaintNamed: "cmseed000000000000000003",
  complaintAnonymous: "cmseed000000000000000004",
  complaintResolved: "cmseed000000000000000005",
  attachment: "cmseed000000000000000006",
  supportRequestMatched: "cmseed000000000000000007",
  supportRequestOpen: "cmseed000000000000000008",
  counsellorSlotBooked: "cmseed000000000000000009",
  counsellorSlotOpen: "cmseed000000000000000010",
  mentorSlotOpen: "cmseed000000000000000011",
  appointment: "cmseed000000000000000012",
  conversation: "cmseed000000000000000013",
} as const;

const anonymousTrackingToken =
  "demo-anonymous-tracking-token-campus-2026";

const demos: Array<{
  email: string;
  name: string;
  role: RoleCode;
  profile: {
    studentId?: string;
    employeeId?: string;
    department: string;
    course?: string;
    semester?: number;
    campus: string;
    phone: string;
    bloodGroup?: string;
    bio: string;
  };
}> = [
  {
    email: "student@campus.demo",
    name: "Demo Student",
    role: "STUDENT",
    profile: {
      studentId: "DEMO-ST-001",
      department: "Computer Science",
      course: "BSc Computer Science",
      semester: 4,
      campus: "Main Campus",
      phone: "+91 9000000001",
      bloodGroup: "O+",
      bio: "Student account for frontend workflow demonstrations.",
    },
  },
  {
    email: "faculty@campus.demo",
    name: "Demo Faculty",
    role: "FACULTY",
    profile: {
      employeeId: "DEMO-FAC-001",
      department: "Computer Science",
      campus: "Main Campus",
      phone: "+91 9000000002",
      bio: "Faculty mentor for the demo environment.",
    },
  },
  {
    email: "counsellor@campus.demo",
    name: "Demo Counsellor",
    role: "COUNSELLOR",
    profile: {
      employeeId: "DEMO-COU-001",
      department: "Student Wellness",
      campus: "Main Campus",
      phone: "+91 9000000003",
      bio: "Counsellor with sample availability and appointments.",
    },
  },
  {
    email: "coordinator@campus.demo",
    name: "Demo Coordinator",
    role: "COORDINATOR",
    profile: {
      employeeId: "DEMO-COR-001",
      department: "Student Affairs",
      campus: "Main Campus",
      phone: "+91 9000000004",
      bio: "Coordinator account for complaint management.",
    },
  },
  {
    email: "security@campus.demo",
    name: "Demo Security",
    role: "SECURITY",
    profile: {
      employeeId: "DEMO-SEC-001",
      department: "Campus Security",
      campus: "Main Campus",
      phone: "+91 9000000005",
      bio: "Security responder account for SOS demonstrations.",
    },
  },
  {
    email: "library@campus.demo",
    name: "Demo Library Staff",
    role: "LIBRARY_STAFF",
    profile: {
      employeeId: "DEMO-LIB-001",
      department: "Central Library",
      campus: "Main Campus",
      phone: "+91 9000000006",
      bio: "Library staff account for future module demonstrations.",
    },
  },
  {
    email: "admin@campus.demo",
    name: "Demo Admin",
    role: "ADMIN",
    profile: {
      employeeId: "DEMO-ADM-001",
      department: "Administration",
      campus: "Main Campus",
      phone: "+91 9000000007",
      bio: "Administrator account for role and audit workflows.",
    },
  },
];

function dateFromNow(days: number, hours = 0) {
  const value = new Date();
  value.setUTCDate(value.getUTCDate() + days);
  value.setUTCHours(value.getUTCHours() + hours, 0, 0, 0);
  return value;
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

async function seedUsers() {
  const passwordHash = await hash(demoPassword!, 12);
  const users = new Map<string, Awaited<ReturnType<typeof prisma.user.upsert>>>();

  for (const demo of demos) {
    const user = await prisma.user.upsert({
      where: { email: demo.email },
      update: {
        name: demo.name,
        passwordHash,
        emailVerified: new Date(),
        status: "ACTIVE",
      },
      create: {
        email: demo.email,
        name: demo.name,
        passwordHash,
        emailVerified: new Date(),
      },
    });
    await prisma.userProfile.upsert({
      where: { userId: user.id },
      update: demo.profile,
      create: { userId: user.id, ...demo.profile },
    });
    users.set(demo.role, user);
  }

  const admin = users.get("ADMIN")!;
  for (const demo of demos) {
    const user = users.get(demo.role)!;
    const role = await prisma.role.findUniqueOrThrow({
      where: { code: demo.role },
    });
    await prisma.userRole.deleteMany({ where: { userId: user.id } });
    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: role.id,
        assignedById: demo.role === "ADMIN" ? null : admin.id,
      },
    });
  }
  return users;
}

async function seedSupport(
  users: Map<string, Awaited<ReturnType<typeof prisma.user.upsert>>>,
) {
  const student = users.get("STUDENT")!;
  const faculty = users.get("FACULTY")!;
  const counsellor = users.get("COUNSELLOR")!;

  const counsellorProfile = await prisma.supportProfile.upsert({
    where: { userId: counsellor.id },
    update: {
      type: "COUNSELLOR",
      specialties: ["Student wellbeing", "Academic stress", "Anxiety"],
      languages: ["English", "Malayalam", "Hindi"],
      bio: "Demo counsellor available for confidential student support.",
      active: true,
    },
    create: {
      userId: counsellor.id,
      type: "COUNSELLOR",
      specialties: ["Student wellbeing", "Academic stress", "Anxiety"],
      languages: ["English", "Malayalam", "Hindi"],
      bio: "Demo counsellor available for confidential student support.",
    },
  });
  const mentorProfile = await prisma.supportProfile.upsert({
    where: { userId: faculty.id },
    update: {
      type: "MENTOR",
      specialties: ["Academic planning", "Career guidance"],
      languages: ["English", "Hindi"],
      bio: "Faculty mentor for academic and career guidance.",
      active: true,
    },
    create: {
      userId: faculty.id,
      type: "MENTOR",
      specialties: ["Academic planning", "Career guidance"],
      languages: ["English", "Hindi"],
      bio: "Faculty mentor for academic and career guidance.",
    },
  });

  const bookedStart = dateFromNow(2, 2);
  const bookedEnd = new Date(bookedStart.getTime() + 30 * 60_000);
  const openStart = dateFromNow(3, 3);
  const openEnd = new Date(openStart.getTime() + 45 * 60_000);
  const mentorStart = dateFromNow(4, 4);
  const mentorEnd = new Date(mentorStart.getTime() + 30 * 60_000);
  const slots = [
    {
      id: ids.counsellorSlotBooked,
      supportProfileId: counsellorProfile.id,
      startAt: bookedStart,
      endAt: bookedEnd,
      booked: true,
    },
    {
      id: ids.counsellorSlotOpen,
      supportProfileId: counsellorProfile.id,
      startAt: openStart,
      endAt: openEnd,
      booked: false,
    },
    {
      id: ids.mentorSlotOpen,
      supportProfileId: mentorProfile.id,
      startAt: mentorStart,
      endAt: mentorEnd,
      booked: false,
    },
  ];
  for (const slot of slots) {
    await prisma.availabilitySlot.upsert({
      where: { id: slot.id },
      update: slot,
      create: slot,
    });
  }

  const matched = await prisma.supportRequest.upsert({
    where: { id: ids.supportRequestMatched },
    update: {
      studentId: student.id,
      assignedProfileId: counsellorProfile.id,
      subject: "Academic stress support",
      description: "Confidential demo request about academic stress.",
      urgency: "MEDIUM",
      status: "MATCHED",
    },
    create: {
      id: ids.supportRequestMatched,
      studentId: student.id,
      assignedProfileId: counsellorProfile.id,
      subject: "Academic stress support",
      description: "Confidential demo request about academic stress.",
      urgency: "MEDIUM",
      status: "MATCHED",
    },
  });
  await prisma.supportRequest.upsert({
    where: { id: ids.supportRequestOpen },
    update: {
      studentId: student.id,
      assignedProfileId: null,
      subject: "Career guidance request",
      description: "Open demo request waiting for a mentor.",
      urgency: "LOW",
      status: "OPEN",
    },
    create: {
      id: ids.supportRequestOpen,
      studentId: student.id,
      subject: "Career guidance request",
      description: "Open demo request waiting for a mentor.",
      urgency: "LOW",
      status: "OPEN",
    },
  });
  const appointment = await prisma.appointment.upsert({
    where: { id: ids.appointment },
    update: {
      studentId: student.id,
      supportProfileId: counsellorProfile.id,
      slotId: ids.counsellorSlotBooked,
      supportRequestId: matched.id,
      status: "CONFIRMED",
      startAt: bookedStart,
      endAt: bookedEnd,
      notes: "Demo confirmed counselling appointment.",
    },
    create: {
      id: ids.appointment,
      studentId: student.id,
      supportProfileId: counsellorProfile.id,
      slotId: ids.counsellorSlotBooked,
      supportRequestId: matched.id,
      status: "CONFIRMED",
      startAt: bookedStart,
      endAt: bookedEnd,
      notes: "Demo confirmed counselling appointment.",
    },
  });
  const conversation = await prisma.conversation.upsert({
    where: { appointmentId: appointment.id },
    update: {},
    create: { id: ids.conversation, appointmentId: appointment.id },
  });
  for (const userId of [student.id, counsellor.id]) {
    await prisma.conversationParticipant.upsert({
      where: {
        conversationId_userId: { conversationId: conversation.id, userId },
      },
      update: {},
      create: { conversationId: conversation.id, userId },
    });
  }
  const messages = [
    {
      id: "cmseedchatmessage000000001",
      conversationId: conversation.id,
      senderId: student.id,
      body: "Hello, I would like help managing academic stress.",
    },
    {
      id: "cmseedchatmessage000000002",
      conversationId: conversation.id,
      senderId: counsellor.id,
      body: "Your appointment is confirmed, and we can discuss it privately.",
    },
  ];
  for (const message of messages) {
    await prisma.chatMessage.upsert({
      where: { id: message.id },
      update: message,
      create: message,
    });
  }
  return { appointment, conversation };
}

async function seedSos(
  users: Map<string, Awaited<ReturnType<typeof prisma.user.upsert>>>,
) {
  const student = users.get("STUDENT")!;
  const security = users.get("SECURITY")!;
  const admin = users.get("ADMIN")!;
  const resolved = await prisma.sosIncident.upsert({
    where: { id: ids.sosResolved },
    update: {
      creatorId: student.id,
      status: "RESOLVED",
      latitude: 11.2588,
      longitude: 75.7804,
      accuracy: 9,
      capturedAt: dateFromNow(-2),
      note: "Demo incident near the north gate.",
      acknowledgedAt: dateFromNow(-2, 1),
      dispatchedAt: dateFromNow(-2, 2),
      resolvedAt: dateFromNow(-2, 3),
    },
    create: {
      id: ids.sosResolved,
      creatorId: student.id,
      status: "RESOLVED",
      latitude: 11.2588,
      longitude: 75.7804,
      accuracy: 9,
      capturedAt: dateFromNow(-2),
      note: "Demo incident near the north gate.",
      acknowledgedAt: dateFromNow(-2, 1),
      dispatchedAt: dateFromNow(-2, 2),
      resolvedAt: dateFromNow(-2, 3),
    },
  });
  await prisma.sosIncident.upsert({
    where: { id: ids.sosOpen },
    update: {
      creatorId: student.id,
      status: "OPEN",
      latitude: 11.2601,
      longitude: 75.782,
      accuracy: 15,
      capturedAt: dateFromNow(0),
      note: "Open demo incident for the security dashboard.",
      acknowledgedAt: null,
      dispatchedAt: null,
      resolvedAt: null,
      cancelledAt: null,
    },
    create: {
      id: ids.sosOpen,
      creatorId: student.id,
      latitude: 11.2601,
      longitude: 75.782,
      accuracy: 15,
      capturedAt: dateFromNow(0),
      note: "Open demo incident for the security dashboard.",
    },
  });
  await prisma.sosAssignment.upsert({
    where: {
      incidentId_securityUserId: {
        incidentId: resolved.id,
        securityUserId: security.id,
      },
    },
    update: { assignedById: admin.id },
    create: {
      incidentId: resolved.id,
      securityUserId: security.id,
      assignedById: admin.id,
    },
  });
  const events = [
    ["cmseedevent00000000000001", null, "OPEN", student.id, "SOS created."],
    ["cmseedevent00000000000002", "OPEN", "ACKNOWLEDGED", security.id, "Security acknowledged."],
    ["cmseedevent00000000000003", "ACKNOWLEDGED", "DISPATCHED", security.id, "Responder dispatched."],
    ["cmseedevent00000000000004", "DISPATCHED", "RESOLVED", security.id, "Student reached safely."],
  ] as const;
  for (const [id, fromStatus, toStatus, actorId, note] of events) {
    await prisma.sosStatusEvent.upsert({
      where: { id },
      update: { fromStatus, toStatus, actorId, note },
      create: {
        id,
        incidentId: resolved.id,
        fromStatus,
        toStatus,
        actorId,
        note,
      },
    });
  }
  await prisma.sosStatusEvent.upsert({
    where: { id: "cmseedevent00000000000005" },
    update: { toStatus: "OPEN", actorId: student.id },
    create: {
      id: "cmseedevent00000000000005",
      incidentId: ids.sosOpen,
      toStatus: "OPEN",
      actorId: student.id,
      note: "Open demo SOS created.",
    },
  });
}

async function seedComplaints(
  users: Map<string, Awaited<ReturnType<typeof prisma.user.upsert>>>,
) {
  const student = users.get("STUDENT")!;
  const coordinator = users.get("COORDINATOR")!;
  const counsellor = users.get("COUNSELLOR")!;
  const [safety, facilities, wellbeing] = await Promise.all([
    prisma.complaintCategory.findUniqueOrThrow({ where: { name: "Safety" } }),
    prisma.complaintCategory.findUniqueOrThrow({ where: { name: "Facilities" } }),
    prisma.complaintCategory.findUniqueOrThrow({ where: { name: "Wellbeing" } }),
  ]);
  const named = await prisma.complaint.upsert({
    where: { referenceCode: "CMP-DEMO-NAMED-001" },
    update: {
      reporterId: student.id,
      categoryId: facilities.id,
      title: "Broken lighting near the hostel",
      description: "Several pathway lights are not working near the demo hostel.",
      priority: "HIGH",
      status: "IN_REVIEW",
      assignedToId: coordinator.id,
    },
    create: {
      id: ids.complaintNamed,
      referenceCode: "CMP-DEMO-NAMED-001",
      reporterId: student.id,
      categoryId: facilities.id,
      title: "Broken lighting near the hostel",
      description: "Several pathway lights are not working near the demo hostel.",
      priority: "HIGH",
      status: "IN_REVIEW",
      assignedToId: coordinator.id,
    },
  });
  const anonymous = await prisma.complaint.upsert({
    where: { referenceCode: "CMP-DEMO-ANON-001" },
    update: {
      anonymous: true,
      trackingTokenHash: sha256(anonymousTrackingToken),
      categoryId: safety.id,
      title: "Unsafe corridor condition",
      description: "Anonymous demo report about an unsafe corridor condition.",
      priority: "URGENT",
      status: "SUBMITTED",
      assignedToId: null,
    },
    create: {
      id: ids.complaintAnonymous,
      referenceCode: "CMP-DEMO-ANON-001",
      anonymous: true,
      trackingTokenHash: sha256(anonymousTrackingToken),
      categoryId: safety.id,
      title: "Unsafe corridor condition",
      description: "Anonymous demo report about an unsafe corridor condition.",
      priority: "URGENT",
    },
  });
  const resolved = await prisma.complaint.upsert({
    where: { referenceCode: "CMP-DEMO-RESOLVED-001" },
    update: {
      reporterId: student.id,
      categoryId: wellbeing.id,
      title: "Request for a quiet wellbeing space",
      description: "Demo resolved request for a quiet wellbeing space.",
      priority: "MEDIUM",
      status: "RESOLVED",
      assignedToId: counsellor.id,
      resolvedAt: dateFromNow(-1),
    },
    create: {
      id: ids.complaintResolved,
      referenceCode: "CMP-DEMO-RESOLVED-001",
      reporterId: student.id,
      categoryId: wellbeing.id,
      title: "Request for a quiet wellbeing space",
      description: "Demo resolved request for a quiet wellbeing space.",
      priority: "MEDIUM",
      status: "RESOLVED",
      assignedToId: counsellor.id,
      resolvedAt: dateFromNow(-1),
    },
  });
  await prisma.complaintAttachment.upsert({
    where: { fileKey: "demo-complaint-lighting-image" },
    update: {
      complaintId: named.id,
      uploadedById: student.id,
      fileName: "demo-hostel-lighting.png",
      fileUrl: "https://placehold.co/1200x800/png?text=Demo+Attachment",
      mimeType: "image/png",
      sizeBytes: 24576,
    },
    create: {
      id: ids.attachment,
      complaintId: named.id,
      uploadedById: student.id,
      fileKey: "demo-complaint-lighting-image",
      fileName: "demo-hostel-lighting.png",
      fileUrl: "https://placehold.co/1200x800/png?text=Demo+Attachment",
      mimeType: "image/png",
      sizeBytes: 24576,
    },
  });
  const messages = [
    ["cmseedmessage0000000000001", named.id, student.id, "The lights beside Block B are affected.", false],
    ["cmseedmessage0000000000002", named.id, coordinator.id, "The facilities team has been asked to inspect the area.", true],
    ["cmseedmessage0000000000003", anonymous.id, null, "The location is the second-floor east corridor.", false],
  ] as const;
  for (const [id, complaintId, authorId, body, fromStaff] of messages) {
    await prisma.complaintMessage.upsert({
      where: { id },
      update: { complaintId, authorId, body, fromStaff },
      create: { id, complaintId, authorId, body, fromStaff },
    });
  }
  const events = [
    ["cmseedcomplaintevent0000001", named.id, null, "SUBMITTED", student.id, "Complaint submitted."],
    ["cmseedcomplaintevent0000002", named.id, "SUBMITTED", "ASSIGNED", coordinator.id, "Complaint assigned."],
    ["cmseedcomplaintevent0000003", named.id, "ASSIGNED", "IN_REVIEW", coordinator.id, "Review started."],
    ["cmseedcomplaintevent0000004", anonymous.id, null, "SUBMITTED", null, "Anonymous complaint submitted."],
    ["cmseedcomplaintevent0000005", resolved.id, null, "SUBMITTED", student.id, "Complaint submitted."],
    ["cmseedcomplaintevent0000006", resolved.id, "IN_REVIEW", "RESOLVED", counsellor.id, "Quiet room allocated."],
  ] as const;
  for (const [id, complaintId, fromStatus, toStatus, actorId, note] of events) {
    await prisma.complaintStatusEvent.upsert({
      where: { id },
      update: { complaintId, fromStatus, toStatus, actorId, note },
      create: { id, complaintId, fromStatus, toStatus, actorId, note },
    });
  }
  await prisma.complaintFeedback.upsert({
    where: { complaintId: resolved.id },
    update: { authorId: student.id, rating: 5, comment: "The support team responded quickly." },
    create: { complaintId: resolved.id, authorId: student.id, rating: 5, comment: "The support team responded quickly." },
  });
  return { named };
}

async function seedCrossCutting(
  users: Map<string, Awaited<ReturnType<typeof prisma.user.upsert>>>,
  appointmentId: string,
  namedComplaintId: string,
) {
  const student = users.get("STUDENT")!;
  const coordinator = users.get("COORDINATOR")!;
  const security = users.get("SECURITY")!;
  const counsellor = users.get("COUNSELLOR")!;
  const notifications = [
    ["cmseednotification000000001", student.id, "APPOINTMENT", "Appointment confirmed", "Your demo counselling appointment is confirmed.", `/dashboard/appointments/${appointmentId}`, { appointmentId }, null],
    ["cmseednotification000000002", security.id, "SOS", "Open demo SOS", "A demo emergency incident requires attention.", `/dashboard/sos/${ids.sosOpen}`, { incidentId: ids.sosOpen }, null],
    ["cmseednotification000000003", coordinator.id, "COMPLAINT", "Complaint in review", "CMP-DEMO-NAMED-001 is ready for review.", `/dashboard/complaints/${namedComplaintId}`, { complaintId: namedComplaintId }, new Date()],
  ] as const;
  for (const [id, userId, type, title, body, actionUrl, metadata, readAt] of notifications) {
    await prisma.notification.upsert({
      where: { id },
      update: { userId, type, title, body, actionUrl, metadata, readAt },
      create: { id, userId, type, title, body, actionUrl, metadata, readAt },
    });
  }
  const audits = [
    ["cmseedaudit00000000000001", student.id, "demo.sos_created", "SosIncident", ids.sosOpen],
    ["cmseedaudit00000000000002", coordinator.id, "demo.complaint_reviewed", "Complaint", namedComplaintId],
    ["cmseedaudit00000000000003", counsellor.id, "demo.appointment_confirmed", "Appointment", appointmentId],
  ] as const;
  for (const [id, actorId, action, entityType, entityId] of audits) {
    await prisma.auditLog.upsert({
      where: { id },
      update: { actorId, action, entityType, entityId, requestId: "demo-seed", metadata: { seeded: true } },
      create: { id, actorId, action, entityType, entityId, requestId: "demo-seed", metadata: { seeded: true } },
    });
  }
  const resources = await prisma.campusResource.findMany({
    where: { active: true },
    select: { id: true },
    take: 2,
  });
  await prisma.chatbotInteraction.upsert({
    where: { id: "cmseedchatbot000000000001" },
    update: {
      userId: student.id,
      intent: "find_counselling",
      riskLevel: "LOW",
      escalated: false,
      resourceIds: resources.map(({ id }) => id),
      inputTokens: 42,
      outputTokens: 76,
    },
    create: {
      id: "cmseedchatbot000000000001",
      userId: student.id,
      providerRequestId: "demo-seed-no-provider-call",
      intent: "find_counselling",
      riskLevel: "LOW",
      escalated: false,
      resourceIds: resources.map(({ id }) => id),
      inputTokens: 42,
      outputTokens: 76,
    },
  });
}

async function main() {
  const users = await seedUsers();
  const support = await seedSupport(users);
  await seedSos(users);
  const complaints = await seedComplaints(users);
  await seedCrossCutting(users, support.appointment.id, complaints.named.id);
  console.log("Demo data seeded successfully.");
  console.log(`Demo password: ${demoPassword}`);
  console.log(`Anonymous complaint: CMP-DEMO-ANON-001 / ${anonymousTrackingToken}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
