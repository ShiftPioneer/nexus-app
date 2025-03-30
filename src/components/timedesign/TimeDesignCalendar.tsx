
import React from "react";
import {
  format,
  startOfWeek,
  addDays,
  startOfDay,
  endOfDay,
  isSameDay,
  isWithinInterval,
  parseISO,
} from "date-fns";

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
  onEditActivity,
}) => {
  // Generate hours for the day (6 AM to 8 PM)
  const hours = Array.from({ length: 15 }, (_, i) => i + 6);

  // Generate week days starting from Sunday for the current week
  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getActivityStyle = (activity: TimeActivity) => {
    // Calculate position based on start and end times
    const startParts = activity.startTime.split(":");
    const endParts = activity.endTime.split(":");
    
    const startHour = parseInt(startParts[0]);
    const startMinute = parseInt(startParts[1]);
    const endHour = parseInt(endParts[0]);
    const endMinute = parseInt(endParts[1]);
    
    // Calculate top position (start time)
    const startPosition = (startHour - 6) * 60 + startMinute;
    
    // Calculate height (duration)
    const endPosition = (endHour - 6) * 60 + endMinute;
    const height = endPosition - startPosition;
    
    // Get background color based on activity category
    const colorMap = {
      work: "bg-purple-100 border-l-4 border-purple-500",
      social: "bg-orange-100 border-l-4 border-orange-500",
      health: "bg-green-100 border-l-4 border-green-500",
      learning: "bg-blue-100 border-l-4 border-blue-500"
    };
    
    return {
      top: `${startPosition}px`,
      height: `${height}px`,
      className: `absolute w-full ${colorMap[activity.category]} p-1 overflow-hidden cursor-pointer`,
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
        end: endOfDay(addDays(weekStart, 6)),
      });
    }
  });

  const renderDayCalendar = () => {
    return (
      <div className="relative min-h-[900px]">
        {hours.map(hour => (
          <div key={hour} className="grid grid-cols-1 border-b h-[60px]">
            <div className="relative">
              <span className="absolute -top-3 -left-10 text-sm text-muted-foreground">
                {hour % 12 === 0 ? 12 : hour % 12}:00 {hour >= 12 ? "PM" : "AM"}
              </span>
              <div className="border-t h-[30px]"></div>
            </div>
          </div>
        ))}
        
        {/* Activities for the day */}
        <div className="absolute inset-0">
          {filteredActivities.map(activity => {
            const { top, height, className } = getActivityStyle(activity);
            return (
              <div
                key={activity.id}
                style={{ top, height: height }}
                className={className}
                onClick={() => onEditActivity(activity)}
              >
                <div className="text-xs font-medium">{activity.title}</div>
                <div className="text-xs">
                  {activity.startTime} - {activity.endTime}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekCalendar = () => {
    return (
      <div className="min-h-[900px]">
        <div className="grid grid-cols-7 border-b">
          {weekDays.map((day, i) => (
            <div 
              key={i} 
              className={`text-center py-2 font-medium ${
                isSameDay(day, new Date()) ? "text-blue-600" : ""
              }`}
            >
              <div>{format(day, "EEE")}</div>
              <div className={`text-lg ${
                isSameDay(day, new Date()) 
                  ? "bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mx-auto" 
                  : ""
              }`}>
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 relative">
          {weekDays.map((day, dayIndex) => (
            <div key={dayIndex} className="border-r">
              {hours.map(hour => (
                <div key={hour} className="border-b h-[60px] relative">
                  {dayIndex === 0 && (
                    <span className="absolute -top-3 -left-10 text-sm text-muted-foreground">
                      {hour % 12 === 0 ? 12 : hour % 12}:00 {hour >= 12 ? "PM" : "AM"}
                    </span>
                  )}
                  <div className="border-t h-[30px]"></div>
                </div>
              ))}
              
              {/* Activities for this day */}
              <div className="absolute inset-0">
                {filteredActivities
                  .filter(activity => isSameDay(activity.startDate, day))
                  .map(activity => {
                    const { top, height, className } = getActivityStyle(activity);
                    return (
                      <div
                        key={activity.id}
                        style={{ 
                          top, 
                          height,
                          width: `calc(100% - 8px)`,
                          left: "4px"
                        }}
                        className={className}
                        onClick={() => onEditActivity(activity)}
                      >
                        <div className="text-xs font-medium truncate">{activity.title}</div>
                        <div className="text-xs truncate">
                          {activity.startTime} - {activity.endTime}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 overflow-auto">
      {viewType === "day" ? renderDayCalendar() : renderWeekCalendar()}
    </div>
  );
};

export default TimeDesignCalendar;
