import { integrationStatus } from "@/server/config/env";
import { ok } from "@/server/api/response";

export function GET() {
  return ok({ status: "ok", timestamp: new Date().toISOString(), integrations: integrationStatus });
}
