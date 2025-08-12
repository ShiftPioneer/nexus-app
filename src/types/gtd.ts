
// Define TaskPriority and TaskStatus types with all possible values
export type TaskPriority = "urgent" | "high" | "medium" | "low";

export type TaskStatus = 
  | "inbox" 
  | "next-action" 
  | "project" 
  | "waiting-for" 
  | "someday" 
  | "reference" 
  | "completed" 
  | "deleted" 
  | "today" 
  | "todo" 
  | "in-progress" 
  | "do-it" 
  | "delegate-it" 
  | "defer-it"
  | "delete-it"
  | "clarified";

export type TaskCategory = 
  | "inbox"
  | "next-actions"
  | "projects"
  | "waiting-for"
  | "someday-maybe"
  | "reference";

export type TaskType = "task" | "idea" | "project" | "reference";

export interface TaskAttachment {
  name: string;
  type: string;
  url?: string;
  file?: File | Blob;
}

export interface GTDTask {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  clarified: boolean;
  type: TaskType; // Added missing type property
  dueDate?: Date;
  createdAt: Date;
  tags?: string[];
  context?: string;
  project?: string;
  goalId?: string;
  timeEstimate?: number;
  delegatedTo?: string;
  attachment?: TaskAttachment;
  isToDoNot?: boolean;
  nextAction?: string;
}

export type GTDView = "capture" | "clarify" | "organize" | "reflect" | "engage";

export interface GTDState {
  inboxItems: GTDTask[];
  projects: GTDTask[];
  contexts: string[];
  nextActions: GTDTask[];
  waitingFor: GTDTask[];
  reference: GTDTask[];
}

export interface GTDContextType {
  tasks: GTDTask[];
  addTask: (task: Omit<GTDTask, "id" | "createdAt">) => void;
  updateTask: (id: string, updates: Partial<GTDTask>) => void;
  deleteTask: (id: string) => void;
  permanentlyDeleteTask: (id: string) => void;
  getDeletedTasks: () => GTDTask[];
  restoreTask: (id: string) => void;
  moveTask: (id: string, newStatus: TaskStatus, newPriority?: TaskPriority) => void;
  activeView: GTDView;
  setActiveView: (view: GTDView) => void;
  getTaskById: (id: string) => GTDTask | undefined;
  hasUnreadNotifications: boolean;
  setHasUnreadNotifications: (value: boolean) => void;
  markNotificationsAsRead: () => void;
  handleDragEnd: (result: any) => void;
  state: GTDState;
}
