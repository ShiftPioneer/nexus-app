import React, { useRef, useState, MouseEvent } from "react";
import { format, isSameDay } from "date-fns";
import CurrentTimeIndicator from "./CurrentTimeIndicator";
import CalendarEventBlock, { CalendarEvent } from "./CalendarEventBlock";
import WeekTimeColumn from "./WeekTimeColumn";

interface TwoDayCalendarViewProps {
  days: Date[];
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
  onCreateActivity: (data: { startDate: Date; endDate: Date; startTime: string; endTime: string }) => void;
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

const TwoDayCalendarView: React.FC<TwoDayCalendarViewProps> = ({
  days,
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
}) => {
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [dragData, setDragData] = useState<{ dayIndex: number; startY: number; currentY: number } | null>(null);

  const PIXELS_PER_MINUTE = 1.2;
  const MIN_DURATION_MINUTES = 15;

  const isToday = (date: Date) => isSameDay(date, new Date());

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

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>, dayIndex: number) => {
    const container = containerRefs.current[dayIndex];
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const startY = e.clientY - rect.top - 60; // Account for header
    setDragData({ dayIndex, startY, currentY: startY });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>, dayIndex: number) => {
    if (dragData && dragData.dayIndex === dayIndex) {
      const container = containerRefs.current[dayIndex];
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const currentY = Math.max(0, e.clientY - rect.top - 60);
      setDragData({ ...dragData, currentY });
    }
  };

  const handleMouseUp = (dayIndex: number) => {
    if (dragData && dragData.dayIndex === dayIndex) {
      const dragDistance = Math.abs(dragData.startY - dragData.currentY);
      if (dragDistance >= MIN_DURATION_MINUTES * PIXELS_PER_MINUTE) {
        const startPx = Math.min(dragData.startY, dragData.currentY);
        const endPx = Math.max(dragData.startY, dragData.currentY);
        const startTime = pixelsToTime(startPx);
        const endTime = pixelsToTime(endPx);

        if (startTime !== endTime) {
          onCreateActivity({
            startDate: days[dayIndex],
            endDate: days[dayIndex],
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

  const getEventsForDay = (day: Date): CalendarEvent[] => {
    const dayActivities = filteredActivities.filter((a) => isSameDay(a.startDate, day));
    const dayTasks = scheduledTasks.filter((t) => t.scheduledDate && isSameDay(t.scheduledDate, day));
    const dayHabits = scheduledHabits.filter((h) => h.scheduledDate && isSameDay(h.scheduledDate, day));

    return [
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
  };

  const handleEventClick = (event: CalendarEvent, day: Date) => {
    if (event.type === "activity") {
      const activity = filteredActivities.find((a) => a.id === event.id);
      if (activity) onEditActivity(activity);
    } else if (event.type === "task" && onEditTask) {
      onEditTask(event.id);
    } else if (event.type === "habit" && onEditHabit) {
      onEditHabit(event.id);
    }
  };

  const handleToggleComplete = (id: string, events: CalendarEvent[]) => {
    const event = events.find((e) => e.id === id);
    if (!event) return;
    if (event.type === "task" && onToggleTaskComplete) {
      onToggleTaskComplete(id);
    } else if (event.type === "habit" && onToggleHabitComplete) {
      onToggleHabitComplete(id);
    }
  };

  return (
    <div className="grid grid-cols-[3.5rem,1fr,1fr] min-h-[1728px]">
      <WeekTimeColumn hours={hours} formatHour={formatHour} />
      {days.map((day, dayIndex) => {
        const events = getEventsForDay(day);

        return (
          <div
            key={day.toISOString()}
            ref={(el) => (containerRefs.current[dayIndex] = el)}
            className="relative border-l border-slate-700/50"
            onMouseDown={(e) => handleMouseDown(e, dayIndex)}
            onMouseMove={(e) => handleMouseMove(e, dayIndex)}
            onMouseUp={() => handleMouseUp(dayIndex)}
            onMouseLeave={() => handleMouseUp(dayIndex)}
          >
            {/* Day Header */}
            <div
              className={`sticky top-0 z-10 p-3 text-center border-b border-slate-700/50 ${
                isToday(day) ? "bg-primary/20" : "bg-slate-900/90"
              }`}
            >
              <div className="text-xs text-slate-400 uppercase">{format(day, "EEE")}</div>
              <div className={`text-lg font-bold ${isToday(day) ? "text-primary" : "text-white"}`}>
                {format(day, "d")}
              </div>
            </div>

            {/* Hour grid */}
            {hours.map((hour) => (
              <div key={hour} className="border-b border-white/5 h-[72px] relative">
                <div className="absolute top-1/2 w-full border-t border-dashed border-white/5" />
              </div>
            ))}

            {isToday(day) && <CurrentTimeIndicator getCurrentTimePosition={getCurrentTimePosition} />}

            {/* Drag preview */}
            {dragData && dragData.dayIndex === dayIndex && (
              <div
                className="absolute bg-primary/30 border-2 border-primary rounded-lg z-20 pointer-events-none flex items-center justify-center"
                style={{
                  top: `${Math.min(dragData.startY, dragData.currentY) + 60}px`,
                  height: `${Math.max(18, Math.abs(dragData.currentY - dragData.startY))}px`,
                  left: "2px",
                  right: "2px",
                }}
              >
                <span className="text-[10px] font-semibold text-primary-foreground bg-primary px-1.5 py-0.5 rounded-full shadow-lg">
                  {calculateDurationPreview()}
                </span>
              </div>
            )}

            {/* Events */}
            <div className="absolute inset-0 top-[60px] pointer-events-none">
              {events.map((event) => (
                <div key={`${event.type}-${event.id}`} className="pointer-events-auto">
                  <CalendarEventBlock
                    event={event}
                    style={getEventStyle(event.startTime, event.endTime)}
                    onClick={() => handleEventClick(event, day)}
                    onToggleComplete={(id) => handleToggleComplete(id, events)}
                    isWeekView={true}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TwoDayCalendarView;
