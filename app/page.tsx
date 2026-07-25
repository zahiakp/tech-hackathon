import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Database,
  KeyRound,
  ShieldCheck,
} from "lucide-react";

import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const stack = [
  {
    icon: KeyRound,
    title: "Auth.js",
    detail: "Credentials and secure JWT sessions",
  },
  {
    icon: Database,
    title: "Prisma ORM",
    detail: "Type-safe user and account models",
  },
  {
    icon: ShieldCheck,
    title: "Neon PostgreSQL",
    detail: "SSL pooled database connection",
  },
];

export default async function Home() {
  const session = await auth();

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute right-[-8rem] top-[-8rem] size-[34rem] rounded-full bg-primary/15 blur-3xl" />
      <nav className="relative mx-auto flex h-20 w-full max-w-6xl items-center justify-between border-b px-5 lg:px-0">
        <Link className="flex items-center gap-2 font-bold tracking-tight" href="/">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <ShieldCheck className="size-5" />
          </span>
          Hackathon
        </Link>
        <div className="flex items-center gap-2">
          {session?.user ? (
            <Link className={buttonVariants({ size: "lg" })} href="/student">
              Open dashboard
              <ArrowRight />
            </Link>
          ) : (
            <>
              <Link
                className={buttonVariants({ variant: "ghost", size: "lg" })}
                href="/login"
              >
                Sign in
              </Link>
              <Link className={buttonVariants({ size: "lg" })} href="/register">
                Create account
              </Link>
            </>
          )}
        </div>
      </nav>

      <section className="relative mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center gap-14 px-5 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:px-0">
        <div>
          <Badge className="mb-6" variant="secondary">
            <CheckCircle2 /> Authentication ready
          </Badge>
          <h1 className="max-w-3xl text-5xl leading-[0.98] font-bold tracking-[-0.06em] text-balance sm:text-7xl">
            A secure foundation for your next big idea.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">
            Auth.js handles sessions, Prisma provides type-safe data access, and
            Neon keeps your PostgreSQL database serverless and production-ready.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}
              href={session?.user ? "/student" : "/register"}
            >
              {session?.user ? "Go to dashboard" : "Get started"}
              <ArrowRight />
            </Link>
            {!session?.user && (
              <Link
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-11 px-5",
                )}
                href="/login"
              >
                I have an account
              </Link>
            )}
          </div>
        </div>

        <Card className="border-border/70 py-2 shadow-2xl shadow-emerald-950/10 lg:rotate-1">
          <CardHeader className="px-6 pt-5 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Your authentication stack
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            {stack.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.title}>
                  {index > 0 && <Separator />}
                  <div className="grid grid-cols-[2.75rem_1fr_auto] items-center gap-4 px-3 py-5">
                    <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <div className="grid gap-1">
                      <strong className="font-semibold">{item.title}</strong>
                      <span className="text-sm text-muted-foreground">
                        {item.detail}
                      </span>
                    </div>
                    <CheckCircle2 className="size-5 text-primary" />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
