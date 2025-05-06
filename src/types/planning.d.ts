
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
  blockingGoals?: string[];
  blockedByGoals?: string[];
  timeframeAnswers?: {
    questionIndex: number;
    answer: string;
  }[];
  linkedProjects?: string[];
  linkedTasks?: string[];
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
  linkedGoals?: string[];
  linkedTasks?: string[];
}

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate: Date;
}
