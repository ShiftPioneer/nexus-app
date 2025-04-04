
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
