import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required.");

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

const day = 86_400_000;
const at = (days: number, hour = 10) => {
  const value = new Date(Date.now() + days * day);
  value.setHours(hour, 0, 0, 0);
  return value;
};

async function main() {
  const [student, faculty, library, admin] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { email: "student@campus.demo" } }),
    prisma.user.findUniqueOrThrow({ where: { email: "faculty@campus.demo" } }),
    prisma.user.findUniqueOrThrow({ where: { email: "library@campus.demo" } }),
    prisma.user.findUniqueOrThrow({ where: { email: "admin@campus.demo" } }),
  ]);

  const session = await prisma.attendanceSession.upsert({
    where: {
      facultyId_classCode_date: {
        facultyId: faculty.id,
        classCode: "CS-401",
        date: at(0, 9),
      },
    },
    update: { className: "Advanced Distributed Systems", subject: "Computer Science", qrActive: true },
    create: {
      facultyId: faculty.id,
      classCode: "CS-401",
      className: "Advanced Distributed Systems",
      subject: "Computer Science",
      date: at(0, 9),
      qrActive: true,
    },
  });
  await prisma.attendanceEntry.upsert({
    where: {
      sessionId_studentId: { sessionId: session.id, studentId: student.id },
    },
    update: { status: "PRESENT" },
    create: { sessionId: session.id, studentId: student.id, status: "PRESENT" },
  });

  const event = await prisma.campusEvent.upsert({
    where: { id: "cmoperationalevent000000001" },
    update: {
      title: "Campus Innovation Summit",
      date: at(5, 10),
      status: "UPCOMING",
    },
    create: {
      id: "cmoperationalevent000000001",
      organizerId: admin.id,
      title: "Campus Innovation Summit",
      description: "Student demos, mentor sessions, and startup showcases.",
      category: "Innovation",
      date: at(5, 10),
      venue: "Central Auditorium",
      capacity: 200,
      rewardPoints: 100,
      status: "UPCOMING",
    },
  });
  await prisma.eventRegistration.upsert({
    where: { eventId_studentId: { eventId: event.id, studentId: student.id } },
    update: { status: "REGISTERED", checkedInAt: null },
    create: { eventId: event.id, studentId: student.id, status: "REGISTERED" },
  });

  const book = await prisma.libraryBook.upsert({
    where: { isbn: "9780134685991" },
    update: {
      title: "Effective Java",
      totalCopies: 5,
      availableCopies: 4,
    },
    create: {
      isbn: "9780134685991",
      title: "Effective Java",
      author: "Joshua Bloch",
      category: "Software Engineering",
      totalCopies: 5,
      availableCopies: 4,
      shelfLocation: "CS-A14",
    },
  });
  await prisma.libraryLoan.upsert({
    where: { id: "cmoperationalloan0000000001" },
    update: {
      bookId: book.id,
      borrowerId: student.id,
      issuedById: library.id,
      dueAt: at(10, 23),
      returnedAt: null,
      fineAmount: 0,
      status: "ISSUED",
    },
    create: {
      id: "cmoperationalloan0000000001",
      bookId: book.id,
      borrowerId: student.id,
      issuedById: library.id,
      dueAt: at(10, 23),
    },
  });

  await prisma.bloodDonor.upsert({
    where: { userId: student.id },
    update: {
      bloodGroup: "O+",
      phone: "+91 90000 00001",
      contactConsent: true,
      available: true,
    },
    create: {
      userId: student.id,
      bloodGroup: "O+",
      phone: "+91 90000 00001",
      contactConsent: true,
      available: true,
    },
  });
  await prisma.bloodRequest.upsert({
    where: { id: "cmoperationalblood000000001" },
    update: { status: "OPEN", matchedDonors: 1, requiredByDate: at(2, 12), verifiedById: null },
    create: {
      id: "cmoperationalblood000000001",
      createdById: admin.id,
      patientName: "Emergency Reserve Patient",
      bloodGroup: "O+",
      unitsRequired: 2,
      hospitalName: "Campus Medical Centre",
      contactNumber: "+91 90000 00002",
      requiredByDate: at(2, 12),
      urgency: "URGENT",
      matchedDonors: 1,
    },
  });

  await prisma.campusStartup.upsert({
    where: { id: "cmoperationalstartup0000001" },
    update: { stage: "UNDER_REVIEW", reviewedById: admin.id, assignedMentor: null },
    create: {
      id: "cmoperationalstartup0000001",
      founderId: student.id,
      reviewedById: admin.id,
      startupName: "CampusLoop",
      category: "Sustainability",
      pitchSummary:
        "A student-led reusable materials exchange and campus circular-economy platform.",
      stage: "UNDER_REVIEW",
      fundingRequested: 250000,
      teamSize: 4,
      hiringPostsCount: 2,
    },
  });

  console.log("Operational module demo data seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
