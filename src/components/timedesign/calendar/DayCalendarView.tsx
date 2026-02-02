
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
  currentViewDate: Date;
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
  isDragging = false,
  currentViewDate
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragData, setDragData] = useState<{ startY: number; currentY: number } | null>(null);

  // 1.2 pixels per minute (72px per hour / 60 minutes = 1.2)
  const PIXELS_PER_MINUTE = 1.2;
  const MIN_DURATION_MINUTES = 15;

  const pixelsToTime = (pixels: number) => {
    const totalMinutes = Math.max(0, pixels / PIXELS_PER_MINUTE);
    const hour = Math.floor(totalMinutes / 60);
    const minute = Math.round((totalMinutes % 60) / 15) * 15; // Snap to 15-min increments
    const normalizedHour = Math.min(23, Math.max(0, hour));
    const normalizedMinute = minute >= 60 ? 45 : minute;
    return `${String(normalizedHour).padStart(2, "0")}:${String(normalizedMinute).padStart(2, "0")}`;
  };

  const calculateDurationPreview = () => {
    if (!dragData) return null;
    const startPx = Math.min(dragData.startY, dragData.currentY);
    const endPx = Math.max(dragData.startY, dragData.currentY);
    const durationMinutes = Math.max(MIN_DURATION_MINUTES, (endPx - startPx) / PIXELS_PER_MINUTE);
    const hours = Math.floor(durationMinutes / 60);
    const minutes = Math.round(durationMinutes % 60);
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
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
      const currentY = Math.max(0, e.clientY - rect.top);
      setDragData({ ...dragData, currentY });
    }
  };

  const handleMouseUp = () => {
    if (dragData) {
      const dragDistance = Math.abs(dragData.startY - dragData.currentY);
      // Only create if minimum drag distance (equivalent to ~15 minutes)
      if (dragDistance >= MIN_DURATION_MINUTES * PIXELS_PER_MINUTE) {
        const startPx = Math.min(dragData.startY, dragData.currentY);
        const endPx = Math.max(dragData.startY, dragData.currentY);
        
        const startTime = pixelsToTime(startPx);
        const endTime = pixelsToTime(endPx);

        // Use currentViewDate instead of today
        const activityDate = currentViewDate;

        if (startTime !== endTime) {
          onCreateActivity({
            startDate: activityDate,
            endDate: activityDate,
            startTime,
            endTime
          });
        }
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
            className="absolute w-full bg-primary/30 border-2 border-primary rounded-lg z-20 pointer-events-none flex items-center justify-center"
            style={{
              top: `${Math.min(dragData.startY, dragData.currentY)}px`,
              height: `${Math.max(18, Math.abs(dragData.currentY - dragData.startY))}px`,
            }}
          >
            <span className="text-xs font-semibold text-primary-foreground bg-primary px-2 py-0.5 rounded-full shadow-lg">
              {calculateDurationPreview()}
            </span>
          </div>
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
