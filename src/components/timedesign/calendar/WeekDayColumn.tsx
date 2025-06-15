import React, { useRef, useState, MouseEvent } from "react";
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
  onCreateActivity: (data: { startDate: Date; endDate: Date; startTime: string; endTime: string; }) => void;
}

const WeekDayColumn: React.FC<WeekDayColumnProps> = ({
  day,
  dayIndex,
  hours,
  activities,
  getActivityStyle,
  getCurrentTimePosition,
  onEditActivity,
  onCreateActivity
}) => {
  const dayActivities = activities.filter(activity => isSameDay(activity.startDate, day));
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragData, setDragData] = useState<{ startY: number; currentY: number } | null>(null);

  const pixelsToTime = (pixels: number) => {
    const totalMinutes = pixels / 1.2;
    const hour = Math.floor(totalMinutes / 60);
    const minute = Math.round((totalMinutes % 60) / 15) * 15;
    const normalizedHour = hour > 23 ? 23 : hour;
    const normalizedMinute = minute >= 60 ? 45 : minute;
    return `${String(normalizedHour).padStart(2, "0")}:${String(normalizedMinute).padStart(2, "0")}`;
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const startY = e.clientY - rect.top;
    setDragData({ startY, currentY: startY });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (dragData) {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const currentY = e.clientY - rect.top;
      setDragData({ ...dragData, currentY });
    }
  };

  const handleMouseUp = () => {
    if (dragData && Math.abs(dragData.startY - dragData.currentY) > 10) { // minimum drag distance
      const start = Math.min(dragData.startY, dragData.currentY);
      const end = Math.max(dragData.startY, dragData.currentY);
      
      const startTime = pixelsToTime(start);
      const endTime = pixelsToTime(end);

      if (startTime !== endTime) {
        onCreateActivity({
            startDate: day,
            endDate: day,
            startTime,
            endTime
        });
      }
    }
    setDragData(null);
  };

  return (
    <div 
      key={dayIndex} 
      className="border-r border-white/5 relative"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
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
      
      {dragData && (
        <div
          className="absolute w-full bg-primary/30 border-2 border-primary rounded-lg z-20 pointer-events-none"
          style={{
            top: `${Math.min(dragData.startY, dragData.currentY)}px`,
            height: `${Math.abs(dragData.currentY - dragData.startY)}px`,
            left: "0",
            right: "0"
          }}
        />
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
