
import React from "react";
import { isSameDay } from "date-fns";
import ActivityBlock from "./ActivityBlock";
import CurrentTimeIndicator from "./CurrentTimeIndicator";

interface WeekDayColumnProps {
  day: Date;
  dayIndex: number;
  hours: number[];
  activities: TimeActivity[];
  getActivityStyle: (activity: TimeActivity) => {
    top: string;
    height: string;
    className: string;
  };
  getCurrentTimePosition: () => number;
  onEditActivity: (activity: TimeActivity) => void;
}

const WeekDayColumn: React.FC<WeekDayColumnProps> = ({
  day,
  dayIndex,
  hours,
  activities,
  getActivityStyle,
  getCurrentTimePosition,
  onEditActivity
}) => {
  const dayActivities = activities.filter(activity => isSameDay(activity.startDate, day));

  return (
    <div key={dayIndex} className="border-r border-slate-700 relative">
      {hours.map(hour => (
        <div key={hour} className="border-b border-slate-700 h-[72px] relative">
          <div className="border-t border-slate-700 h-[36px]"></div>
          <div className="border-t border-dashed h-[36px] border-slate-700"></div>
        </div>
      ))}
      
      {/* Current time indicator */}
      {isSameDay(day, new Date()) && (
        <div 
          className="absolute left-0 right-0 border-t-2 border-red-500 dark:border-red-400 z-10" 
          style={{
            top: `${getCurrentTimePosition()}px`,
            width: '100%'
          }}
        >
          <div className="absolute -left-1 -top-2 w-3 h-3 rounded-full bg-red-500 dark:bg-red-400"></div>
        </div>
      )}
      
      {/* Activities for this day */}
      <div className="absolute inset-0">
        {dayActivities.map(activity => (
          <ActivityBlock
            key={activity.id}
            activity={activity}
            style={getActivityStyle(activity)}
            onEditActivity={onEditActivity}
            isWeekView={true}
          />
        ))}
      </div>
    </div>
  );
};

export default WeekDayColumn;
