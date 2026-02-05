
interface HabitCompletion {
  date: Date;
  count: number; // How many times completed on this date
}

interface Habit {
  id: string;
  title: string;
  category: HabitCategory;
  streak: number;
  target: number;
  status: "completed" | "pending" | "missed" | "partial";
  completionDates: Date[];
  type: "daily" | "weekly" | "monthly";
  createdAt: Date;
  duration?: string;
  scoreValue?: number;
  penaltyValue?: number;
  // Multi-daily tracking
  dailyTarget?: number; // How many times per day (e.g., 5 for prayers)
  todayCompletions?: number; // How many times completed today
  completionHistory?: HabitCompletion[]; // Detailed completion history
  // Calendar scheduling
  scheduledDate?: Date; // When to do this habit
  scheduledTime?: string; // Start time for calendar block (e.g., "08:00")
  scheduledEndTime?: string; // End time for calendar block (e.g., "08:30")
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
