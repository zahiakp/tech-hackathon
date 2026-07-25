import { describe, expect, it } from "vitest";
import { PERMISSIONS, ROLE_PERMISSIONS } from "@/server/auth/permissions";

describe("RBAC matrix", () => {
  it("grants security SOS response access without complaint administration", () => {
    expect(ROLE_PERMISSIONS.SECURITY).toContain(PERMISSIONS.SOS_UPDATE_STATUS);
    expect(ROLE_PERMISSIONS.SECURITY).not.toContain(PERMISSIONS.COMPLAINT_ASSIGN);
  });
  it("grants administrators every registered permission", () => {
    expect(new Set(ROLE_PERMISSIONS.ADMIN)).toEqual(new Set(Object.values(PERMISSIONS)));
  });
});
