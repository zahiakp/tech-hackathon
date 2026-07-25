import { describe, expect, it } from "vitest";
import { PERMISSIONS, ROLE_PERMISSIONS } from "@/server/auth/permissions";
import {
  createAttendanceSchema,
  createBloodSchema,
  createBookSchema,
  createEventSchema,
  createStartupSchema,
} from "@/server/modules/operational/schemas";

describe("operational module contracts", () => {
  it("keeps operational write permissions role scoped", () => {
    expect(ROLE_PERMISSIONS.FACULTY).toContain(PERMISSIONS.ATTENDANCE_MANAGE);
    expect(ROLE_PERMISSIONS.LIBRARY_STAFF).toContain(PERMISSIONS.LIBRARY_MANAGE);
    expect(ROLE_PERMISSIONS.STUDENT).not.toContain(PERMISSIONS.EVENT_MANAGE);
    expect(ROLE_PERMISSIONS.STUDENT).not.toContain(PERMISSIONS.BLOOD_REQUEST_MANAGE);
  });

  it("validates attendance session identity and date", () => {
    expect(
      createAttendanceSchema.safeParse({
        classCode: "",
        className: "Systems",
        subject: "CS",
        date: "not-a-date",
      }).success,
    ).toBe(false);
  });

  it("enforces positive event capacity and book inventory", () => {
    expect(
      createEventSchema.safeParse({
        title: "Demo",
        description: "Demo event",
        category: "Tech",
        date: "2026-08-01T10:00:00.000Z",
        venue: "Hall",
        capacity: 0,
      }).success,
    ).toBe(false);
    expect(
      createBookSchema.safeParse({
        isbn: "123",
        title: "Book",
        author: "Author",
        category: "General",
        totalCopies: 0,
        shelfLocation: "A1",
      }).success,
    ).toBe(false);
  });

  it("requires explicit donor contact consent", () => {
    expect(
      createBloodSchema.safeParse({
        type: "donor",
        bloodGroup: "O+",
        phone: "9000000000",
      }).success,
    ).toBe(false);
  });

  it("validates startup funding and team bounds", () => {
    expect(
      createStartupSchema.safeParse({
        startupName: "CampusLoop",
        category: "Sustainability",
        pitchSummary: "Circular economy",
        fundingRequested: -1,
        teamSize: 0,
      }).success,
    ).toBe(false);
  });
});
