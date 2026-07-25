import { describe, expect, it } from "vitest";
import { availabilitySchema, bookAppointmentSchema } from "@/server/modules/support/schemas";
import { appointmentTransitions } from "@/server/modules/support/service";

describe("peer support contracts", () => {
  it("rejects availability ending before it begins", () => {
    expect(availabilitySchema.safeParse({ startAt: "2026-07-25T13:00:00.000Z", endAt: "2026-07-25T12:00:00.000Z" }).success).toBe(false);
  });
  it("requires a valid slot id for booking", () => {
    expect(bookAppointmentSchema.safeParse({ slotId: "invalid" }).success).toBe(false);
  });
  it("prevents transitions after terminal appointment states", () => {
    expect(appointmentTransitions.COMPLETED).toEqual([]);
    expect(appointmentTransitions.CANCELLED).toEqual([]);
    expect(appointmentTransitions.REQUESTED).toContain("CONFIRMED");
  });
});
