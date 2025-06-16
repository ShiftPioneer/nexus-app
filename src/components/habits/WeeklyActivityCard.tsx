
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, Circle, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeeklyActivityCardProps {
  habits: Habit[];
}

const WeeklyActivityCard: React.FC<WeeklyActivityCardProps> = ({ habits }) => {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const getCompletionForDay = (habit: Habit, dayOffset: number) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - (6 - dayOffset));
    
    return habit.completionDates.some(date => {
      const completionDate = new Date(date);
      return completionDate.toDateString() === targetDate.toDateString();
    });
  };

  const displayHabits = habits.slice(0, 5);
  
  // Calculate weekly completion rate
  const totalPossibleCompletions = displayHabits.length * 7;
  const totalCompletions = displayHabits.reduce((total, habit) => {
    return total + Array.from({ length: 7 }, (_, index) => 
      getCompletionForDay(habit, index) ? 1 : 0
    ).reduce((sum, val) => sum + val, 0);
  }, 0);
  
  const completionRate = totalPossibleCompletions > 0 
    ? Math.round((totalCompletions / totalPossibleCompletions) * 100) 
    : 0;

  return (
    <Card className="bg-slate-950/40 border-slate-300 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <span className="text-white text-lg font-semibold">Weekly Activity</span>
              <p className="text-slate-400 text-sm font-normal">Last 7 days progress</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-400">{completionRate}%</div>
            <div className="text-xs text-slate-400">completion</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Days Header */}
          <div className="grid grid-cols-8 gap-2 text-xs text-slate-400 font-medium border-b border-slate-300 pb-2">
            <div className="text-left">Habit</div>
            {weekDays.map((day, index) => (
              <div key={index} className="text-center">{day}</div>
            ))}
          </div>
          
          {/* Habits Grid */}
          {displayHabits.length > 0 ? (
            <div className="space-y-3">
              {displayHabits.map((habit) => (
                <div key={habit.id} className="grid grid-cols-8 gap-2 items-center p-2 bg-slate-800/30 rounded-lg border border-slate-300 hover:bg-slate-800/50 transition-colors">
                  <div className="text-white text-sm font-medium truncate pr-2" title={habit.title}>
                    {habit.title.length > 8 ? habit.title.substring(0, 8) + '...' : habit.title}
                  </div>
                  {Array.from({ length: 7 }, (_, index) => {
                    const isCompleted = getCompletionForDay(habit, index);
                    return (
                      <div key={index} className="flex justify-center">
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        ) : (
                          <Circle className="h-5 w-5 text-slate-600" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <BarChart3 className="h-12 w-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No habits to track yet</p>
              <p className="text-slate-600 text-xs mt-1">Create habits to see weekly activity</p>
            </div>
          )}
          
          {/* Weekly Summary */}
          {displayHabits.length > 0 && (
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-lg border border-slate-300">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">This week:</span>
                <span className="text-white font-medium">{totalCompletions}/{totalPossibleCompletions} completed</span>
              </div>
              <div className="mt-2 w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-green-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyActivityCard;
