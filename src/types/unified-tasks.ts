// Unified Task System - combines Actions and GTD task types

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type TaskType = "todo" | "not-todo" | "project" | "reference" | "someday";

export type TaskStatus = 
  | "inbox"           // Unclarified items
  | "active"          // Clarified and ready to work on
  | "waiting-for"     // Delegated or waiting on someone
  | "someday"         // Future/maybe items
  | "completed"       // Done
  | "deleted";        // Soft deleted

export type TaskCategory = 
  | "work"
  | "personal"
  | "health"
  | "finance"
  | "learning"
  | "relationships"
  | "general";

export interface TaskAttachment {
  name: string;
  type: string;
  url?: string;
}

export interface UnifiedTask {
  id: string;
  title: string;
  description?: string;
  
  // Core properties
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  
  // Eisenhower Matrix support
  urgent?: boolean;
  important?: boolean;
  
  // GTD-specific
  clarified: boolean;
  context?: string;          // @home, @office, @computer, etc.
  nextAction?: string;       // For projects - what's the next physical action?
  delegatedTo?: string;      // For waiting-for items
  
  // Planning integration
  goalId?: string;
  projectId?: string;
  
  // Time
  dueDate?: Date;
  scheduledDate?: Date;      // When to work on it (Time Design integration)
  scheduledTime?: string;    // Start time for calendar block (e.g., "09:00")
  scheduledEndTime?: string; // End time for calendar block (e.g., "10:00")
  timeEstimate?: number;     // In minutes
  createdAt: Date;
  completedAt?: Date;
  deletedAt?: Date;
  
  // Metadata
  tags?: string[];
  attachment?: TaskAttachment;
  
  // Tracking
  completed: boolean;
}

// Context type for the unified task system
export interface UnifiedTasksContextType {
  tasks: UnifiedTask[];
  setTasks: (tasks: UnifiedTask[]) => void;
  
  // Filtered views
  inboxTasks: UnifiedTask[];
  activeTasks: UnifiedTask[];
  todoTasks: UnifiedTask[];
  notTodoTasks: UnifiedTask[];
  waitingForTasks: UnifiedTask[];
  somedayTasks: UnifiedTask[];
  deletedTasks: UnifiedTask[];
  projectTasks: UnifiedTask[];
  
  // Task operations
  addTask: (task: Omit<UnifiedTask, "id" | "createdAt">) => void;
  updateTask: (taskId: string, updates: Partial<UnifiedTask>) => void;
  deleteTask: (taskId: string) => void;
  restoreTask: (taskId: string) => void;
  permanentlyDeleteTask: (taskId: string) => void;
  completeTask: (taskId: string) => void;
  
  // Quick capture - adds to inbox
  quickCapture: (title: string, type?: TaskType, priority?: TaskPriority) => void;
  
  // Clarify - move from inbox to active with matrix placement
  clarifyTask: (taskId: string, urgent: boolean, important: boolean) => void;
  
  // Schedule task (Time Design integration) - with optional time slot
  scheduleTask: (taskId: string, scheduledDate: Date, scheduledTime?: string, scheduledEndTime?: string) => void;
  
  // Move to different status
  moveToWaitingFor: (taskId: string, delegatedTo: string) => void;
  moveToSomeday: (taskId: string) => void;
  moveToActive: (taskId: string) => void;
}
