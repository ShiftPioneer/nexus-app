
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fire, Award } from "lucide-react";

interface HabitStatisticsStreaksProps {
  habits: Habit[];
}

const HabitStatisticsStreaks = ({ habits }: HabitStatisticsStreaksProps) => {
  // Get top habits by streak
  const getTopStreaks = () => {
    if (habits.length === 0) return [];
    
    // Sort habits by streak in descending order
    return [...habits]
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 5);
  };

  // Create data for streak distribution chart
  const getStreakDistribution = () => {
    if (habits.length === 0) {
      return [
        { range: "0", count: 0 },
        { range: "1-7", count: 0 },
        { range: "8-14", count: 0 },
        { range: "15-30", count: 0 },
        { range: "31+", count: 0 }
      ];
    }
    
    const distribution = [
      { range: "0", count: 0 },
      { range: "1-7", count: 0 },
      { range: "8-14", count: 0 },
      { range: "15-30", count: 0 },
      { range: "31+", count: 0 }
    ];
    
    habits.forEach(habit => {
      const streak = habit.streak;
      if (streak === 0) {
        distribution[0].count++;
      } else if (streak <= 7) {
        distribution[1].count++;
      } else if (streak <= 14) {
        distribution[2].count++;
      } else if (streak <= 30) {
        distribution[3].count++;
      } else {
        distribution[4].count++;
      }
    });
    
    return distribution;
  };

  const topStreaks = getTopStreaks();
  const streakDistribution = getStreakDistribution();

  return (
    <div className="space-y-8">
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={streakDistribution}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value} habits`, 'Count']}
              labelFormatter={(label) => `Streak: ${label} days`}
            />
            <Bar dataKey="count" fill="#8b5cf6" name="Habits" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Award className="h-5 w-5 text-orange-500" />
          Top Streaks
        </h3>
        
        {topStreaks.length > 0 ? (
          <div className="grid gap-3">
            {topStreaks.map((habit) => (
              <Card key={habit.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{habit.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="capitalize">
                          {habit.category}
                        </Badge>
                        <Badge variant="secondary" className="capitalize">
                          {habit.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-orange-500">
                      <Fire className="h-5 w-5" />
                      <span className="font-bold text-xl">{habit.streak}</span>
                      <span className="text-xs text-muted-foreground">days</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (habit.streak / habit.target) * 100)}%` }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-right text-muted-foreground">
                    {habit.streak}/{habit.target} days target
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>No habit streaks available yet</p>
            <p className="text-sm mt-2">Start building your habit streaks to see them here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitStatisticsStreaks;
