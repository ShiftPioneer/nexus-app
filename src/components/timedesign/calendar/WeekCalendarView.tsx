
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
  onCreateActivity: (data: { startDate: Date; endDate: Date; startTime: string; endTime: string; }) => void;
  onMouseDown?: (e: React.MouseEvent, date: Date, hour: number) => void;
  onMouseUp?: (e: React.MouseEvent, date: Date, hour: number) => void;
  isDragging?: boolean;
}

const WeekCalendarView: React.FC<WeekCalendarViewProps> = ({
  weekDays,
  hours,
  formatHour,
  getCurrentTimePosition,
  filteredActivities,
  getActivityStyle,
  onEditActivity,
  onCreateActivity,
  onMouseDown,
  onMouseUp,
  isDragging = false
}) => {
  return (
    <div className="min-h-[1728px] overflow-x-auto">
      <WeekHeader weekDays={weekDays} />
      
      <div className="grid grid-cols-[3.5rem,repeat(7,1fr)] relative">
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
            onCreateActivity={onCreateActivity}
          />
        ))}
      </div>
    </div>
  );
};

export default WeekCalendarView;
