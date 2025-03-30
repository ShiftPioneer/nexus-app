
interface Habit {
  id: string;
  title: string;
  category: string;
  streak: number;
  target: number;
  status: "completed" | "pending" | "missed";
  completionDates: Date[];
  type: "daily" | "weekly" | "monthly";
  createdAt: Date;
}

interface HabitStatistics {
  totalHabits: number;
  completedHabits: number;
  streakAverage: number;
  completionRate: number;
  dailyHabits: number;
  weeklyHabits: number;
  monthlyHabits: number;
}

type HabitCategory = "mindfulness" | "health" | "learning" | "productivity" | "relationships" | "finance" | "other";

interface HabitCategoryData {
  category: HabitCategory;
  count: number;
  completionRate: number;
}
