
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeeklyActivityCardProps {
  habits: Habit[];
}

const WeeklyActivityCard: React.FC<WeeklyActivityCardProps> = ({ habits }) => {
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  
  const getCompletionForDay = (habit: Habit, dayOffset: number) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - dayOffset);
    
    return habit.completionDates.some(date => {
      const completionDate = new Date(date);
      return completionDate.toDateString() === targetDate.toDateString();
    });
  };

  const displayHabits = habits.slice(0, 4);

  return (
    <Card className="bg-slate-950/40 border-slate-800">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-blue-400" />
          <span className="text-white">Weekly Activity</span>
        </CardTitle>
        <p className="text-slate-400 text-sm">This week's habit completion</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-8 gap-2 text-xs text-slate-400 font-medium">
            <div>Habit</div>
            {weekDays.map((day, index) => (
              <div key={index} className="text-center">{day}</div>
            ))}
          </div>
          
          {displayHabits.map((habit) => (
            <div key={habit.id} className="grid grid-cols-8 gap-2 items-center">
              <div className="text-white text-sm font-medium truncate" title={habit.title}>
                {habit.title}
              </div>
              {Array.from({ length: 7 }, (_, index) => {
                const isCompleted = getCompletionForDay(habit, 6 - index);
                return (
                  <div key={index} className="flex justify-center">
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-orange-400" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-600" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
          
          {displayHabits.length === 0 && (
            <p className="text-slate-500 text-sm text-center py-4">
              No habits to track. Create your first habit to see weekly activity.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyActivityCard;
