
import React from "react";

interface WeekTimeColumnProps {
  hours: number[];
  formatHour: (hour: number) => string;
}

const WeekTimeColumn: React.FC<WeekTimeColumnProps> = ({ hours, formatHour }) => {
  return (
    <div className="border-r border-slate-700">
      {hours.map(hour => (
        <div key={hour} className="h-[72px] relative">
          <span className="absolute -top-3 w-full text-right pr-2 text-sm font-medium text-muted-foreground">
            {formatHour(hour)}
          </span>
          <div className="border-t border-slate-700 h-[36px]"></div>
          <div className="relative">
            <span className="absolute right-2 -top-3 text-xs text-muted-foreground">
              30
            </span>
            <div className="border-t border-dashed h-[36px] border-slate-700"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeekTimeColumn;
