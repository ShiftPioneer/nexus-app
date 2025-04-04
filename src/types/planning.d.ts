
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
}

export interface GTDTask extends Task {
  context?: string;
  project?: string;
  nextAction?: boolean;
  timeEstimate?: number; // in minutes
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  progress: number; // 0-100
  status: 'active' | 'completed' | 'abandoned';
  priority: 'low' | 'medium' | 'high';
  category?: string;
  relatedProjects?: string[]; // IDs of related projects
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  progress: number; // 0-100
  status: 'active' | 'on-hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  goalId?: string; // ID of the parent goal
  tasks?: string[]; // IDs of tasks related to this project
}
