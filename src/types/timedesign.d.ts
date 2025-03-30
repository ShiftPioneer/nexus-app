
interface TimeActivity {
  id: string;
  title: string;
  description?: string;
  category: "work" | "social" | "health" | "learning";
  color: "purple" | "blue" | "green" | "orange" | "red";
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  syncWithGoogleCalendar?: boolean;
}
