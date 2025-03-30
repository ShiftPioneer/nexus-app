
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
}

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate: Date;
}
