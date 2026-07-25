import { PreviewAlert } from "@/components/feedback/preview-alert";
import { PageHeader } from "@/components/layout/page-header";
import { AchievementGrid } from "@/features/rewards/components/achievement-grid";
import { achievementBadges } from "@/lib/mock-data/rewards";

export default function RewardBadgesPage() {
  return <div className="grid gap-6"><PageHeader description="Celebrate completed milestones and see progress toward the next achievement." eyebrow="Student achievements" title="Achievement badges" /><PreviewAlert description="Badge progress and award dates are preview data." /><AchievementGrid badges={achievementBadges} /></div>;
}
