import type { RoleCode } from "@/app/generated/prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      roles: RoleCode[];
    } & DefaultSession["user"];
    sessionVersion: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    roles?: RoleCode[];
    sessionVersion?: number;
  }
}
