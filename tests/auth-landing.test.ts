import { describe, expect, it } from "vitest";

import { landingPathForRoles } from "@/lib/auth-landing";

describe("role landing paths", () => {
  it("sends students and users without a staff role to the student workspace", () => {
    expect(landingPathForRoles(["STUDENT"])).toBe("/student");
    expect(landingPathForRoles([])).toBe("/student");
  });

  it("routes each staff role to its own workspace", () => {
    expect(landingPathForRoles(["SECURITY"])).toBe("/security");
    expect(landingPathForRoles(["COORDINATOR"])).toBe("/admin/complaints");
    expect(landingPathForRoles(["COUNSELLOR"])).toBe("/counsellor/appointments");
    expect(landingPathForRoles(["FACULTY"])).toBe("/faculty/attendance");
    expect(landingPathForRoles(["LIBRARY_STAFF"])).toBe("/library-staff");
  });

  it("prioritizes the admin workspace for multi-role administrators", () => {
    expect(landingPathForRoles(["STUDENT", "SECURITY", "ADMIN"])).toBe("/admin");
  });
});
