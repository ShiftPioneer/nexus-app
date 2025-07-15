
import React, { useRef, useState, MouseEvent } from "react";
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
  onCreateActivity: (data: { startDate: Date; endDate: Date; startTime: string; endTime: string; }) => void;
  onMouseDown?: (e: React.MouseEvent, hour: number) => void;
  onMouseUp?: (e: React.MouseEvent, hour: number) => void;
  isDragging?: boolean;
}

const DayCalendarView: React.FC<DayCalendarViewProps> = ({
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
    if (dragData && Math.abs(dragData.startY - dragData.currentY) > 10) {
      const start = Math.min(dragData.startY, dragData.currentY);
      const end = Math.max(dragData.startY, dragData.currentY);
      
      const startTime = pixelsToTime(start);
      const endTime = pixelsToTime(end);

      const today = new Date();

      if (startTime !== endTime) {
        onCreateActivity({
            startDate: today,
            endDate: today,
            startTime,
            endTime
        });
      }
    }
    setDragData(null);
  };

  return (
    <div className="grid grid-cols-[3.5rem,1fr] min-h-[1728px]" onMouseUp={handleMouseUp}>
      <WeekTimeColumn hours={hours} formatHour={formatHour} />
      <div 
        className="relative" 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
      >
        {/* The background grid lines for the day */}
        {hours.map((hour) => (
          <div key={hour} className="border-b border-white/5 h-[72px] relative">
            <div className="absolute top-1/2 w-full border-t border-dashed border-white/5"></div>
          </div>
        ))}

        {dragData && (
          <div
            className="absolute w-full bg-primary/30 border-2 border-primary rounded-lg z-20 pointer-events-none"
            style={{
              top: `${Math.min(dragData.startY, dragData.currentY)}px`,
              height: `${Math.abs(dragData.currentY - dragData.startY)}px`,
            }}
          />
        )}

        <CurrentTimeIndicator getCurrentTimePosition={getCurrentTimePosition} />

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
