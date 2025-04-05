
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  lastUpdated: Date;
  pinned?: boolean;
}

export interface Resource {
  id: string;
  title: string;
  url?: string;
  type: "article" | "video" | "book" | "course" | "other";
  notes?: string;
  tags: string[];
  dateAdded: Date;
  pinned?: boolean;
  completed?: boolean;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export type Priority = "high" | "medium" | "low";
export type ProjectStatus = "not-started" | "in-progress" | "completed" | "on-hold" | "cancelled" | "active";
export type GoalStatus = "not-started" | "in-progress" | "completed" | "on-hold" | "cancelled";
export type TaskStatus = "inbox" | "next-action" | "project" | "waiting-for" | "someday" | "reference" | "completed" | "deleted" | "today" | "todo" | "in-progress" | "done";

export interface Goal {
  id: string;
  title: string;
  description: string;
  status: GoalStatus;
  dueDate?: Date;
  startDate: Date;
  timeframe: string;
  category: string;
  progress: number;
  milestones: Milestone[];
  pinned?: boolean;
  subGoals?: Goal[];
  parentGoalId?: string;
  endDate?: Date;
  blockingGoals?: string[];
  blockedByGoals?: string[];
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  dueDate?: Date;
  startDate: Date;
  category: string;
  priority: Priority;
  tasks?: string[];
  subProjects?: Project[];
  progress?: number;
  pinned?: boolean;
  endDate?: Date;
  parentProjectId?: string;
}

export interface GTDTask {
  id: string;
  title: string;
  description?: string;
  priority: "Very Low" | "Low" | "Medium" | "High" | "Very High";
  status: TaskStatus;
  dueDate?: Date;
  createdAt: Date;
  tags?: string[];
  context?: string;
  project?: string;
  timeEstimate?: number;
  delegatedTo?: string;
  attachment?: {
    name: string;
    type: string;
    url?: string;
    file?: File;
  };
}
