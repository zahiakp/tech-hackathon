import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AuthShellProps = {
  badge: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthShell({
  badge,
  title,
  description,
  children,
}: AuthShellProps) {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background p-4">
      <div className="absolute -left-32 top-0 size-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute -right-32 bottom-0 size-96 rounded-full bg-emerald-300/20 blur-3xl" />
      <Card className="relative w-full max-w-md border-border/70 py-7 shadow-2xl shadow-emerald-950/10">
        <CardHeader className="gap-4 px-7">
          <div className="flex items-center justify-between gap-3">
            <Link
              className="flex min-w-0 items-center gap-2 font-bold tracking-tight"
              href="/"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
                <ShieldCheck className="size-4" aria-hidden="true" />
              </span>
              <span className="truncate">Voxa</span>
            </Link>
            <Badge className="shrink-0" variant="secondary">
              {badge}
            </Badge>
          </div>
          <div className="space-y-2 pt-5">
            <CardTitle className="text-3xl font-bold tracking-tight text-balance">
              {title}
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              {description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-7">{children}</CardContent>
      </Card>
    </main>
  );
}
