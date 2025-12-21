import React from "react";
import { format, isSameDay } from "date-fns";
import CurrentTimeIndicator from "./CurrentTimeIndicator";
import ActivityBlock from "./ActivityBlock";
import WeekTimeColumn from "./WeekTimeColumn";

interface TwoDayCalendarViewProps {
  days: Date[];
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
  onMouseDown: (e: React.MouseEvent, date: Date, hour: number) => void;
  onMouseUp: (e: React.MouseEvent, date: Date, hour: number) => void;
  isDragging: boolean;
}

const TwoDayCalendarView: React.FC<TwoDayCalendarViewProps> = ({
  days,
  hours,
  formatHour,
  getCurrentTimePosition,
  filteredActivities,
  getActivityStyle,
  onEditActivity,
}) => {
  const isToday = (date: Date) => isSameDay(date, new Date());

  return (
    <div className="grid grid-cols-[3.5rem,1fr,1fr] min-h-[1728px]">
      <WeekTimeColumn hours={hours} formatHour={formatHour} />
      {days.map((day) => {
        const dayActivities = filteredActivities.filter(a => isSameDay(a.startDate, day));
        return (
          <div key={day.toISOString()} className="relative border-l border-slate-700/50">
            {/* Day Header */}
            <div className={`sticky top-0 z-10 p-3 text-center border-b border-slate-700/50 ${isToday(day) ? 'bg-primary/20' : 'bg-slate-900/90'}`}>
              <div className="text-xs text-slate-400 uppercase">{format(day, 'EEE')}</div>
              <div className={`text-lg font-bold ${isToday(day) ? 'text-primary' : 'text-white'}`}>
                {format(day, 'd')}
              </div>
            </div>
            
            {/* Hour grid */}
            {hours.map((hour) => (
              <div key={hour} className="border-b border-white/5 h-[72px] relative">
                <div className="absolute top-1/2 w-full border-t border-dashed border-white/5" />
              </div>
            ))}
            
            {isToday(day) && <CurrentTimeIndicator getCurrentTimePosition={getCurrentTimePosition} />}
            
            <div className="absolute inset-0 top-[60px]">
              {dayActivities.map((activity) => (
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
      })}
    </div>
  );
};

export default TwoDayCalendarView;