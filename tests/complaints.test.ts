import { describe, expect, it } from "vitest";
import { createAnonymousComplaintSchema, complaintFeedbackSchema } from "@/server/modules/complaints/schemas";
import { complaintTransitions } from "@/server/modules/complaints/service";
import { randomToken, safeEqual, sha256 } from "@/server/security/crypto";

describe("complaint security and contracts", () => {
  it("hashes anonymous tracking tokens without storing the raw value", () => {
    const token = randomToken();
    const digest = sha256(token);
    expect(digest).not.toContain(token);
    expect(safeEqual(digest, sha256(token))).toBe(true);
  });
  it("requires meaningful anonymous complaint content", () => {
    expect(createAnonymousComplaintSchema.safeParse({ categoryId: "bad", title: "x", description: "short" }).success).toBe(false);
  });
  it("limits feedback ratings and complaint transitions", () => {
    expect(complaintFeedbackSchema.safeParse({ rating: 6 }).success).toBe(false);
    expect(complaintTransitions.RESOLVED).toContain("CLOSED");
    expect(complaintTransitions.CLOSED).toBeUndefined();
  });
});
