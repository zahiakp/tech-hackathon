import { signOut } from "@/auth";
import { StudentAppShell } from "@/components/layout/student-app-shell";
import { requirePageRole } from "@/server/auth/page-guards";

export default async function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requirePageRole("STUDENT");

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <StudentAppShell user={user} signOutAction={handleSignOut}>
      {children}
    </StudentAppShell>
  );
}
