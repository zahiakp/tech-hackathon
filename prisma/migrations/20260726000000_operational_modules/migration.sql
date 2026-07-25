-- CreateEnum
CREATE TYPE "AttendanceMark" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');

-- CreateEnum
CREATE TYPE "CampusEventStatus" AS ENUM ('DRAFT', 'UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EventRegistrationStatus" AS ENUM ('REGISTERED', 'WAITLISTED', 'CHECKED_IN', 'CANCELLED');

-- CreateEnum
CREATE TYPE "LibraryLoanStatus" AS ENUM ('ISSUED', 'RETURNED', 'OVERDUE');

-- CreateEnum
CREATE TYPE "BloodRequestState" AS ENUM ('OPEN', 'MATCHED', 'FULFILLED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BloodUrgency" AS ENUM ('STANDARD', 'URGENT', 'CRITICAL');

-- CreateEnum
CREATE TYPE "CampusStartupStage" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'INCUBATING');

-- CreateTable
CREATE TABLE "AttendanceSession" (
    "id" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "classCode" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "qrActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttendanceSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceEntry" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "status" "AttendanceMark" NOT NULL DEFAULT 'ABSENT',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttendanceEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampusEvent" (
    "id" TEXT NOT NULL,
    "organizerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "venue" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "rewardPoints" INTEGER NOT NULL DEFAULT 0,
    "status" "CampusEventStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampusEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventRegistration" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "status" "EventRegistrationStatus" NOT NULL DEFAULT 'REGISTERED',
    "checkedInAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LibraryBook" (
    "id" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "totalCopies" INTEGER NOT NULL,
    "availableCopies" INTEGER NOT NULL,
    "shelfLocation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LibraryBook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LibraryLoan" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "borrowerId" TEXT NOT NULL,
    "issuedById" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "returnedAt" TIMESTAMP(3),
    "fineAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "LibraryLoanStatus" NOT NULL DEFAULT 'ISSUED',

    CONSTRAINT "LibraryLoan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BloodDonor" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bloodGroup" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "contactConsent" BOOLEAN NOT NULL DEFAULT false,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "lastDonationAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BloodDonor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BloodRequest" (
    "id" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "verifiedById" TEXT,
    "patientName" TEXT NOT NULL,
    "bloodGroup" TEXT NOT NULL,
    "unitsRequired" INTEGER NOT NULL,
    "hospitalName" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "requiredByDate" TIMESTAMP(3) NOT NULL,
    "urgency" "BloodUrgency" NOT NULL DEFAULT 'STANDARD',
    "status" "BloodRequestState" NOT NULL DEFAULT 'OPEN',
    "matchedDonors" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BloodRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampusStartup" (
    "id" TEXT NOT NULL,
    "founderId" TEXT NOT NULL,
    "reviewedById" TEXT,
    "startupName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "pitchSummary" TEXT NOT NULL,
    "stage" "CampusStartupStage" NOT NULL DEFAULT 'SUBMITTED',
    "fundingRequested" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "teamSize" INTEGER NOT NULL DEFAULT 1,
    "assignedMentor" TEXT,
    "hiringPostsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampusStartup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AttendanceSession_facultyId_date_idx" ON "AttendanceSession"("facultyId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceSession_facultyId_classCode_date_key" ON "AttendanceSession"("facultyId", "classCode", "date");

-- CreateIndex
CREATE INDEX "AttendanceEntry_studentId_status_idx" ON "AttendanceEntry"("studentId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceEntry_sessionId_studentId_key" ON "AttendanceEntry"("sessionId", "studentId");

-- CreateIndex
CREATE INDEX "CampusEvent_status_date_idx" ON "CampusEvent"("status", "date");

-- CreateIndex
CREATE INDEX "CampusEvent_organizerId_date_idx" ON "CampusEvent"("organizerId", "date");

-- CreateIndex
CREATE INDEX "EventRegistration_eventId_status_idx" ON "EventRegistration"("eventId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "EventRegistration_eventId_studentId_key" ON "EventRegistration"("eventId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "LibraryBook_isbn_key" ON "LibraryBook"("isbn");

-- CreateIndex
CREATE INDEX "LibraryBook_title_idx" ON "LibraryBook"("title");

-- CreateIndex
CREATE INDEX "LibraryBook_category_idx" ON "LibraryBook"("category");

-- CreateIndex
CREATE INDEX "LibraryLoan_borrowerId_status_idx" ON "LibraryLoan"("borrowerId", "status");

-- CreateIndex
CREATE INDEX "LibraryLoan_bookId_status_idx" ON "LibraryLoan"("bookId", "status");

-- CreateIndex
CREATE INDEX "LibraryLoan_dueAt_status_idx" ON "LibraryLoan"("dueAt", "status");

-- CreateIndex
CREATE UNIQUE INDEX "BloodDonor_userId_key" ON "BloodDonor"("userId");

-- CreateIndex
CREATE INDEX "BloodDonor_bloodGroup_available_contactConsent_idx" ON "BloodDonor"("bloodGroup", "available", "contactConsent");

-- CreateIndex
CREATE INDEX "BloodRequest_bloodGroup_status_urgency_idx" ON "BloodRequest"("bloodGroup", "status", "urgency");

-- CreateIndex
CREATE INDEX "CampusStartup_stage_createdAt_idx" ON "CampusStartup"("stage", "createdAt");

-- CreateIndex
CREATE INDEX "CampusStartup_founderId_createdAt_idx" ON "CampusStartup"("founderId", "createdAt");

-- AddForeignKey
ALTER TABLE "AttendanceSession" ADD CONSTRAINT "AttendanceSession_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceEntry" ADD CONSTRAINT "AttendanceEntry_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "AttendanceSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceEntry" ADD CONSTRAINT "AttendanceEntry_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampusEvent" ADD CONSTRAINT "CampusEvent_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "CampusEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LibraryLoan" ADD CONSTRAINT "LibraryLoan_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "LibraryBook"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LibraryLoan" ADD CONSTRAINT "LibraryLoan_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LibraryLoan" ADD CONSTRAINT "LibraryLoan_issuedById_fkey" FOREIGN KEY ("issuedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodDonor" ADD CONSTRAINT "BloodDonor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodRequest" ADD CONSTRAINT "BloodRequest_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodRequest" ADD CONSTRAINT "BloodRequest_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampusStartup" ADD CONSTRAINT "CampusStartup_founderId_fkey" FOREIGN KEY ("founderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampusStartup" ADD CONSTRAINT "CampusStartup_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
