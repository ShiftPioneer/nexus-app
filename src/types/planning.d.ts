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
export type ProjectStatus = "not-started" | "in-progress" | "completed" | "on-hold" | "cancelled";
export type GoalStatus = "not-started" | "in-progress" | "completed" | "on-hold" | "cancelled";

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
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  dueDate?: Date;
  startDate: Date;
  category?: string; // Adding the category property
  priority: Priority;
  tasks?: string[];
  subProjects?: Project[];
  progress?: number;
  pinned?: boolean;
}
