"use client";

import { useMemo, useState } from "react";
import { Gift, Search } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { Input } from "@/components/ui/input";
import { RewardCard } from "@/features/rewards/components/reward-card";
import type { Reward } from "@/features/rewards/types";

export function RewardCatalog({ rewards, balance }: { rewards: Reward[]; balance: number }) {
  const [query, setQuery] = useState("");
  const visible = useMemo(() => {
    const value = query.trim().toLowerCase();
    return value ? rewards.filter((reward) => `${reward.title} ${reward.category}`.toLowerCase().includes(value)) : rewards;
  }, [query, rewards]);
  return (
    <div className="grid gap-5">
      <div className="relative max-w-xl"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" onChange={(event) => setQuery(event.target.value)} placeholder="Search available rewards" value={query} /></div>
      {visible.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visible.map((reward) => <RewardCard balance={balance} key={reward.id} reward={reward} />)}</div> : <EmptyState icon={Gift} title="No matching rewards" description="Try a different reward or category." />}
    </div>
  );
}
