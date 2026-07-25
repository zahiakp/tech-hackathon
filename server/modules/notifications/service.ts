import type { NotificationType, Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { publishRealtime } from "@/server/integrations/pusher";

export async function createNotification(input: {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  actionUrl?: string;
  metadata?: Prisma.InputJsonValue;
}) {
  const notification = await prisma.notification.create({ data: input });
  await publishRealtime(`private-user-${input.userId}`, "notification.created", {
    id: notification.id,
    type: notification.type,
    title: notification.title,
    body: notification.body,
    actionUrl: notification.actionUrl,
    createdAt: notification.createdAt.toISOString(),
  });
  return notification;
}

export async function notifyUsers(
  userIds: string[],
  input: Omit<Parameters<typeof createNotification>[0], "userId">,
) {
  return Promise.all(userIds.map((userId) => createNotification({ userId, ...input })));
}
