
import React, { useState } from "react";
import { format, startOfWeek, addDays, startOfDay, endOfDay, isSameDay, isWithinInterval } from "date-fns";
import { Button } from "@/components/ui/button";
import { UnifiedActionButton } from "@/components/ui/unified-action-button";
import { Plus, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import DayCalendarView from "./calendar/DayCalendarView";
import WeekCalendarView from "./calendar/WeekCalendarView";

interface TimeDesignCalendarProps {
  currentDate: Date;
  viewType: "day" | "week";
  activities: TimeActivity[];
  onEditActivity: (activity: TimeActivity) => void;
  onCreateActivity: (data: { startDate: Date; endDate: Date; startTime: string; endTime: string; }) => void;
}

const TimeDesignCalendar: React.FC<TimeDesignCalendarProps> = ({
  currentDate,
  viewType,
  activities,
  onEditActivity,
  onCreateActivity
}) => {
  const [currentViewDate, setCurrentViewDate] = useState(currentDate);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; time: string; date: Date } | null>(null);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const weekStart = startOfWeek(currentViewDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getActivityStyle = (activity: TimeActivity) => {
    const startParts = activity.startTime.split(":");
    const endParts = activity.endTime.split(":");
    const startHour = parseInt(startParts[0], 10);
    const startMinute = parseInt(startParts[1], 10);
    const endHour = parseInt(endParts[0], 10);
    const endMinute = parseInt(endParts[1], 10);

    const startPosition = (startHour * 60 + startMinute) * 1.2;
    const endPosition = (endHour * 60 + endMinute) * 1.2;
    const height = endPosition - startPosition;

    // Use the activity's selected color instead of category-based colors
    const colorMap: Record<string, string> = {
      purple: "bg-gradient-to-br from-purple-500 to-purple-700 text-white",
      blue: "bg-gradient-to-br from-blue-500 to-blue-700 text-white",
      green: "bg-gradient-to-br from-green-500 to-green-700 text-white",
      orange: "bg-gradient-to-br from-orange-500 to-orange-700 text-white",
      red: "bg-gradient-to-br from-red-500 to-red-700 text-white",
      indigo: "bg-gradient-to-br from-indigo-500 to-indigo-700 text-white",
      cyan: "bg-gradient-to-br from-cyan-500 to-cyan-700 text-white",
      yellow: "bg-gradient-to-br from-yellow-500 to-yellow-700 text-white",
    };
    
    const activityStyle = colorMap[activity.color] || colorMap.purple;

    return {
      top: `${startPosition}px`,
      height: `${height}px`,
      className: `absolute w-full ${activityStyle} p-2 rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-primary/20 transition-all duration-200 ring-1 ring-inset ring-white/10 hover:ring-white/20`
    };
  };

  const filteredActivities = activities.filter(activity => {
    if (viewType === "day") {
      return isSameDay(activity.startDate, currentViewDate);
    } else {
      const activityDate = activity.startDate;
      return isWithinInterval(activityDate, {
        start: startOfDay(weekStart),
        end: endOfDay(addDays(weekStart, 6))
      });
    }
  });

  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  };

  const getCurrentTimePosition = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return (hours * 60 + minutes) * 1.2;
  };

  const handleMouseDown = (e: React.MouseEvent, date: Date, hour: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const minutes = Math.round((y / 72) * 60); // 72px per hour
    const actualMinutes = Math.min(59, Math.max(0, minutes));
    const timeString = `${hour.toString().padStart(2, '0')}:${actualMinutes.toString().padStart(2, '0')}`;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      time: timeString,
      date: date
    });
  };

  const handleMouseUp = (e: React.MouseEvent, date: Date, hour: number) => {
    if (!isDragging || !dragStart) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const minutes = Math.round((y / 72) * 60);
    const actualMinutes = Math.min(59, Math.max(0, minutes));
    const endTimeString = `${hour.toString().padStart(2, '0')}:${actualMinutes.toString().padStart(2, '0')}`;
    
    // Ensure end time is after start time
    const startTime = dragStart.time;
    const endTime = endTimeString > startTime ? endTimeString : 
      `${(hour + 1).toString().padStart(2, '0')}:00`;
    
    onCreateActivity({
      startDate: dragStart.date,
      endDate: date,
      startTime: startTime,
      endTime: endTime
    });
    
    setIsDragging(false);
    setDragStart(null);
  };

  const handleCreateActivity = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const nextHour = currentHour + 1;
    
    onCreateActivity({
      startDate: currentViewDate,
      endDate: currentViewDate,
      startTime: `${currentHour.toString().padStart(2, '0')}:00`,
      endTime: `${nextHour.toString().padStart(2, '0')}:00`
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    if (viewType === 'day') {
      setCurrentViewDate(prev => addDays(prev, direction === 'next' ? 1 : -1));
    } else {
      setCurrentViewDate(prev => addDays(prev, direction === 'next' ? 7 : -7));
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header with Navigation and Add Activity Button */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-slate-950/50 rounded-2xl p-6 border border-slate-700/50">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateDate('prev')}
            className="border-slate-600 hover:bg-slate-800 text-slate-300"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold text-white">
              {viewType === 'day' 
                ? format(currentViewDate, 'EEEE, MMMM d, yyyy')
                : `${format(weekStart, 'MMM d')} - ${format(addDays(weekStart, 6), 'MMM d, yyyy')}`
              }
            </h3>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateDate('next')}
            className="border-slate-600 hover:bg-slate-800 text-slate-300"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <UnifiedActionButton
          onClick={handleCreateActivity}
          icon={Plus}
          variant="primary"
        >
          Add Activity
        </UnifiedActionButton>
      </div>

      {/* Calendar View */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
        {viewType === "day" ? (
          <DayCalendarView
            hours={hours}
            formatHour={formatHour}
            getCurrentTimePosition={getCurrentTimePosition}
            filteredActivities={filteredActivities}
            getActivityStyle={getActivityStyle}
            onEditActivity={onEditActivity}
            onCreateActivity={onCreateActivity}
            onMouseDown={(e, hour) => handleMouseDown(e, currentViewDate, hour)}
            onMouseUp={(e, hour) => handleMouseUp(e, currentViewDate, hour)}
            isDragging={isDragging}
          />
        ) : (
          <WeekCalendarView
            weekDays={weekDays}
            hours={hours}
            formatHour={formatHour}
            getCurrentTimePosition={getCurrentTimePosition}
            filteredActivities={filteredActivities}
            getActivityStyle={getActivityStyle}
            onEditActivity={onEditActivity}
            onCreateActivity={onCreateActivity}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            isDragging={isDragging}
          />
        )}
      </div>
    </div>
  );
};

export default TimeDesignCalendar;
