
import React from "react";
import { CalendarIcon, Clock, Award, BarChart2 } from "lucide-react";

interface Habit {
  id: string;
  title: string;
  category: string;
  streak: number;
  target: number;
  status: "completed" | "pending" | "missed";
  completionDates: Date[];
  type: "daily" | "weekly" | "monthly";
  createdAt: Date;
}

interface HabitStatisticsOverviewProps {
  habits: Habit[];
}

const HabitStatisticsOverview: React.FC<HabitStatisticsOverviewProps> = ({ habits }) => {
  // Calculate statistics
  const daysActive = Math.round((Date.now() - Math.min(...habits.map(h => h.createdAt.getTime()))) / (1000 * 60 * 60 * 24));
  
  const totalCompletions = habits.reduce((acc, habit) => acc + habit.completionDates.length, 0);
  
  const completionRateLast7Days = Math.round((habits.reduce((acc, habit) => {
    const last7DaysCompletions = habit.completionDates.filter(date => 
      (Date.now() - date.getTime()) <= 7 * 24 * 60 * 60 * 1000
    ).length;
    return acc + last7DaysCompletions;
  }, 0) / (habits.length * 7)) * 100);
  
  const longestStreakHabit = habits.reduce((prev, current) => 
    (prev.streak > current.streak) ? prev : current
  );
  
  // Find morning/evening habits pattern
  const morningHabits = habits.filter(h => h.title.toLowerCase().includes("morning") || h.title.toLowerCase().includes("wake")).length;
  
  const avgCompletionTime = morningHabits > (habits.length - morningHabits) 
    ? "9:30 AM" 
    : "7:15 PM";
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-medium">Completion Rate</h3>
          </div>
          <div className="text-2xl font-bold">{completionRateLast7Days}%</div>
          <div className="text-xs text-muted-foreground">Last 7 days</div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-blue-500" />
            <h3 className="text-sm font-medium">Active Days</h3>
          </div>
          <div className="text-2xl font-bold">{daysActive}</div>
          <div className="text-xs text-muted-foreground">This month</div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-orange-500" />
            <h3 className="text-sm font-medium">Longest Streak</h3>
          </div>
          <div className="text-2xl font-bold">{longestStreakHabit.streak} days</div>
          <div className="text-xs text-muted-foreground">{longestStreakHabit.title}</div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-500" />
            <h3 className="text-sm font-medium">Avg. Completion Time</h3>
          </div>
          <div className="text-2xl font-bold">{avgCompletionTime}</div>
          <div className="text-xs text-muted-foreground">Morning habits</div>
        </div>
      </div>
      
      <div className="pt-6 border-t">
        <h3 className="text-lg font-medium mb-4">Weekly Habit Performance</h3>
        <div className="h-64 flex items-end gap-3">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
            // Generate random but consistent data for demo
            const completedPercentage = 40 + Math.floor(Math.sin(i) * 20 + Math.cos(i * 2) * 30);
            const missedPercentage = 10 + Math.floor(Math.cos(i) * 10);
            
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col-reverse gap-1" style={{ height: "200px" }}>
                  <div 
                    className="w-full bg-blue-500" 
                    style={{ height: `${completedPercentage}%` }}
                  ></div>
                  <div 
                    className="w-full bg-muted/30" 
                    style={{ height: `${missedPercentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground">{day}</div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500"></div>
            <span className="text-xs">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-muted/30"></div>
            <span className="text-xs">Missed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitStatisticsOverview;
