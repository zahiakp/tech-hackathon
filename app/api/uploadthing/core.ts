import { z } from "zod";
import { UploadThingError } from "uploadthing/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { validateAnonymousAccess } from "@/server/modules/complaints/service";

const f = createUploadthing();

export const fileRouter = {
  complaintAttachment: f({
    image: { maxFileSize: "8MB", maxFileCount: 5 },
    pdf: { maxFileSize: "16MB", maxFileCount: 5 },
  })
    .input(z.object({ complaintId: z.string().cuid(), trackingToken: z.string().min(32).optional() }))
    .middleware(async ({ input, files }) => {
      if (files.some((file) => file.type === "application/pdf" && file.size > 10 * 1024 * 1024)) {
        throw new UploadThingError("TOO_LARGE");
      }
      const session = await auth();
      const complaint = await prisma.complaint.findUnique({ where: { id: input.complaintId } });
      if (!complaint) throw new UploadThingError("NOT_FOUND");

      let allowed = false;
      if (session?.user?.id) {
        const user = await prisma.user.findUnique({ where: { id: session.user.id }, include: { roles: { include: { role: true } } } });
        const staff = user?.roles.some(({ role }) => role.code === "COORDINATOR" || role.code === "ADMIN");
        allowed = Boolean(staff || complaint.reporterId === session.user.id || complaint.assignedToId === session.user.id);
      } else if (complaint.anonymous) {
        allowed = await validateAnonymousAccess(complaint.id, input.trackingToken);
      }
      if (!allowed) throw new UploadThingError("FORBIDDEN");
      return { complaintId: complaint.id, userId: session?.user?.id ?? null };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const attachment = await prisma.complaintAttachment.create({
        data: {
          complaintId: metadata.complaintId,
          uploadedById: metadata.userId,
          fileKey: file.key,
          fileName: file.name,
          fileUrl: file.ufsUrl,
          mimeType: file.type,
          sizeBytes: file.size,
        },
      });
      return { attachmentId: attachment.id, url: attachment.fileUrl };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
