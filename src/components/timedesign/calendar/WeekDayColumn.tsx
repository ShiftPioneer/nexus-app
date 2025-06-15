
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
    <div key={dayIndex} className="border-r border-white/5 relative">
      {hours.map(hour => (
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
            width: '100%'
          }}
        >
          <div className="absolute -left-1.5 -top-2 w-3 h-3 rounded-full bg-primary animate-pulse border-2 border-slate-950"></div>
        </div>
      )}
      
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
