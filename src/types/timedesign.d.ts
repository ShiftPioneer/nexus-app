
interface TimeActivity {
  id: string;
  title: string;
  description?: string;
  category?: string;
  color?: string;
  startDate: Date | string;
  endDate: Date | string;
  startTime: string;
  endTime: string;
  syncWithGoogleCalendar?: boolean;
}
