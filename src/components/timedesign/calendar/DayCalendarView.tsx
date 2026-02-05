import React, { useRef, useState, MouseEvent } from "react";
import CurrentTimeIndicator from "./CurrentTimeIndicator";
import CalendarEventBlock, { CalendarEvent } from "./CalendarEventBlock";
import WeekTimeColumn from "./WeekTimeColumn";
import { isSameDay } from "date-fns";

interface DayCalendarViewProps {
  hours: number[];
  formatHour: (hour: number) => string;
  getCurrentTimePosition: () => number;
  filteredActivities: TimeActivity[];
  scheduledTasks?: Array<{
    id: string;
    title: string;
    scheduledDate?: Date;
    scheduledTime?: string;
    scheduledEndTime?: string;
    completed?: boolean;
  }>;
  scheduledHabits?: Array<{
    id: string;
    title: string;
    scheduledDate?: Date;
    scheduledTime?: string;
    scheduledEndTime?: string;
    status?: string;
  }>;
  onEditActivity: (activity: TimeActivity) => void;
  onEditTask?: (taskId: string) => void;
  onEditHabit?: (habitId: string) => void;
  onToggleTaskComplete?: (taskId: string) => void;
  onToggleHabitComplete?: (habitId: string) => void;
  onCreateActivity: (data: { startDate: Date; endDate: Date; startTime: string; endTime: string; }) => void;
  currentViewDate: Date;
}

