
import React from "react";

interface CalendarHourProps {
  hour: number;
  formatHour: (hour: number) => string;
}

const CalendarHour: React.FC<CalendarHourProps> = ({ hour, formatHour }) => {
  return (
    <div className="grid grid-cols-1 border-b border-white/5 min-h-[72px]">
      <div className="relative">
        <span className="absolute -top-3 -left-16 text-sm font-mono text-slate-500 w-14 text-right pr-2">
          {formatHour(hour)}
        </span>
        <div className="relative h-full">
          {/* half-hour line */}
          <div className="absolute top-1/2 w-full border-t border-dashed border-white/5"></div>
        </div>
      </div>
    </div>
  );
};

export default CalendarHour;
