import type {
  AchievementBadge,
  PointTransaction,
  Reward,
} from "@/features/rewards/types";

export const pointBalancePreview = 1240;

export const pointTransactions: PointTransaction[] = [
  { id: "points-01", title: "Tech Summit volunteer", description: "Event contribution", date: "24 Jul 2026", points: 180, type: "earned" },
  { id: "points-02", title: "Library book returned early", description: "Responsible borrowing", date: "21 Jul 2026", points: 40, type: "earned" },
  { id: "points-03", title: "Campus café voucher", description: "Reward redemption", date: "18 Jul 2026", points: -250, type: "redeemed" },
  { id: "points-04", title: "Well-being workshop", description: "Event participation", date: "12 Jul 2026", points: 100, type: "earned" },
  { id: "points-05", title: "Peer mentor contribution", description: "Community support", date: "08 Jul 2026", points: 200, type: "earned" },
];

export const rewardsPreview: Reward[] = [
  { id: "cafe-voucher", title: "Campus café voucher", category: "Food", description: "₹100 credit at participating campus cafés.", cost: 250, stock: 18 },
  { id: "library-priority", title: "Priority reservation pass", category: "Library", description: "One priority reservation for an available library title.", cost: 400, stock: 6 },
  { id: "event-merch", title: "Voxa event merchandise", category: "Merchandise", description: "Limited-edition campus event tote bag.", cost: 650, stock: 4 },
  { id: "printing-credit", title: "Printing credit", category: "Campus", description: "Add 50 pages to your campus print allowance.", cost: 180, stock: 32 },
];

export const achievementBadges: AchievementBadge[] = [
  { id: "badge-01", title: "Campus contributor", description: "Volunteer at three campus events.", earnedAt: "24 Jul 2026", progress: 100 },
  { id: "badge-02", title: "Responsible reader", description: "Return five library books on time.", earnedAt: "21 Jul 2026", progress: 100 },
  { id: "badge-03", title: "Community builder", description: "Complete five peer-support contributions.", progress: 60 },
  { id: "badge-04", title: "Event explorer", description: "Attend ten registered campus events.", progress: 70 },
];
