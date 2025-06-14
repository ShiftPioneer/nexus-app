
import React from "react";
import { format, isSameDay } from "date-fns";

interface WeekHeaderProps {
  weekDays: Date[];
}

const WeekHeader: React.FC<WeekHeaderProps> = ({ weekDays }) => {
  return (
    <div className="grid grid-cols-8 border-b border-slate-700 sticky top-0 bg-background z-10 my-[15px]">
      <div className="w-12"></div>
      {weekDays.map((day, i) => (
        <div 
          key={i} 
          className={`text-center py-2 font-medium border-r border-slate-700 ${
            isSameDay(day, new Date()) ? "text-blue-600 dark:text-blue-400" : ""
          }`}
        >
          <div>{format(day, "EEE")}</div>
          <div className={`text-lg ${
            isSameDay(day, new Date()) 
              ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 rounded-full w-8 h-8 flex items-center justify-center mx-auto" 
              : ""
          }`}>
            {format(day, "d")}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeekHeader;
