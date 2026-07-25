import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/server/api/handler";
import { AppError, created, ok } from "@/server/api/response";
import { requirePermission, requireUser } from "@/server/auth/guards";
import { PERMISSIONS } from "@/server/auth/permissions";
import { createBloodSchema } from "@/server/modules/operational/schemas";

export async function GET(request: Request) {
  return apiHandler(request, async () => {
    await requirePermission(PERMISSIONS.BLOOD_REQUEST_READ);
    const [requests, donors] = await prisma.$transaction([
      prisma.bloodRequest.findMany({ include: { createdBy: { select: { id: true, name: true } }, verifiedBy: { select: { id: true, name: true } } }, orderBy: [{ urgency: "desc" }, { requiredByDate: "asc" }] }),
      prisma.bloodDonor.findMany({ where: { contactConsent: true, available: true }, include: { user: { select: { id: true, name: true, email: true, profile: true } } }, orderBy: { updatedAt: "desc" } }),
    ]);
    return ok({ requests, donors });
  });
}

export async function POST(request: Request) {
  return apiHandler(request, async () => {
    const user = await requireUser();
    const input = createBloodSchema.parse(await request.json());
    if (input.type === "donor") {
      if (!user.permissions.includes(PERMISSIONS.BLOOD_DONOR_SELF)) throw new AppError(403, "FORBIDDEN", "You cannot manage a donor profile.");
      return created(await prisma.bloodDonor.upsert({ where: { userId: user.id }, update: { bloodGroup: input.bloodGroup, phone: input.phone, contactConsent: input.contactConsent, available: input.available }, create: { userId: user.id, bloodGroup: input.bloodGroup, phone: input.phone, contactConsent: input.contactConsent, available: input.available } }));
    }
    await requirePermission(PERMISSIONS.BLOOD_REQUEST_MANAGE);
    const matchedDonors = await prisma.bloodDonor.count({ where: { bloodGroup: input.bloodGroup, available: true, contactConsent: true } });
    return created(await prisma.bloodRequest.create({ data: { createdById: user.id, patientName: input.patientName, bloodGroup: input.bloodGroup, unitsRequired: input.unitsRequired, hospitalName: input.hospitalName, contactNumber: input.contactNumber, requiredByDate: input.requiredByDate, urgency: input.urgency, matchedDonors } }));
  });
}