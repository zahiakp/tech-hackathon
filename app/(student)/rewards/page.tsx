import Link from "next/link";
import { Award, Gift, History, QrCode, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { DataCard } from "@/components/shared/data-card";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { pointBalancePreview, pointTransactions, rewardsPreview } from "@/lib/mock-data/rewards";

const rewardLinks = [
  { href: "/rewards/history", title: "Numix history", description: "Review earned and redeemed Numix.", icon: History },
  { href: "/rewards/catalog", title: "Available rewards", description: "Explore rewards that match your balance.", icon: Gift },
  { href: "/rewards/claim", title: "QR reward claim", description: "Present a preview claim code.", icon: QrCode },
  { href: "/rewards/badges", title: "Achievement badges", description: "Track earned and in-progress milestones.", icon: Award },
];

export default function RewardsPage() {
  const earnedThisMonth = pointTransactions.filter((item) => item.type === "earned").reduce((sum, item) => sum + item.points, 0);
  return (
    <div className="grid gap-6">
      <PageHeader action={<Link className={buttonVariants()} href="/rewards/catalog"><Gift />Browse rewards</Link>} description="Track campus contributions, spend Numix, and celebrate achievements." eyebrow="Student rewards" title="Numix & rewards" />

      <div className="grid gap-4 sm:grid-cols-3"><DataCard className="sm:col-span-2" title="Available balance" value={pointBalancePreview.toLocaleString()} description="Numix ready to redeem" icon={Sparkles} /><DataCard title="Earned this month" value={`+${earnedThisMonth}`} description={`${rewardsPreview.length} rewards available`} icon={Award} /></div>
      <div className="grid gap-4 sm:grid-cols-2">{rewardLinks.map((item) => <Link href={item.href} key={item.href}><Card className="h-full transition-colors hover:border-primary/40"><CardHeader><item.icon className="size-5 text-primary" /><CardTitle>{item.title}</CardTitle><CardDescription>{item.description}</CardDescription></CardHeader></Card></Link>)}</div>
    </div>
  );
}
