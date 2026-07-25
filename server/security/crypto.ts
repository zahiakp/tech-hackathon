import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { env } from "@/server/config/env";

export function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function randomToken(bytes = 32) {
  return randomBytes(bytes).toString("base64url");
}

export function numericOtp() {
  return String(Number.parseInt(randomBytes(4).toString("hex"), 16) % 1_000_000).padStart(6, "0");
}

export function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function hashIp(ip: string | null) {
  if (!ip) return undefined;
  return sha256(`${env.IP_HASH_SECRET ?? env.AUTH_SECRET ?? "development"}:${ip}`);
}

export function getRequestIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
}
