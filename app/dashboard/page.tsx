import { redirect } from "next/navigation";
import { landingPathForRoles } from "@/lib/auth-landing";
import { requirePageUser } from "@/server/auth/page-guards";

export default async function DashboardPage() {
  const user = await requirePageUser();
  redirect(landingPathForRoles(user.roles));
}