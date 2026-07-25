"use client";

import { useState } from "react";
import { Gift, Sparkles } from "lucide-react";

import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { PreviewAlert } from "@/components/feedback/preview-alert";
import { SuccessState } from "@/components/feedback/success-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Reward } from "@/features/rewards/types";

export function RedeemRewardPanel({ reward, balance }: { reward: Reward; balance: number }) {
  const [complete, setComplete] = useState(false);
  const remaining = balance - reward.cost;
  return (
    <div className="grid gap-6">
      <PreviewAlert description="Redemption is a UI preview. Numix are not deducted and no claim is created." />
      {complete && <SuccessState title="Redemption preview ready" description="A real implementation would now issue a claim QR code." />}
      <Card>
        <CardHeader><span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary"><Gift /></span><CardTitle>{reward.title}</CardTitle><CardDescription>{reward.description}</CardDescription></CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-3 rounded-xl bg-muted/50 p-4 text-sm"><div className="flex justify-between"><span>Current balance</span><strong>{balance.toLocaleString()}</strong></div><div className="flex justify-between"><span>Reward cost</span><strong>−{reward.cost.toLocaleString()}</strong></div><div className="flex justify-between border-t pt-3"><span>Balance after redemption</span><strong>{remaining.toLocaleString()}</strong></div></div>
          <ConfirmDialog trigger={<Button className="w-full"><Sparkles />Confirm redemption</Button>} title={`Redeem ${reward.title}?`} description={`This preview confirms a ${reward.cost} Numix redemption. No Numix will actually be deducted.`} confirmLabel="Preview redemption" onConfirm={() => setComplete(true)} />
        </CardContent>
      </Card>
    </div>
  );
}
