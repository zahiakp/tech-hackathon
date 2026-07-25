import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, RoleCode } from "../app/generated/prisma/client";
import { ROLE_PERMISSIONS } from "../server/auth/permissions";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const roleNames: Record<RoleCode, string> = {
  STUDENT: "Student", FACULTY: "Faculty", COUNSELLOR: "Counsellor", COORDINATOR: "Coordinator",
  SECURITY: "Security", LIBRARY_STAFF: "Library staff", ADMIN: "Administrator",
};

const categories = [
  { name: "Safety", description: "Threats, harassment, or unsafe campus conditions", slaHours: 4 },
  { name: "Academic", description: "Teaching, assessment, or academic process concerns", slaHours: 48 },
  { name: "Facilities", description: "Hostel, classroom, sanitation, or infrastructure concerns", slaHours: 24 },
  { name: "Wellbeing", description: "Student wellbeing and support concerns", slaHours: 12 },
  { name: "Other", description: "Concerns not covered by another category", slaHours: 48 },
];

const resources = [
  { title: "Campus Security", description: "Immediate on-campus safety assistance and SOS response.", category: "EMERGENCY", contact: "Campus security desk" },
  { title: "Student Counselling Centre", description: "Confidential appointment-based wellbeing support.", category: "COUNSELLING", contact: "Counselling reception" },
  { title: "Student Affairs Office", description: "Guidance for complaints, academic support, and campus services.", category: "CAMPUS_SUPPORT", contact: "Student affairs desk" },
];

async function main() {
  for (const permission of new Set(Object.values(ROLE_PERMISSIONS).flat())) {
    await prisma.permission.upsert({ where: { code: permission }, update: {}, create: { code: permission } });
  }

  for (const code of Object.values(RoleCode)) {
    const role = await prisma.role.upsert({ where: { code }, update: { name: roleNames[code] }, create: { code, name: roleNames[code] } });
    const permissions = await prisma.permission.findMany({ where: { code: { in: ROLE_PERMISSIONS[code] } } });
    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
    await prisma.rolePermission.createMany({ data: permissions.map((permission) => ({ roleId: role.id, permissionId: permission.id })), skipDuplicates: true });
  }

  for (const category of categories) await prisma.complaintCategory.upsert({ where: { name: category.name }, update: category, create: category });
  for (const resource of resources) {
    const existing = await prisma.campusResource.findFirst({ where: { title: resource.title } });
    if (existing) await prisma.campusResource.update({ where: { id: existing.id }, data: resource });
    else await prisma.campusResource.create({ data: resource });
  }

  const studentRole = await prisma.role.findUniqueOrThrow({ where: { code: "STUDENT" } });
  const unassignedUsers = await prisma.user.findMany({ where: { roles: { none: {} } }, select: { id: true } });
  await prisma.userRole.createMany({ data: unassignedUsers.map(({ id }) => ({ userId: id, roleId: studentRole.id })), skipDuplicates: true });

  if (process.env.SEED_DEMO_USERS === "true" && process.env.DEMO_PASSWORD) {
    const passwordHash = await hash(process.env.DEMO_PASSWORD, 12);
    const demos: Array<{ email: string; name: string; role: RoleCode }> = [
      { email: "student@campus.demo", name: "Demo Student", role: "STUDENT" },
      { email: "faculty@campus.demo", name: "Demo Faculty", role: "FACULTY" },
      { email: "counsellor@campus.demo", name: "Demo Counsellor", role: "COUNSELLOR" },
      { email: "coordinator@campus.demo", name: "Demo Coordinator", role: "COORDINATOR" },
      { email: "security@campus.demo", name: "Demo Security", role: "SECURITY" },
      { email: "library@campus.demo", name: "Demo Library Staff", role: "LIBRARY_STAFF" },
      { email: "admin@campus.demo", name: "Demo Admin", role: "ADMIN" },
    ];
    for (const demo of demos) {
      const user = await prisma.user.upsert({
        where: { email: demo.email }, update: { name: demo.name, passwordHash, status: "ACTIVE" },
        create: { email: demo.email, name: demo.name, passwordHash, emailVerified: new Date(), profile: { create: {} } },
      });
      const role = await prisma.role.findUniqueOrThrow({ where: { code: demo.role } });
      await prisma.userRole.upsert({ where: { userId_roleId: { userId: user.id, roleId: role.id } }, update: {}, create: { userId: user.id, roleId: role.id } });
      if (demo.role === "COUNSELLOR") await prisma.supportProfile.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id, type: "COUNSELLOR", specialties: ["Student wellbeing"], languages: ["English"] } });
    }
  }
}

main().finally(() => prisma.$disconnect());