// Helper to add time
const addHour = (time: string): string => {
  const [h, m] = time.split(":").map(Number);
  const newHour = Math.min(23, h + 1);
  return `${String(newHour).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

const addMinutes = (time: string, minutes: number): string => {
  const [h, m] = time.split(":").map(Number);
  const totalMinutes = h * 60 + m + minutes;
  const newHour = Math.min(23, Math.floor(totalMinutes / 60));
  const newMinute = totalMinutes % 60;
  return `${String(newHour).padStart(2, "0")}:${String(newMinute).padStart(2, "0")}`;
};

const DayCalendarView: React.FC<DayCalendarViewProps> = ({
  hours,
  formatHour,
  getCurrentTimePosition,
  filteredActivities,
  scheduledTasks = [],
  scheduledHabits = [],
  onEditActivity,
  onEditTask,
  onEditHabit,
  onToggleTaskComplete,
  onToggleHabitComplete,
  onCreateActivity,
  currentViewDate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragData, setDragData] = useState<{ startY: number; currentY: number } | null>(null);

  const PIXELS_PER_MINUTE = 1.2;
  const MIN_DURATION_MINUTES = 15;

  const pixelsToTime = (pixels: number) => {
    const totalMinutes = Math.max(0, pixels / PIXELS_PER_MINUTE);
    const hour = Math.floor(totalMinutes / 60);
    const minute = Math.round((totalMinutes % 60) / 15) * 15;
    const normalizedHour = Math.min(23, Math.max(0, hour));
    const normalizedMinute = minute >= 60 ? 45 : minute;
    return `${String(normalizedHour).padStart(2, "0")}:${String(normalizedMinute).padStart(2, "0")}`;
  };

  const calculateDurationPreview = () => {
    if (!dragData) return null;
    const startPx = Math.min(dragData.startY, dragData.currentY);
    const endPx = Math.max(dragData.startY, dragData.currentY);
    const durationMinutes = Math.max(MIN_DURATION_MINUTES, (endPx - startPx) / PIXELS_PER_MINUTE);
    const hours = Math.floor(durationMinutes / 60);
    const minutes = Math.round(durationMinutes % 60);
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const startY = e.clientY - rect.top;
    setDragData({ startY, currentY: startY });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (dragData) {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const currentY = Math.max(0, e.clientY - rect.top);
      setDragData({ ...dragData, currentY });
    }
  };

  const handleMouseUp = () => {
    if (dragData) {
      const dragDistance = Math.abs(dragData.startY - dragData.currentY);
      if (dragDistance >= MIN_DURATION_MINUTES * PIXELS_PER_MINUTE) {
        const startPx = Math.min(dragData.startY, dragData.currentY);
        const endPx = Math.max(dragData.startY, dragData.currentY);
        const startTime = pixelsToTime(startPx);
        const endTime = pixelsToTime(endPx);
        const activityDate = currentViewDate;

        if (startTime !== endTime) {
          onCreateActivity({
            startDate: activityDate,
            endDate: activityDate,
            startTime,
            endTime,
          });
        }
      }
    }
    setDragData(null);
  };

  // Get event style from time
  const getEventStyle = (startTime: string, endTime: string) => {
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    const top = startMinutes * PIXELS_PER_MINUTE;
    const height = Math.max(18, (endMinutes - startMinutes) * PIXELS_PER_MINUTE);
    return { top: `${top}px`, height: `${height}px` };
  };

  // Convert to CalendarEvents
  const calendarEvents: CalendarEvent[] = [
    // Activities
    ...filteredActivities.map((activity) => ({
      id: activity.id,
      type: "activity" as const,
      title: activity.title,
      startTime: activity.startTime,
      endTime: activity.endTime,
      color: activity.color || "purple",
      completed: false,
      isRecurring: activity.isRecurring,
      category: activity.category,
      description: activity.description,
    })),
    // Scheduled tasks for this day
    ...scheduledTasks
      .filter((task) => task.scheduledDate && isSameDay(task.scheduledDate, currentViewDate))
      .map((task) => ({
        id: task.id,
        type: "task" as const,
        title: task.title,
        startTime: task.scheduledTime || "09:00",
        endTime: task.scheduledEndTime || addHour(task.scheduledTime || "09:00"),
        color: "orange",
        completed: task.completed,
        isRecurring: false,
      })),
    // Scheduled habits for this day
    ...scheduledHabits
      .filter((habit) => habit.scheduledDate && isSameDay(habit.scheduledDate, currentViewDate))
      .map((habit) => ({
        id: habit.id,
        type: "habit" as const,
        title: habit.title,
        startTime: habit.scheduledTime || "08:00",
        endTime: habit.scheduledEndTime || addMinutes(habit.scheduledTime || "08:00", 30),
        color: "green",
        completed: habit.status === "completed",
        isRecurring: true,
      })),
  ];

  const handleEventClick = (event: CalendarEvent) => {
    if (event.type === "activity") {
      const activity = filteredActivities.find((a) => a.id === event.id);
      if (activity) onEditActivity(activity);
    } else if (event.type === "task" && onEditTask) {
      onEditTask(event.id);
    } else if (event.type === "habit" && onEditHabit) {
      onEditHabit(event.id);
    }
  };

  const handleToggleComplete = (id: string) => {
    const event = calendarEvents.find((e) => e.id === id);
    if (!event) return;
    if (event.type === "task" && onToggleTaskComplete) {
      onToggleTaskComplete(id);
    } else if (event.type === "habit" && onToggleHabitComplete) {
      onToggleHabitComplete(id);
    }
  };

  return (
    <div className="grid grid-cols-[3.5rem,1fr] min-h-[1728px]" onMouseUp={handleMouseUp}>
      <WeekTimeColumn hours={hours} formatHour={formatHour} />
      <div
        className="relative"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
      >
        {hours.map((hour) => (
          <div key={hour} className="border-b border-white/5 h-[72px] relative">
            <div className="absolute top-1/2 w-full border-t border-dashed border-white/5"></div>
          </div>
        ))}

        {dragData && (
          <div
            className="absolute w-full bg-primary/30 border-2 border-primary rounded-lg z-20 pointer-events-none flex items-center justify-center"
            style={{
              top: `${Math.min(dragData.startY, dragData.currentY)}px`,
              height: `${Math.max(18, Math.abs(dragData.currentY - dragData.startY))}px`,
            }}
          >
            <span className="text-xs font-semibold text-primary-foreground bg-primary px-2 py-0.5 rounded-full shadow-lg">
              {calculateDurationPreview()}
            </span>
          </div>
        )}

        <CurrentTimeIndicator getCurrentTimePosition={getCurrentTimePosition} />

        <div className="absolute inset-0 pointer-events-none">
          {calendarEvents.map((event) => (
            <div key={`${event.type}-${event.id}`} className="pointer-events-auto">
              <CalendarEventBlock
                event={event}
                style={getEventStyle(event.startTime, event.endTime)}
                onClick={() => handleEventClick(event)}
                onToggleComplete={handleToggleComplete}
                isWeekView={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayCalendarView;
