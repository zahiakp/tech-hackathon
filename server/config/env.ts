import { z } from "zod";

const optionalString = z.string().min(1).optional();

const environmentSchema = z.object({
  DATABASE_URL: optionalString,
  AUTH_SECRET: optionalString,
  APP_URL: optionalString,
  PUSHER_APP_ID: optionalString,
  PUSHER_KEY: optionalString,
  PUSHER_SECRET: optionalString,
  PUSHER_CLUSTER: optionalString,
  NEXT_PUBLIC_PUSHER_KEY: optionalString,
  NEXT_PUBLIC_PUSHER_CLUSTER: optionalString,
  UPLOADTHING_TOKEN: optionalString,
  RESEND_API_KEY: optionalString,
  EMAIL_FROM: optionalString,
  OPENAI_API_KEY: optionalString,

  IP_HASH_SECRET: optionalString,
});

export const env = environmentSchema.parse(process.env);

export const integrationStatus = {
  database: Boolean(env.DATABASE_URL),
  auth: Boolean(env.AUTH_SECRET),
  pusher: Boolean(
    env.PUSHER_APP_ID &&
      env.PUSHER_KEY &&
      env.PUSHER_SECRET &&
      env.PUSHER_CLUSTER,
  ),
  uploadthing: Boolean(env.UPLOADTHING_TOKEN),
  resend: Boolean(env.RESEND_API_KEY && env.EMAIL_FROM),
  openai: Boolean(env.OPENAI_API_KEY),
};
