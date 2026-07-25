import { describe, expect, it } from "vitest";
import { createSosSchema, updateSosStatusSchema } from "@/server/modules/sos/schemas";
import { sosTransitions } from "@/server/modules/sos/service";

describe("SOS contracts", () => {
  it("accepts valid coordinates and ISO capture time", () => {
    const value = createSosSchema.parse({ latitude: 11.25, longitude: 75.78, accuracy: 8, capturedAt: "2026-07-25T12:00:00.000Z" });
    expect(value.capturedAt).toBeInstanceOf(Date);
  });
  it("rejects coordinates outside valid ranges", () => {
    expect(() => createSosSchema.parse({ latitude: 100, longitude: 200, capturedAt: "2026-07-25T12:00:00.000Z" })).toThrow();
  });
  it("enforces the approved status flow", () => {
    expect(sosTransitions.OPEN).toEqual(["ACKNOWLEDGED", "CANCELLED_FALSE_ALARM"]);
    expect(sosTransitions.ACKNOWLEDGED).toEqual(["DISPATCHED"]);
    expect(updateSosStatusSchema.safeParse({ status: "OPEN" }).success).toBe(false);
  });
});
