
interface TimeActivity {
  id: string;
  title: string;
  description: string; // Changed from optional to required to match usage
  category: "work" | "social" | "health" | "learning";
  color: "purple" | "blue" | "green" | "orange" | "red";
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  syncWithGoogleCalendar?: boolean;
}
