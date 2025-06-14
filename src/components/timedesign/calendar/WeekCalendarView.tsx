
import React from "react";
import WeekHeader from "./WeekHeader";
import WeekTimeColumn from "./WeekTimeColumn";
import WeekDayColumn from "./WeekDayColumn";

interface WeekCalendarViewProps {
  weekDays: Date[];
  hours: number[];
  formatHour: (hour: number) => string;
  getCurrentTimePosition: () => number;
  filteredActivities: TimeActivity[];
  getActivityStyle: (activity: TimeActivity) => {
    top: string;
    height: string;
    className: string;
  };
  onEditActivity: (activity: TimeActivity) => void;
}

const WeekCalendarView: React.FC<WeekCalendarViewProps> = ({
  weekDays,
  hours,
  formatHour,
  getCurrentTimePosition,
  filteredActivities,
  getActivityStyle,
  onEditActivity
}) => {
  return (
    <div className="min-h-[1728px] overflow-x-auto">
      <WeekHeader weekDays={weekDays} />
      
      <div className="grid grid-cols-8 relative">
        <WeekTimeColumn hours={hours} formatHour={formatHour} />
        
        {weekDays.map((day, dayIndex) => (
          <WeekDayColumn
            key={dayIndex}
            day={day}
            dayIndex={dayIndex}
            hours={hours}
            activities={filteredActivities}
            getActivityStyle={getActivityStyle}
            getCurrentTimePosition={getCurrentTimePosition}
            onEditActivity={onEditActivity}
          />
        ))}
      </div>
    </div>
  );
};

export default WeekCalendarView;
