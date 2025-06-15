
import React from "react";

interface WeekTimeColumnProps {
  hours: number[];
  formatHour: (hour: number) => string;
}

const WeekTimeColumn: React.FC<WeekTimeColumnProps> = ({
  hours,
  formatHour
}) => {
  return <div className="border-r border-white/5">
      {hours.map(hour => <div key={hour} className="h-[72px] relative">
          <span className="absolute -top-3 w-full text-right pr-2 text-sm font-mono text-slate-500">
            {formatHour(hour)}
          </span>
          <div className="border-b border-white/5 h-full"></div>
          <div className="absolute top-1/2 w-full border-t border-dashed border-white/5"></div>
        </div>)}
    </div>;
};

export default WeekTimeColumn;
