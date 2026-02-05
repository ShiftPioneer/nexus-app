// Linked item representing a task or habit attached to an activity
interface LinkedItem {
  id: string;
  type: "task" | "habit";
  title: string;
  completed?: boolean;
}

// Scheduled item for calendar display (tasks or habits with scheduled times)
interface ScheduledItem {
  id: string;
  type: "task" | "habit";
  title: string;
  startDate: Date;
  startTime: string;
  endTime: string;
  completed?: boolean;
  color?: string;
}

interface TimeActivity {
  id: string;
  title: string;
  description?: string;
  category: "work" | "social" | "health" | "learning" | "studies" | "sport" | "leisure";
  color: "purple" | "blue" | "green" | "orange" | "red" | "indigo" | "cyan" | "yellow";
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  syncWithGoogleCalendar?: boolean;
  notes?: string;
  links?: string[];
  attachments?: string[];
  isRecurring?: boolean;
  recurrencePattern?: "daily" | "weekly" | "monthly" | "yearly" | "custom";
  recurrenceEnd?: Date;
  recurrenceDays?: string[];
  // Linked tasks/habits attached to this activity
  linkedItems?: LinkedItem[];
}
