
import React from "react";

interface WeekTimeColumnProps {
  hours: number[];
  formatHour: (hour: number) => string;
}

const WeekTimeColumn: React.FC<WeekTimeColumnProps> = ({
  hours,
  formatHour
}) => {
  return <div className="border-r border-slate-800">
      {hours.map(hour => <div key={hour} className="h-[72px] relative">
          <span className="absolute -top-3 w-full text-right pr-2 text-xs font-medium text-slate-400">
            {formatHour(hour)}
          </span>
          <div className="border-t border-slate-800 h-[36px]"></div>
          <div className="relative">
            <span className="absolute right-2 -top-3 text-xs text-slate-500">
              30
            </span>
            <div className="border-t border-dashed h-[36px] border-slate-800"></div>
          </div>
        </div>)}
    </div>;
};

export default WeekTimeColumn;
