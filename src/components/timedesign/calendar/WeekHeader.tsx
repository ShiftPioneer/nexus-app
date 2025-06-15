
import React from "react";
import { format, isSameDay } from "date-fns";

interface WeekHeaderProps {
  weekDays: Date[];
}

const WeekHeader: React.FC<WeekHeaderProps> = ({ weekDays }) => {
  return (
    <div className="grid grid-cols-8 border-b border-slate-800 sticky top-0 bg-slate-950 z-20">
      <div className="w-12"></div>
      {weekDays.map((day, i) => {
        const isToday = isSameDay(day, new Date());
        return (
          <div key={i} className={`text-center py-3 border-r border-slate-800`}>
            <div className={`text-xs uppercase tracking-wider ${isToday ? "text-primary" : "text-slate-400"}`}>
              {format(day, "EEE")}
            </div>
            <div className={`text-2xl font-bold mt-1 ${isToday ? "text-white bg-primary rounded-full w-10 h-10 flex items-center justify-center mx-auto" : "text-slate-300"}`}>
              {format(day, "d")}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeekHeader;
