
import React from "react";
import CalendarHour from "./CalendarHour";
import CurrentTimeIndicator from "./CurrentTimeIndicator";
import ActivityBlock from "./ActivityBlock";

interface DayCalendarViewProps {
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

const DayCalendarView: React.FC<DayCalendarViewProps> = ({
  hours,
  formatHour,
  getCurrentTimePosition,
  filteredActivities,
  getActivityStyle,
  onEditActivity
}) => {
  return (
    <div className="relative min-h-[1728px] mx-12">
      {/* Hour lines */}
      {hours.map(hour => (
        <CalendarHour key={hour} hour={hour} formatHour={formatHour} />
      ))}
      
      {/* Current time indicator */}
      <CurrentTimeIndicator getCurrentTimePosition={getCurrentTimePosition} />
      
      {/* Activities for the day */}
      <div className="absolute inset-0">
        {filteredActivities.map(activity => (
          <ActivityBlock
            key={activity.id}
            activity={activity}
            style={getActivityStyle(activity)}
            onEditActivity={onEditActivity}
          />
        ))}
      </div>
    </div>
  );
};

export default DayCalendarView;
