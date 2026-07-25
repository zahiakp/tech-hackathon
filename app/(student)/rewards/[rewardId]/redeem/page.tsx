import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { RedeemRewardPanel } from "@/features/rewards/components/redeem-reward-panel";
import { pointBalancePreview, rewardsPreview } from "@/lib/mock-data/rewards";

export default async function RedeemRewardPage({ params }: { params: Promise<{ rewardId: string }> }) {
  const { rewardId } = await params;
  const reward = rewardsPreview.find((item) => item.id === rewardId);
  if (!reward) return <EmptyState title="Reward not found" description="The requested preview reward does not exist." />;
  return <div className="mx-auto grid w-full max-w-2xl gap-6"><PageHeader description="Review the cost and remaining balance before confirming." eyebrow="Reward redemption" title={reward.title} /><RedeemRewardPanel balance={pointBalancePreview} reward={reward} /></div>;
}
