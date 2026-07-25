import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CalendarCheck2,
  CalendarDays,
  CircleCheckBig,
  Gift,
  HeartHandshake,
  LibraryBig,
  MapPin,
  MessageSquareWarning,
  Rocket,
  ShieldCheck,
  Siren,
  Sparkles,
  Users,
} from "lucide-react";

import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { landingPathForRoles } from "@/lib/auth-landing";
import { cn } from "@/lib/utils";

const services = [
  { icon: Siren, title: "SOS response", detail: "Share your location and reach campus security quickly.", tone: "bg-rose-500/10 text-rose-600" },
  { icon: MessageSquareWarning, title: "Complaints", detail: "Raise, track, and resolve named or anonymous concerns.", tone: "bg-amber-500/10 text-amber-700" },
  { icon: HeartHandshake, title: "Peer support", detail: "Find mentors, counsellors, appointments, and confidential help.", tone: "bg-violet-500/10 text-violet-700" },
  { icon: Bot, title: "Lexa", detail: "Get safe, moderated guidance to approved campus resources.", tone: "bg-sky-500/10 text-sky-700" },
  { icon: CalendarCheck2, title: "Attendance", detail: "See subject-wise progress and submit correction requests.", tone: "bg-emerald-500/10 text-emerald-700" },
  { icon: CalendarDays, title: "Events", detail: "Discover events, register, check in, and record participation.", tone: "bg-blue-500/10 text-blue-700" },
  { icon: Gift, title: "Numix", detail: "Earn campus contribution credits and redeem meaningful rewards.", tone: "bg-fuchsia-500/10 text-fuchsia-700" },
  { icon: LibraryBig, title: "Library", detail: "Search availability, reserve books, and follow due dates.", tone: "bg-orange-500/10 text-orange-700" },
  { icon: Rocket, title: "Campus ventures", detail: "Build startup teams and connect with mentors and opportunities.", tone: "bg-cyan-500/10 text-cyan-700" },
];

const trustPoints = [
  "Role-based access for every campus team",
  "Private updates for sensitive workflows",
  "One connected record across student services",
];

const dashboardHighlights = [
  { icon: Siren, label: "Emergency help", detail: "Always visible" },
  { icon: CalendarCheck2, label: "Attendance", detail: "Live overview" },
  { icon: Users, label: "Support team", detail: "Private access" },
  { icon: Gift, label: "Numix balance", detail: "Rewards ready" },
];

export default async function Home() {
  const session = await auth();
  const primaryHref = session?.user ? landingPathForRoles(session.user.roles) : "/register";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="relative overflow-hidden border-b bg-gradient-to-b from-background to-muted/40">
        <div className="absolute left-[-12rem] top-32 size-96 rounded-full bg-emerald-400/10 blur-3xl" />
        <nav className="relative mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link className="flex items-center gap-3 font-bold tracking-tight" href="/">
            <span className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"><ShieldCheck className="size-5" /></span>
            <span className="text-xl">Vaxa</span>
          </Link>
          <div className="flex items-center gap-2">
            {session?.user ? (
              <Link className={buttonVariants({ size: "lg" })} href={primaryHref}>Open workspace <ArrowRight /></Link>
            ) : (
              <><Link className={buttonVariants({ variant: "ghost", size: "lg" })} href="/login">Sign in</Link><Link className={cn(buttonVariants({ size: "lg" }), "hidden sm:inline-flex")} href="/register">Join Vaxa</Link></>
            )}
          </div>
        </nav>

        <section className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-5 py-20 lg:min-h-[690px] lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-24">
          <div>
            <Badge className="mb-6 rounded-full px-3 py-1" variant="secondary"><Sparkles /> One campus. One connected experience.</Badge>
            <h1 className="max-w-3xl text-5xl font-bold leading-[0.98] tracking-[-0.055em] text-balance sm:text-7xl">Campus life works better when support is within reach.</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">Vaxa connects safety, student care, academics, events, library services, campus ventures, and rewards in one secure platform.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link className={cn(buttonVariants({ size: "lg" }), "h-12 rounded-xl px-6")} href={primaryHref}>{session?.user ? "Go to my workspace" : "Get started"}<ArrowRight /></Link>
              {!session?.user && <Link className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 rounded-xl bg-background/70 px-6")} href="/login">Use an existing account</Link>}
            </div>
            <div className="mt-9 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
              {trustPoints.map((point) => <div className="flex gap-2" key={point}><CircleCheckBig className="mt-0.5 size-4 shrink-0 text-primary" /><span>{point}</span></div>)}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-primary/10 blur-2xl" />
            <Card className="relative overflow-hidden border-border/70 bg-card/90 py-0 shadow-2xl backdrop-blur">
              <CardHeader className="border-b bg-muted/40 p-6"><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Today on campus</p><CardTitle className="mt-2 text-2xl">Everything important, close by</CardTitle></div><span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground"><MapPin /></span></div></CardHeader>
              <CardContent className="grid gap-3 p-5 sm:grid-cols-2">
                {dashboardHighlights.map(({ icon: Icon, label, detail }) => <div className="rounded-2xl border bg-background p-4" key={label}><Icon className="size-5 text-primary" /><p className="mt-5 font-semibold">{label}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div>)}
                <div className="col-span-full flex items-center gap-3 rounded-2xl bg-foreground p-4 text-background"><span className="grid size-10 place-items-center rounded-xl bg-background/10"><Bot className="size-5" /></span><div className="min-w-0"><p className="font-semibold">Ask Lexa</p><p className="text-sm text-background/65">Find the right campus resource and next step.</p></div><ArrowRight className="ml-auto size-5" /></div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      <section className="mx-auto w-full max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Built around student life</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">The campus services you need, without the runaround.</h2><p className="mt-5 text-lg leading-8 text-muted-foreground">Students get a clear personal workspace. Staff teams get focused tools with access limited by role and responsibility.</p></div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, detail, tone }) => <Card className="group transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg" key={title}><CardHeader><span className={cn("grid size-11 place-items-center rounded-2xl", tone)}><Icon className="size-5" /></span><CardTitle className="pt-4">{title}</CardTitle></CardHeader><CardContent className="text-sm leading-6 text-muted-foreground">{detail}</CardContent></Card>)}
        </div>
      </section>

      <section className="border-y bg-muted/40"><div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-[1fr_auto] lg:px-8"><div><p className="text-sm font-semibold text-primary">Ready when campus life gets busy</p><h2 className="mt-2 text-3xl font-bold tracking-tight">Your Vaxa workspace is one sign-in away.</h2><p className="mt-3 max-w-2xl text-muted-foreground">Open the right dashboard automatically based on your role, from student services to campus administration.</p></div><Link className={cn(buttonVariants({ size: "lg" }), "h-12 rounded-xl px-6")} href={primaryHref}>{session?.user ? "Open workspace" : "Create an account"}<ArrowRight /></Link></div></section>

      <footer className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8"><p className="font-semibold text-foreground">Vaxa</p><p>Safety, support, and campus life in one place.</p></footer>
    </main>
  );
}