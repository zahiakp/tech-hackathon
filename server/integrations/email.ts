import { Resend } from "resend";
import { env } from "@/server/config/env";

let client: Resend | null | undefined;

function getResend() {
  if (client !== undefined) return client;
  client = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
  return client;
}

export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
}) {
  const resend = getResend();
  if (!resend || !env.EMAIL_FROM) return false;
  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: input.to,
    subject: input.subject,
    html: input.html,
  });
  if (error) throw new Error(error.message);
  return true;
}
