
type FocusCategory = "Deep Work" | "Study" | "Creative" | "Education" | "Other";

interface FocusSession {
  id: string;
  date: Date;
  duration: number; // in minutes
  category: FocusCategory;
  xpEarned: number;
}

interface FocusStats {
  todayMinutes: number;
  weekMinutes: number;
  currentStreak: number;
  totalSessions: number;
  categoryStats: {
    category: FocusCategory;
    sessions: number;
    percentage: number;
  }[];
  longestSession: {
    duration: number;
    date: Date;
  };
  weeklyImprovement: number;
}

interface FocusTechnique {
  name: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  bestFor: string;
  structure: string;
  duration: number; // in minutes
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}
