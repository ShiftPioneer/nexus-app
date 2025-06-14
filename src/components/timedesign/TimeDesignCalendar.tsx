
import React from "react";
import { format, startOfWeek, addDays, startOfDay, endOfDay, isSameDay, isWithinInterval } from "date-fns";
import DayCalendarView from "./calendar/DayCalendarView";
import WeekCalendarView from "./calendar/WeekCalendarView";

interface TimeDesignCalendarProps {
  currentDate: Date;
  viewType: "day" | "week";
  activities: TimeActivity[];
  onEditActivity: (activity: TimeActivity) => void;
}

const TimeDesignCalendar: React.FC<TimeDesignCalendarProps> = ({
  currentDate,
  viewType,
  activities,
  onEditActivity
}) => {
  // Generate hours for the day (12 AM to 11 PM - full 24 hours)
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Generate week days starting from Sunday for the current week
  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getActivityStyle = (activity: TimeActivity) => {
    // Calculate position based on start and end times
    const startParts = activity.startTime.split(":");
    const endParts = activity.endTime.split(":");
    const startHour = parseInt(startParts[0], 10);
    const startMinute = parseInt(startParts[1], 10);
    const endHour = parseInt(endParts[0], 10);
    const endMinute = parseInt(endParts[1], 10);

    // Calculate top position (start time)
    const startPosition = (startHour * 60 + startMinute) * 1.2; // Scale factor for better visibility

    // Calculate height (duration)
    const endPosition = (endHour * 60 + endMinute) * 1.2;
    const height = endPosition - startPosition;

    // Get background color based on activity category
    const colorMap: Record<string, string> = {
      work: "bg-purple-100 border-l-4 border-purple-500 text-purple-800 dark:bg-purple-900/30 dark:border-purple-600 dark:text-purple-300",
      social: "bg-orange-100 border-l-4 border-orange-500 text-orange-800 dark:bg-orange-900/30 dark:border-orange-600 dark:text-orange-300",
      health: "bg-green-100 border-l-4 border-green-500 text-green-800 dark:bg-green-900/30 dark:border-green-600 dark:text-green-300",
      learning: "bg-blue-100 border-l-4 border-blue-500 text-blue-800 dark:bg-blue-900/30 dark:border-blue-600 dark:text-blue-300"
    };

    return {
      top: `${startPosition}px`,
      height: `${height}px`,
      className: `absolute w-full ${colorMap[activity.category]} p-2 rounded-r-md shadow-sm overflow-hidden cursor-pointer hover:opacity-90 transition-opacity`
    };
  };

  // Filter activities for the current day or week
  const filteredActivities = activities.filter(activity => {
    if (viewType === "day") {
      return isSameDay(activity.startDate, currentDate);
    } else {
      // For week view, check if the activity is within the week
      const activityDate = activity.startDate;
      return isWithinInterval(activityDate, {
        start: startOfDay(weekStart),
        end: endOfDay(addDays(weekStart, 6))
      });
    }
  });

  // Format hour labels nicely
  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  };

  // Get current time indicators positions
  const getCurrentTimePosition = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return (hours * 60 + minutes) * 1.2; // Same scale factor as activities
  };

  return (
    <div className="p-4 overflow-auto">
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-700 shadow-sm p-2">
        {viewType === "day" ? (
          <DayCalendarView
            hours={hours}
            formatHour={formatHour}
            getCurrentTimePosition={getCurrentTimePosition}
            filteredActivities={filteredActivities}
            getActivityStyle={getActivityStyle}
            onEditActivity={onEditActivity}
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
          />
        )}
      </div>
    </div>
  );
};

export default TimeDesignCalendar;
