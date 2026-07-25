import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { name?: unknown; email?: unknown; password?: unknown };
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (name.length < 2) return NextResponse.json({ error: "Name must be at least 2 characters." }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });

    const passwordHash = await hash(password, 12);
    const studentRole = await prisma.role.upsert({
      where: { code: "STUDENT" },
      update: {},
      create: { code: "STUDENT", name: "Student" },
    });

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({ data: { name, email, passwordHash } });
      await tx.userRole.create({ data: { userId: user.id, roleId: studentRole.id } });
      await tx.userProfile.create({ data: { userId: user.id } });
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }
    console.error("Registration failed", error);
    return NextResponse.json({ error: "Unable to create your account. Please try again." }, { status: 500 });
  }
}
