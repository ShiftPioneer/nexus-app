import React from "react";
import { format, startOfWeek, addDays, startOfDay, endOfDay, isSameDay, isWithinInterval, parseISO, addHours, getHours, setHours, setMinutes } from "date-fns";
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
  const hours = Array.from({
    length: 24
  }, (_, i) => i);

  // Generate week days starting from Sunday for the current week
  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({
    length: 7
  }, (_, i) => addDays(weekStart, i));
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
  const renderDayCalendar = () => {
    return <div className="relative min-h-[1728px] mx-12">
        {/* Hour lines */}
        {hours.map(hour => <div key={hour} className="grid grid-cols-1 border-b border-slate-700 min-h-[72px]">
            <div className="relative">
              <span className="absolute -top-3 -left-14 text-sm font-medium text-muted-foreground">
                {formatHour(hour)}
              </span>
              <div className="border-t border-slate-700 h-[36px]"></div>
              <div className="relative">
                <span className="absolute -left-14 -top-3 text-xs text-muted-foreground">
                  30
                </span>
                <div className="border-t border-dashed h-[36px] border-slate-700"></div>
              </div>
            </div>
          </div>)}
        
        {/* Current time indicator */}
        <div className="absolute left-0 right-0 border-t-2 border-red-500 dark:border-red-400 z-10" style={{
        top: `${getCurrentTimePosition()}px`,
        width: '100%'
      }}>
          <div className="absolute -left-3 -top-2 w-4 h-4 rounded-full bg-red-500 dark:bg-red-400"></div>
        </div>
        
        {/* Activities for the day */}
        <div className="absolute inset-0">
          {filteredActivities.map(activity => {
          const {
            top,
            height,
            className
          } = getActivityStyle(activity);
          return <div key={activity.id} style={{
            top,
            height
          }} className={className} onClick={() => onEditActivity(activity)}>
                <div className="text-sm font-medium line-clamp-1">{activity.title}</div>
                <div className="text-xs flex items-center justify-between">
                  <span>{activity.startTime} - {activity.endTime}</span>
                </div>
                {parseInt(height, 10) > 80 && activity.description && <div className="text-xs mt-1 line-clamp-2">{activity.description}</div>}
              </div>;
        })}
        </div>
      </div>;
  };
  const renderWeekCalendar = () => {
    return <div className="min-h-[1728px] overflow-x-auto">
        <div className="grid grid-cols-8 border-b border-slate-700 sticky top-0 bg-background z-10 my-[15px]">
          <div className="w-12"></div>
          {weekDays.map((day, i) => <div key={i} className={`text-center py-2 font-medium border-r border-slate-700 ${isSameDay(day, new Date()) ? "text-blue-600 dark:text-blue-400" : ""}`}>
              <div>{format(day, "EEE")}</div>
              <div className={`text-lg ${isSameDay(day, new Date()) ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 rounded-full w-8 h-8 flex items-center justify-center mx-auto" : ""}`}>
                {format(day, "d")}
              </div>
            </div>)}
        </div>
        
        <div className="grid grid-cols-8 relative">
          {/* Time labels column */}
          <div className="border-r border-slate-700">
            {hours.map(hour => <div key={hour} className="h-[72px] relative">
                <span className="absolute -top-3 w-full text-right pr-2 text-sm font-medium text-muted-foreground">
                  {formatHour(hour)}
                </span>
                <div className="border-t border-slate-700 h-[36px]"></div>
                <div className="relative">
                  <span className="absolute right-2 -top-3 text-xs text-muted-foreground">
                    30
                  </span>
                  <div className="border-t border-dashed h-[36px] border-slate-700"></div>
                </div>
              </div>)}
          </div>
          
          {/* Day columns */}
          {weekDays.map((day, dayIndex) => <div key={dayIndex} className="border-r border-slate-700 relative">
              {hours.map(hour => <div key={hour} className="border-b border-slate-700 h-[72px] relative">
                  <div className="border-t border-slate-700 h-[36px]"></div>
                  <div className="border-t border-dashed h-[36px] border-slate-700"></div>
                </div>)}
              
              {/* Current time indicator */}
              {isSameDay(day, new Date()) && <div className="absolute left-0 right-0 border-t-2 border-red-500 dark:border-red-400 z-10" style={{
            top: `${getCurrentTimePosition()}px`,
            width: '100%'
          }}>
                  <div className="absolute -left-1 -top-2 w-3 h-3 rounded-full bg-red-500 dark:bg-red-400"></div>
                </div>}
              
              {/* Activities for this day */}
              <div className="absolute inset-0">
                {filteredActivities.filter(activity => isSameDay(activity.startDate, day)).map(activity => {
              const {
                top,
                height,
                className
              } = getActivityStyle(activity);
              return <div key={activity.id} style={{
                top,
                height,
                width: `calc(100% - 8px)`,
                left: "4px"
              }} className={className} onClick={() => onEditActivity(activity)}>
                        <div className="text-sm font-medium truncate">{activity.title}</div>
                        <div className="text-xs truncate flex-nowrap">
                          {activity.startTime} - {activity.endTime}
                        </div>
                        {parseInt(height, 10) > 80 && activity.description && <div className="text-xs mt-1 line-clamp-1">{activity.description}</div>}
                      </div>;
            })}
              </div>
            </div>)}
        </div>
      </div>;
  };
  return <div className="p-4 overflow-auto">
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-700 shadow-sm p-2">
        {viewType === "day" ? renderDayCalendar() : renderWeekCalendar()}
      </div>
    </div>;
};
export default TimeDesignCalendar;
