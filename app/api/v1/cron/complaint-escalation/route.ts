import { apiHandler } from "@/server/api/handler";
import { AppError, ok } from "@/server/api/response";
import { env } from "@/server/config/env";
import { escalateOverdueComplaints } from "@/server/modules/complaints/service";

export async function GET(request: Request) {
  return apiHandler(request, async () => {
    if (!env.CRON_SECRET) throw new AppError(503, "CRON_NOT_CONFIGURED", "Cron authorization is not configured.");
    if (request.headers.get("authorization") !== `Bearer ${env.CRON_SECRET}`) throw new AppError(401, "UNAUTHENTICATED", "Invalid cron authorization.");
    return ok(await escalateOverdueComplaints());
  });
}
