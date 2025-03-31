
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Workout } from "@/types/energy";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from "date-fns";

interface CalendarViewProps {
  workouts: Workout[];
}

export function CalendarView({ workouts }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get the day of the week the month starts on (0 = Sunday, 1 = Monday, etc.)
  const startDay = getDay(monthStart);
  
  // Create an array of blank spaces for days before the first of the month
  const blanks = Array.from({ length: startDay }, (_, i) => i);
  
  // Find workouts for each day
  const getWorkoutsForDay = (date: Date) => {
    return workouts.filter(workout => isSameDay(workout.date, date));
  };

  return (
    <div>
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-medium">{format(currentMonth, "MMMM yyyy")}</h3>
        <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Days of the Week */}
      <div className="grid grid-cols-7 gap-1 mb-2 text-sm text-center">
        <div className="py-2">Su</div>
        <div className="py-2">Mo</div>
        <div className="py-2">Tu</div>
        <div className="py-2">We</div>
        <div className="py-2">Th</div>
        <div className="py-2">Fr</div>
        <div className="py-2">Sa</div>
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Blank spaces before the first day of the month */}
        {blanks.map((blank, index) => (
          <div key={`blank-${index}`} className="aspect-square border bg-muted/20 rounded-md"></div>
        ))}
        
        {/* Days of the month */}
        {monthDays.map((day) => {
          const dayWorkouts = getWorkoutsForDay(day);
          const isToday = isSameDay(day, new Date());
          
          return (
            <div
              key={day.toISOString()}
              className={`aspect-square border rounded-md p-1 overflow-hidden ${
                isToday ? "bg-primary/10 border-primary" : ""
              }`}
            >
              <div className="text-right text-xs mb-1 font-medium">
                {format(day, "d")}
              </div>
              
              {dayWorkouts.length > 0 && (
                <div className="space-y-1">
                  {dayWorkouts.map((workout) => (
                    <div
                      key={workout.id}
                      className={`text-xs truncate px-1 py-0.5 rounded ${
                        workout.status === "Completed" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-blue-100 text-blue-800"
                      }`}
                      title={workout.name}
                    >
                      {workout.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
