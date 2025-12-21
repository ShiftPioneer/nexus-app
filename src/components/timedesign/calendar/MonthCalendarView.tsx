import React from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isSameMonth } from "date-fns";

interface MonthCalendarViewProps {
  currentDate: Date;
  activities: TimeActivity[];
  onEditActivity: (activity: TimeActivity) => void;
  onCreateActivity: (data: { startDate: Date; endDate: Date; startTime: string; endTime: string; }) => void;
}

const MonthCalendarView: React.FC<MonthCalendarViewProps> = ({
  currentDate,
  activities,
  onEditActivity,
  onCreateActivity
}) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);
  const blanks = Array.from({ length: startDay }, (_, i) => i);
  const today = new Date();

  const getActivitiesForDay = (date: Date) => {
    return activities.filter(activity => isSameDay(activity.startDate, date));
  };

  const handleDayClick = (date: Date) => {
    const now = new Date();
    const currentHour = now.getHours();
    onCreateActivity({
      startDate: date,
      endDate: date,
      startTime: `${currentHour.toString().padStart(2, '0')}:00`,
      endTime: `${(currentHour + 1).toString().padStart(2, '0')}:00`
    });
  };

  const colorMap: Record<string, string> = {
    purple: "bg-purple-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    orange: "bg-orange-500",
    red: "bg-red-500",
    indigo: "bg-indigo-500",
    cyan: "bg-cyan-500",
    yellow: "bg-yellow-500",
  };

  return (
    <div className="p-4">
      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 mb-2 text-sm text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-2 text-slate-400 font-medium">{day}</div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {blanks.map((_, index) => (
          <div key={`blank-${index}`} className="aspect-square bg-slate-900/30 rounded-lg" />
        ))}
        
        {monthDays.map((day) => {
          const dayActivities = getActivitiesForDay(day);
          const isCurrentDay = isSameDay(day, today);
          
          return (
            <div
              key={day.toISOString()}
              onClick={() => handleDayClick(day)}
              className={`aspect-square rounded-lg p-2 cursor-pointer transition-all hover:bg-slate-800 ${
                isCurrentDay 
                  ? 'bg-primary/20 border border-primary' 
                  : 'bg-slate-900/50 border border-slate-700/30'
              }`}
            >
              <div className={`text-right text-sm font-medium mb-1 ${isCurrentDay ? 'text-primary' : 'text-white'}`}>
                {format(day, 'd')}
              </div>
              
              {dayActivities.length > 0 && (
                <div className="space-y-1 overflow-hidden">
                  {dayActivities.slice(0, 3).map((activity) => (
                    <div
                      key={activity.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditActivity(activity);
                      }}
                      className={`text-xs px-1 py-0.5 rounded truncate text-white ${colorMap[activity.color] || colorMap.purple}`}
                      title={`${activity.title} (${activity.startTime} - ${activity.endTime})`}
                    >
                      {activity.title}
                    </div>
                  ))}
                  {dayActivities.length > 3 && (
                    <div className="text-xs text-slate-400 text-center">
                      +{dayActivities.length - 3} more
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthCalendarView;