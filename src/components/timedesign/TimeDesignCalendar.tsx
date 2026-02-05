import React, { useState } from "react";
import { format, startOfWeek, addDays, startOfDay, endOfDay, isSameDay, isWithinInterval, startOfMonth, endOfMonth } from "date-fns";
import { Button } from "@/components/ui/button";
import { UnifiedActionButton } from "@/components/ui/unified-action-button";
import { Plus, Calendar as CalendarIcon, ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DayCalendarView from "./calendar/DayCalendarView";
import WeekCalendarView from "./calendar/WeekCalendarView";
import MonthCalendarView from "./calendar/MonthCalendarView";
import TwoDayCalendarView from "./calendar/TwoDayCalendarView";

type ViewType = "day" | "two-day" | "week" | "month";

interface TimeDesignCalendarProps {
  currentDate: Date;
  viewType: ViewType;
  onViewTypeChange: (viewType: ViewType) => void;
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
}

const TimeDesignCalendar: React.FC<TimeDesignCalendarProps> = ({
  currentDate,
  viewType,
  onViewTypeChange,
  activities,
  scheduledTasks = [],
  scheduledHabits = [],
  onEditActivity,
  onEditTask,
  onEditHabit,
  onToggleTaskComplete,
  onToggleHabitComplete,
  onCreateActivity,
}) => {
  const [currentViewDate, setCurrentViewDate] = useState(currentDate);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const weekStart = startOfWeek(currentViewDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const twoDays = [currentViewDate, addDays(currentViewDate, 1)];

  const filteredActivities = activities.filter((activity) => {
    if (viewType === "day") {
      return isSameDay(activity.startDate, currentViewDate);
    } else if (viewType === "two-day") {
      return twoDays.some((day) => isSameDay(activity.startDate, day));
    } else if (viewType === "week") {
      const activityDate = activity.startDate;
      return isWithinInterval(activityDate, {
        start: startOfDay(weekStart),
        end: endOfDay(addDays(weekStart, 6)),
      });
    } else {
      const monthStart = startOfMonth(currentViewDate);
      const monthEnd = endOfMonth(currentViewDate);
      return isWithinInterval(activity.startDate, {
        start: monthStart,
        end: monthEnd,
      });
    }
  });

  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  };

  const getCurrentTimePosition = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return (hours * 60 + minutes) * 1.2;
  };

  const handleCreateActivity = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const nextHour = currentHour + 1;

    onCreateActivity({
      startDate: currentViewDate,
      endDate: currentViewDate,
      startTime: `${currentHour.toString().padStart(2, "0")}:00`,
      endTime: `${nextHour.toString().padStart(2, "0")}:00`,
    });
  };

  const navigateDate = (direction: "prev" | "next") => {
    const amount = direction === "next" ? 1 : -1;
    switch (viewType) {
      case "day":
        setCurrentViewDate((prev) => addDays(prev, amount));
        break;
      case "two-day":
        setCurrentViewDate((prev) => addDays(prev, amount * 2));
        break;
      case "week":
        setCurrentViewDate((prev) => addDays(prev, amount * 7));
        break;
      case "month":
        setCurrentViewDate((prev) => {
          const newDate = new Date(prev);
          newDate.setMonth(newDate.getMonth() + amount);
          return newDate;
        });
        break;
    }
  };

  const getDateRangeLabel = () => {
    switch (viewType) {
      case "day":
        return format(currentViewDate, "EEEE, MMMM d, yyyy");
      case "two-day":
        return `${format(currentViewDate, "MMM d")} - ${format(addDays(currentViewDate, 1), "MMM d, yyyy")}`;
      case "week":
        return `${format(weekStart, "MMM d")} - ${format(addDays(weekStart, 6), "MMM d, yyyy")}`;
      case "month":
        return format(currentViewDate, "MMMM yyyy");
    }
  };

  const viewOptions = [
    { value: "day", label: "Day" },
    { value: "two-day", label: "2 Days" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
  ];

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-slate-950/50 rounded-2xl p-6 border border-slate-700/50">
        <div className="flex flex-wrap items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateDate("prev")}
            className="border-slate-600 hover:bg-slate-800 text-slate-300"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-3">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <h3 className="text-lg lg:text-xl font-bold text-white">{getDateRangeLabel()}</h3>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateDate("next")}
            className="border-slate-600 hover:bg-slate-800 text-slate-300"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4 text-slate-400" />
            <Select value={viewType} onValueChange={(val) => onViewTypeChange(val as ViewType)}>
              <SelectTrigger className="w-32 bg-slate-900 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                {viewOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-white hover:bg-slate-800">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <UnifiedActionButton onClick={handleCreateActivity} icon={Plus} variant="primary">
            Add Activity
          </UnifiedActionButton>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
        {viewType === "day" && (
          <DayCalendarView
            hours={hours}
            formatHour={formatHour}
            getCurrentTimePosition={getCurrentTimePosition}
            filteredActivities={filteredActivities}
            scheduledTasks={scheduledTasks}
            scheduledHabits={scheduledHabits}
            onEditActivity={onEditActivity}
            onEditTask={onEditTask}
            onEditHabit={onEditHabit}
            onToggleTaskComplete={onToggleTaskComplete}
            onToggleHabitComplete={onToggleHabitComplete}
            onCreateActivity={onCreateActivity}
            currentViewDate={currentViewDate}
          />
        )}
        {viewType === "two-day" && (
          <TwoDayCalendarView
            days={twoDays}
            hours={hours}
            formatHour={formatHour}
            getCurrentTimePosition={getCurrentTimePosition}
            filteredActivities={filteredActivities}
            scheduledTasks={scheduledTasks}
            scheduledHabits={scheduledHabits}
            onEditActivity={onEditActivity}
            onEditTask={onEditTask}
            onEditHabit={onEditHabit}
            onToggleTaskComplete={onToggleTaskComplete}
            onToggleHabitComplete={onToggleHabitComplete}
            onCreateActivity={onCreateActivity}
          />
        )}
        {viewType === "week" && (
          <WeekCalendarView
            weekDays={weekDays}
            hours={hours}
            formatHour={formatHour}
            getCurrentTimePosition={getCurrentTimePosition}
            filteredActivities={filteredActivities}
            scheduledTasks={scheduledTasks}
            scheduledHabits={scheduledHabits}
            onEditActivity={onEditActivity}
            onEditTask={onEditTask}
            onEditHabit={onEditHabit}
            onToggleTaskComplete={onToggleTaskComplete}
            onToggleHabitComplete={onToggleHabitComplete}
            onCreateActivity={onCreateActivity}
          />
        )}
        {viewType === "month" && (
          <MonthCalendarView
            currentDate={currentViewDate}
            activities={filteredActivities}
            onEditActivity={onEditActivity}
            onCreateActivity={onCreateActivity}
          />
        )}
      </div>
    </div>
  );
};

export default TimeDesignCalendar;
