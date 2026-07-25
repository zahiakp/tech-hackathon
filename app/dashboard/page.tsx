import { redirect } from "next/navigation";
import { requirePageUser } from "@/server/auth/page-guards";

export default async function DashboardPage() {
  const user = await requirePageUser();
  if (user.roles.includes("ADMIN")) redirect("/admin");
  if (user.roles.includes("SECURITY")) redirect("/security");
  if (user.roles.includes("COORDINATOR")) redirect("/admin/complaints");
  if (user.roles.includes("COUNSELLOR")) redirect("/counsellor/appointments");
  if (user.roles.includes("FACULTY")) redirect("/faculty/attendance");
  if (user.roles.includes("LIBRARY_STAFF")) redirect("/library-staff");
  redirect("/student");
}