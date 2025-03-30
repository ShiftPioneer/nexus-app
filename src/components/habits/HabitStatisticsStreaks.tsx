
import React from "react";
import { Award } from "lucide-react";

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

interface HabitStatisticsStreaksProps {
  habits: Habit[];
}

const HabitStatisticsStreaks: React.FC<HabitStatisticsStreaksProps> = ({ habits }) => {
  const sortedHabits = [...habits].sort((a, b) => b.streak - a.streak);
  
  // Calculate longest streak for each habit
  const habitsWithLongestStreaks = sortedHabits.map(habit => {
    // For demo purposes, using current streak as longest streak with some variation
    const longestStreak = Math.max(habit.streak, Math.round(habit.streak * (1 + Math.random() * 0.5)));
    
    return {
      ...habit,
      longestStreak
    };
  });
  
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Habit Streaks</h3>
        
        <div className="overflow-hidden rounded-md border">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="p-3 text-left text-sm font-medium">Habit</th>
                <th className="p-3 text-left text-sm font-medium">Current Streak</th>
                <th className="p-3 text-left text-sm font-medium">Longest Streak</th>
              </tr>
            </thead>
            <tbody>
              {habitsWithLongestStreaks.map((habit, index) => {
                const isCurrentHighest = index === 0;
                const isLongestHighest = habit.longestStreak === Math.max(...habitsWithLongestStreaks.map(h => h.longestStreak));
                
                return (
                  <tr key={habit.id} className="border-t">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${habit.status === "completed" ? "bg-success" : "bg-muted"}`}></div>
                        <span>{habit.title}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{habit.category}</div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <span className={`font-medium ${isCurrentHighest ? "text-primary" : ""}`}>
                          {habit.streak} days
                        </span>
                        {isCurrentHighest && <Award className="h-3.5 w-3.5 text-yellow-500" />}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <span className={`font-medium ${isLongestHighest ? "text-primary" : ""}`}>
                          {habit.longestStreak} days
                        </span>
                        {isLongestHighest && <Award className="h-3.5 w-3.5 text-yellow-500" />}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HabitStatisticsStreaks;
