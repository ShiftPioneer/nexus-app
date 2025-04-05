
export type TaskStatus = 'todo' | 'in-progress' | 'done' | 'archived';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  pinned?: boolean;
}

export interface GTDTask extends Task {
  context?: string;
  project?: string;
  nextAction?: boolean;
  timeEstimate?: number; // in minutes
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate: Date;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: "wealth" | "health" | "relationships" | "spirituality" | "education" | "career";
  timeframe: "week" | "month" | "quarter" | "year" | "decade" | "lifetime";
  progress: number;
  startDate: Date;
  endDate: Date;
  milestones: Milestone[];
  status: "not-started" | "in-progress" | "completed";
  subGoals?: Goal[];
  parentGoalId?: string;
  blockingGoals?: string[];
  blockedByGoals?: string[];
  timeframeAnswers?: {
    questionIndex: number;
    answer: string;
  }[];
  pinned?: boolean;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  progress: number; // 0-100
  status: 'active' | 'on-hold' | 'completed' | 'cancelled' | 'not-started' | 'in-progress';
  priority: 'low' | 'medium' | 'high';
  goalId?: string; // ID of the parent goal
  tasks?: string[]; // IDs of tasks related to this project
  subProjects?: Project[];
  parentProjectId?: string;
  pinned?: boolean;
}
