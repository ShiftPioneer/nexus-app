
interface Goal {
  id: string;
  title: string;
  description: string;
  category: "wealth" | "health" | "relationships" | "spirituality";
  timeframe: "short-term" | "long-term";
  progress: number;
  startDate: Date;
  endDate: Date;
  milestones: Milestone[];
  status: "not-started" | "in-progress" | "completed";
}

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate: Date;
}
