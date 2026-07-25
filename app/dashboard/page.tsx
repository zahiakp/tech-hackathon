import { redirect } from "next/navigation";
import { Database, Fingerprint, LogOut, ShieldCheck } from "lucide-react";

import { auth, signOut } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-5">
      <div className="absolute right-[-8rem] top-[-8rem] size-[34rem] rounded-full bg-primary/15 blur-3xl" />
      <nav className="relative mx-auto flex h-20 w-full max-w-5xl items-center justify-between border-b">
        <span className="flex items-center gap-2 font-bold tracking-tight">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="size-5" />
          </span>
          Hackathon
        </span>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <Button type="submit" variant="outline">
            <LogOut />
            Sign out
          </Button>
        </form>
      </nav>

      <section className="relative mx-auto flex w-full max-w-3xl py-16 md:py-24">
        <Card className="w-full border-border/70 py-8 shadow-2xl shadow-emerald-950/10">
          <CardHeader className="gap-4 px-8 md:px-12">
            <Badge className="w-fit" variant="secondary">
              <span className="size-2 rounded-full bg-primary" /> Authenticated
            </Badge>
            <div className="space-y-3">
              <CardTitle className="text-4xl font-bold tracking-[-0.05em] md:text-6xl">
                Welcome, {session.user.name ?? "there"}.
              </CardTitle>
              <CardDescription className="max-w-2xl text-base leading-7">
                This route is protected on the server. Your active Auth.js
                session belongs to <strong>{session.user.email}</strong>.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-8 pt-5 md:px-12">
            <div className="overflow-hidden rounded-xl border bg-muted/30">
              <div className="grid gap-3 p-5 md:grid-cols-[11rem_1fr] md:items-center">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Fingerprint className="size-4" /> User ID
                </span>
                <span className="min-w-0 break-all font-mono text-sm font-medium">
                  {session.user.id}
                </span>
              </div>
              <Separator />
              <div className="grid gap-3 p-5 md:grid-cols-[11rem_1fr] md:items-center">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="size-4" /> Session
                </span>
                <span className="text-sm font-medium">Secure JWT cookie</span>
              </div>
              <Separator />
              <div className="grid gap-3 p-5 md:grid-cols-[11rem_1fr] md:items-center">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Database className="size-4" /> Database
                </span>
                <span className="text-sm font-medium">
                  Neon PostgreSQL via Prisma
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
