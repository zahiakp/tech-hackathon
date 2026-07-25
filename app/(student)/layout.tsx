import { redirect } from "next/navigation";

import { auth, signOut } from "@/auth";
import { StudentAppShell } from "@/components/layout/student-app-shell";

export default async function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <StudentAppShell user={session.user} signOutAction={handleSignOut}>
      {children}
    </StudentAppShell>
  );
}
