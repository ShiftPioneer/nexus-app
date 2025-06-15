import React from "react";
import { format, startOfWeek, addDays, startOfDay, endOfDay, isSameDay, isWithinInterval } from "date-fns";
import DayCalendarView from "./calendar/DayCalendarView";
import WeekCalendarView from "./calendar/WeekCalendarView";

interface TimeDesignCalendarProps {
  currentDate: Date;
  viewType: "day" | "week";
  activities: TimeActivity[];
  onEditActivity: (activity: TimeActivity) => void;
  onCreateActivity: (data: { startDate: Date; endDate: Date; startTime: string; endTime: string; }) => void;
}

const TimeDesignCalendar: React.FC<TimeDesignCalendarProps> = ({
  currentDate,
  viewType,
  activities,
  onEditActivity,
  onCreateActivity
}) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getActivityStyle = (activity: TimeActivity) => {
    const startParts = activity.startTime.split(":");
    const endParts = activity.endTime.split(":");
    const startHour = parseInt(startParts[0], 10);
    const startMinute = parseInt(startParts[1], 10);
    const endHour = parseInt(endParts[0], 10);
    const endMinute = parseInt(endParts[1], 10);

    const startPosition = (startHour * 60 + startMinute) * 1.2;
    const endPosition = (endHour * 60 + endMinute) * 1.2;
    const height = endPosition - startPosition;

    const styleMap: Record<string, string> = {
      work: "bg-gradient-to-br from-purple-600 to-indigo-700 text-white",
      social: "bg-gradient-to-br from-orange-500 to-red-600 text-white",
      health: "bg-gradient-to-br from-green-500 to-teal-600 text-white",
      learning: "bg-gradient-to-br from-blue-500 to-cyan-600 text-white",
      default: "bg-gradient-to-br from-slate-600 to-slate-700 text-white",
    };
    const categoryStyle = styleMap[activity.category] || styleMap.default;

    return {
      top: `${startPosition}px`,
      height: `${height}px`,
      className: `absolute w-full ${categoryStyle} p-2 rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-primary/20 transition-all duration-200 ring-1 ring-inset ring-white/10 hover:ring-white/20`
    };
  };

  const filteredActivities = activities.filter(activity => {
    if (viewType === "day") {
      return isSameDay(activity.startDate, currentDate);
    } else {
      const activityDate = activity.startDate;
      return isWithinInterval(activityDate, {
        start: startOfDay(weekStart),
        end: endOfDay(addDays(weekStart, 6))
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

  return (
    <div className="bg-slate-950 rounded-lg border border-slate-800 shadow-lg overflow-auto">
        {viewType === "day" ? (
          <DayCalendarView
            hours={hours}
            formatHour={formatHour}
            getCurrentTimePosition={getCurrentTimePosition}
            filteredActivities={filteredActivities}
            getActivityStyle={getActivityStyle}
            onEditActivity={onEditActivity}
            onCreateActivity={onCreateActivity}
          />
        ) : (
          <WeekCalendarView
            weekDays={weekDays}
            hours={hours}
            formatHour={formatHour}
            getCurrentTimePosition={getCurrentTimePosition}
            filteredActivities={filteredActivities}
            getActivityStyle={getActivityStyle}
            onEditActivity={onEditActivity}
            onCreateActivity={onCreateActivity}
          />
        )}
    </div>
  );
};

export default TimeDesignCalendar;
