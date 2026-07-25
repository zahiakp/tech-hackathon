import Pusher from "pusher";
import { env } from "@/server/config/env";

let client: Pusher | null | undefined;

export function getPusher() {
  if (client !== undefined) return client;
  if (!env.PUSHER_APP_ID || !env.PUSHER_KEY || !env.PUSHER_SECRET || !env.PUSHER_CLUSTER) {
    client = null;
    return client;
  }
  client = new Pusher({
    appId: env.PUSHER_APP_ID,
    key: env.PUSHER_KEY,
    secret: env.PUSHER_SECRET,
    cluster: env.PUSHER_CLUSTER,
    useTLS: true,
  });
  return client;
}

export async function publishRealtime(
  channel: string,
  event: string,
  payload: Record<string, unknown>,
) {
  const pusher = getPusher();
  if (!pusher) return false;
  try {
    await pusher.trigger(channel, event, payload);
    return true;
  } catch (error) {
    console.error("Realtime event delivery failed", {
      channel,
      event,
      error: error instanceof Error ? error.message : "Unknown Pusher error",
    });
    return false;
  }
}

