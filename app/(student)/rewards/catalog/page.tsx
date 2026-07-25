import { PreviewAlert } from "@/components/feedback/preview-alert";
import { PageHeader } from "@/components/layout/page-header";
import { RewardCatalog } from "@/features/rewards/components/reward-catalog";
import { pointBalancePreview, rewardsPreview } from "@/lib/mock-data/rewards";

export default function RewardsCatalogPage() {
  return <div className="grid gap-6"><PageHeader description={`You currently have ${pointBalancePreview.toLocaleString()} preview Numix available.`} eyebrow="Rewards catalogue" title="Available rewards" /><PreviewAlert description="Stock counts and Numix costs are preview data." /><RewardCatalog balance={pointBalancePreview} rewards={rewardsPreview} /></div>;
}
