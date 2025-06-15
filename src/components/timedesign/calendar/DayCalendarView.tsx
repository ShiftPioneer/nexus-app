
import React from "react";
import CurrentTimeIndicator from "./CurrentTimeIndicator";
import ActivityBlock from "./ActivityBlock";
import WeekTimeColumn from "./WeekTimeColumn";

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
  onEditActivity,
}) => {
  return (
    <div className="grid grid-cols-[3.5rem,1fr] min-h-[1728px]">
      <WeekTimeColumn hours={hours} formatHour={formatHour} />
      <div className="relative">
        {/* The background grid lines for the day */}
        {hours.map((hour) => (
          <div key={hour} className="border-b border-white/5 h-[72px] relative">
            <div className="absolute top-1/2 w-full border-t border-dashed border-white/5"></div>
          </div>
        ))}

        {/* Current time indicator */}
        <CurrentTimeIndicator getCurrentTimePosition={getCurrentTimePosition} />

        {/* Activities for the day */}
        <div className="absolute inset-0">
          {filteredActivities.map((activity) => (
            <ActivityBlock
              key={activity.id}
              activity={activity}
              style={getActivityStyle(activity)}
              onEditActivity={onEditActivity}
              isWeekView={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayCalendarView;
