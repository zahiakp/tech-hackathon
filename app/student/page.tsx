import { signOut } from "@/auth";
import { PageHeader } from "@/components/layout/page-header";
import { StudentAppShell } from "@/components/layout/student-app-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";
import { dashboardPreviewData } from "@/lib/mock-data/dashboard";
import { requirePageRole } from "@/server/auth/page-guards";

export default async function StudentPage() {
  const user = await requirePageRole("STUDENT");

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <StudentAppShell user={user} signOutAction={handleSignOut}>
      <div className="space-y-6">
        <PageHeader
          action={<StatusBadge label="Preview data" tone="warning" />}
          description="Your campus activity, support, and academic updates in one place."
          eyebrow="Overview"
          title={`Welcome, ${user.name ?? "Student"}.`}
        />
        <DashboardOverview data={dashboardPreviewData} />
      </div>
    </StudentAppShell>
  );
}
