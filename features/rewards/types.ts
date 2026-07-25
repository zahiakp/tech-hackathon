export type PointTransaction = {
  id: string;
  title: string;
  description: string;
  date: string;
  points: number;
  type: "earned" | "redeemed";
};

export type Reward = {
  id: string;
  title: string;
  category: string;
  description: string;
  cost: number;
  stock: number;
};

export type AchievementBadge = {
  id: string;
  title: string;
  description: string;
  earnedAt?: string;
  progress: number;
};
