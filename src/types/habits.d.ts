
interface Habit {
  id: string;
  title: string;
  category: HabitCategory;
  streak: number;
  target: number;
  status: "completed" | "pending" | "missed";
  completionDates: Date[];
  type: "daily" | "weekly" | "monthly";
  createdAt: Date;
  duration?: string;
  scoreValue?: number;
  penaltyValue?: number;
}

interface HabitStatistics {
  totalHabits: number;
  completedHabits: number;
  streakAverage: number;
  completionRate: number;
  dailyHabits: number;
  weeklyHabits: number;
  monthlyHabits: number;
  accountabilityScore: number;
}

type HabitCategory = "mindfulness" | "health" | "learning" | "productivity" | "relationships" | "finance" | "religion" | "other";

interface HabitCategoryData {
  category: HabitCategory;
  count: number;
  completionRate: number;
}
