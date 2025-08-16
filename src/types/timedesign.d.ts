
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
}
