import React, { useRef, useState, MouseEvent } from "react";
import { isSameDay } from "date-fns";
import CalendarEventBlock, { CalendarEvent } from "./CalendarEventBlock";
import CurrentTimeIndicator from "./CurrentTimeIndicator";

interface WeekDayColumnProps {
  day: Date;
  dayIndex: number;
  hours: number[];
  activities: TimeActivity[];
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
  onCreateActivity: (data: { startDate: Date; endDate: Date; startTime: string; endTime: string }) => void;
  getCurrentTimePosition: () => number;
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

const WeekDayColumn: React.FC<WeekDayColumnProps> = ({
  day,
  dayIndex,
  hours,
  activities,
  scheduledTasks = [],
  scheduledHabits = [],
  onEditActivity,
  onEditTask,
  onEditHabit,
  onToggleTaskComplete,
  onToggleHabitComplete,
  onCreateActivity,
  getCurrentTimePosition,
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
    const hrs = Math.floor(durationMinutes / 60);
    const mins = Math.round(durationMinutes % 60);
    if (hrs > 0) {
      return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
    }
    return `${mins}m`;
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

        if (startTime !== endTime) {
          onCreateActivity({
            startDate: day,
            endDate: day,
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

  // Filter items for this day
  const dayActivities = activities.filter((activity) => isSameDay(activity.startDate, day));
  const dayTasks = scheduledTasks.filter(
    (task) => task.scheduledDate && isSameDay(task.scheduledDate, day)
  );
  const dayHabits = scheduledHabits.filter(
    (habit) => habit.scheduledDate && isSameDay(habit.scheduledDate, day)
  );

  // Convert to CalendarEvents
  const calendarEvents: CalendarEvent[] = [
    ...dayActivities.map((activity) => ({
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
    ...dayTasks.map((task) => ({
      id: task.id,
      type: "task" as const,
      title: task.title,
      startTime: task.scheduledTime || "09:00",
      endTime: task.scheduledEndTime || addHour(task.scheduledTime || "09:00"),
      color: "orange",
      completed: task.completed,
      isRecurring: false,
    })),
    ...dayHabits.map((habit) => ({
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
      const activity = dayActivities.find((a) => a.id === event.id);
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
    <div
      key={dayIndex}
      className="border-r border-white/5 relative"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {hours.map((hour) => (
        <div key={hour} className="border-b border-white/5 h-[72px] relative">
          <div className="h-full relative">
            <div className="absolute top-1/2 w-full border-t border-dashed border-white/5"></div>
          </div>
        </div>
      ))}

      {isSameDay(day, new Date()) && (
        <div
          className="absolute left-0 right-0 border-t-2 border-primary z-10"
          style={{
            top: `${getCurrentTimePosition()}px`,
            width: "100%",
          }}
        >
          <div className="absolute -left-1.5 -top-2 w-3 h-3 rounded-full bg-primary animate-pulse border-2 border-slate-950"></div>
        </div>
      )}

      {dragData && (
        <div
          className="absolute w-full bg-primary/30 border-2 border-primary rounded-lg z-20 pointer-events-none flex items-center justify-center"
          style={{
            top: `${Math.min(dragData.startY, dragData.currentY)}px`,
            height: `${Math.max(18, Math.abs(dragData.currentY - dragData.startY))}px`,
            left: "0",
            right: "0",
          }}
        >
          <span className="text-[10px] font-semibold text-primary-foreground bg-primary px-1.5 py-0.5 rounded-full shadow-lg">
            {calculateDurationPreview()}
          </span>
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none">
        {calendarEvents.map((event) => (
          <div key={`${event.type}-${event.id}`} className="pointer-events-auto">
            <CalendarEventBlock
              event={event}
              style={getEventStyle(event.startTime, event.endTime)}
              onClick={() => handleEventClick(event)}
              onToggleComplete={handleToggleComplete}
              isWeekView={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekDayColumn;
