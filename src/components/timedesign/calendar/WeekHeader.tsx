import React from "react";
import { format, isSameDay } from "date-fns";
interface WeekHeaderProps {
  weekDays: Date[];
}
const WeekHeader: React.FC<WeekHeaderProps> = ({
  weekDays
}) => {
  return <div className="grid grid-cols-8 border-b border-slate-700 sticky top-0 z-10 my-[15px] bg-slate-300 rounded-lg">
      <div className="w-12 bg-slate-300"></div>
      {weekDays.map((day, i) => <div key={i} className={`text-center py-2 font-medium border-r border-slate-700 ${isSameDay(day, new Date()) ? "text-blue-600 dark:text-blue-400" : ""}`}>
          <div className="te bg-background-DEFAULT text-slate-950">{format(day, "EEE")}</div>
          <div className="text-slate-950 ">
            {format(day, "d")}
          </div>
        </div>)}
    </div>;
};
export default WeekHeader;