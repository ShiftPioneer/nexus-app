
export type TaskPriority = "Very Low" | "Low" | "Medium" | "High" | "Very High";
export type TaskStatus = "inbox" | "todo" | "today" | "next-action" | "waiting-for" | "someday" | "completed" | "deleted" | "in-progress" | "do-it" | "defer-it" | "delegate-it";

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size?: number;
}

export interface GTDTask {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  tags?: string[];
  priority?: TaskPriority;
  dueDate?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  completedAt?: Date | string;
  context?: string; // e.g., "home", "work", "errands"
  project?: string; // project identifier
  recurring?: {
    frequency: "daily" | "weekly" | "monthly" | "yearly";
    interval: number; // e.g., every 2 days, every 3 weeks
    endDate?: Date | string;
  };
  estimate?: number; // estimated time to complete in minutes
  actualTime?: number; // actual time taken to complete in minutes
  notes?: string;
  attachments?: TaskAttachment[];
  isToDoNot?: boolean;
  delegatedTo?: string;
  delegationStatus?: "pending" | "accepted" | "completed" | "rejected";
  goalId?: string;
  projectId?: string;
  // Additional tracking fields
  energy?: "low" | "medium" | "high";
  focus?: "low" | "medium" | "high";
  value?: number; // 1-10 rating of task's value/importance
}

export interface GTDContextType {
  tasks: GTDTask[];
  getTaskById: (id: string) => GTDTask | undefined;
  addTask: (task: GTDTask) => void;
  updateTask: (id: string, updates: Partial<GTDTask>) => void;
  deleteTask: (id: string) => void;
  permanentlyDeleteTask: (id: string) => void;
  getDeletedTasks: () => GTDTask[];
  restoreTask: (id: string) => void;
  moveTask: (id: string, newStatus: TaskStatus) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  hasUnreadNotifications: boolean;
  setHasUnreadNotifications: (hasUnread: boolean) => void;
  markNotificationsAsRead: () => void;
  handleDragEnd: (result: any) => void;
}
