import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { auth } from "@/auth";
import { landingPathForRoles } from "@/lib/auth-landing";
import { AuthForm } from "@/components/auth-form";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user) {
    redirect(landingPathForRoles(session.user.roles));
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background p-4">
      <div className="absolute -left-32 top-0 size-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute -right-32 bottom-0 size-96 rounded-full bg-emerald-300/20 blur-3xl" />
      <Card className="relative w-full max-w-md border-border/70 py-7 shadow-2xl shadow-emerald-950/10">
        <CardHeader className="gap-4 px-7">
          <div className="flex items-center justify-between">
            <Link className="flex items-center gap-2 font-bold tracking-tight" href="/">
              <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                <ShieldCheck className="size-4" />
              </span>
              Voxa
            </Link>
            <Badge variant="secondary">Free to join</Badge>
          </div>
          <div className="space-y-2 pt-5">
            <CardTitle className="text-3xl font-bold tracking-tight">
              Create your account
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Your password is hashed before it is saved to PostgreSQL.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-7">
          <AuthForm mode="register" />
        </CardContent>
      </Card>
    </main>
  );
}
