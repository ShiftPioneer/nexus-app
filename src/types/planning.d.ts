
interface Goal {
  id: string;
  title: string;
  description: string;
  category: "wealth" | "health" | "relationships" | "spirituality" | "education" | "career";
  timeframe: "week" | "month" | "quarter" | "year" | "decade" | "lifetime";
  progress: number;
  startDate: Date;
  endDate: Date;
  milestones: Milestone[];
  status: "not-started" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  tags: string[];
  motivationalQuotes: string[];
  reflectionAnswers: Record<string, string>;
  blockingGoals?: string[];
  blockedByGoals?: string[];
  timeframeAnswers?: {
    questionIndex: number;
    answer: string;
  }[];
  createdAt: Date;
  updatedAt?: Date;
}

interface Project {
  id: string;
  title: string;
  description: string;
  category: "wealth" | "health" | "relationships" | "spirituality" | "education" | "career";
  progress: number;
  startDate: Date;
  endDate: Date;
  status: "not-started" | "in-progress" | "completed";
  blockingProjects?: string[];
  blockedByProjects?: string[];
  createdAt: Date;
}

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate: Date;
}
