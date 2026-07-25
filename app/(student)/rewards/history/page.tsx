import { PreviewAlert } from "@/components/feedback/preview-alert";
import { PageHeader } from "@/components/layout/page-header";
import { PointsHistory } from "@/features/rewards/components/points-history";
import { pointTransactions } from "@/lib/mock-data/rewards";

export default function RewardsHistoryPage() {
  return <div className="grid gap-6"><PageHeader description="Review how points were earned and redeemed across campus activities." eyebrow="Points ledger" title="Points history" /><PreviewAlert description="Transactions are typed preview data." /><PointsHistory transactions={pointTransactions} /></div>;
}
