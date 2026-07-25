import Link from "next/link";
import { Gift, PackageCheck } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Reward } from "@/features/rewards/types";

export function RewardCard({ reward, balance }: { reward: Reward; balance: number }) {
  const affordable = balance >= reward.cost;
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-3"><span className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary"><Gift className="size-5" /></span><StatusBadge icon={PackageCheck} label={`${reward.stock} left`} tone={reward.stock < 5 ? "warning" : "muted"} /></div>
        <CardTitle>{reward.title}</CardTitle>
        <CardDescription>{reward.description}</CardDescription>
      </CardHeader>
      <CardContent><p className="text-2xl font-bold">{reward.cost.toLocaleString()} <span className="text-sm font-medium text-muted-foreground">Numix</span></p><p className="mt-1 text-sm text-muted-foreground">{reward.category}</p></CardContent>
      <CardFooter><Link aria-disabled={!affordable} className={buttonVariants({ variant: affordable ? "default" : "outline", className: !affordable ? "pointer-events-none w-full opacity-50" : "w-full" })} href={affordable ? `/rewards/${reward.id}/redeem` : "#"}>{affordable ? "Redeem reward" : "More Numix needed"}</Link></CardFooter>
    </Card>
  );
}
