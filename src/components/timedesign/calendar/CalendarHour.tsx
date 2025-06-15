
import React from "react";

interface CalendarHourProps {
  hour: number;
  formatHour: (hour: number) => string;
}

const CalendarHour: React.FC<CalendarHourProps> = ({ hour, formatHour }) => {
  return (
    <div className="grid grid-cols-1 border-b border-slate-800 min-h-[72px]">
      <div className="relative">
        <span className="absolute -top-3 -left-14 text-sm font-medium text-slate-400">
          {formatHour(hour)}
        </span>
        <div className="border-t border-slate-800 h-[36px]"></div>
        <div className="relative">
          <span className="absolute -left-14 -top-3 text-xs text-slate-500">
            30
          </span>
          <div className="border-t border-dashed h-[36px] border-slate-800"></div>
        </div>
      </div>
    </div>
  );
};

export default CalendarHour;
