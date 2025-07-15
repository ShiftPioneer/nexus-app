
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Award } from "lucide-react";
import { cn } from "@/lib/utils";

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
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm p-6">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={streakDistribution}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="range" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                formatter={(value) => [`${value} habits`, 'Count']}
                labelFormatter={(label) => `Streak: ${label} days`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  color: 'hsl(var(--foreground))',
                  boxShadow: '0 10px 30px -10px hsl(var(--primary) / 0.3)'
                }}
              />
              <Bar 
                dataKey="count" 
                fill="#FF6500" 
                name="Habits" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-red-500 shadow-lg">
            <Award className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Top Streaks</h3>
            <p className="text-slate-400">Your longest habit streaks</p>
          </div>
        </div>
        
        {topStreaks.length > 0 ? (
          <div className="grid gap-4">
            {topStreaks.map((habit, index) => (
              <div key={habit.id} className="group rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-sm p-6 hover:bg-slate-800/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm">
                      #{index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{habit.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="capitalize border-white/20 text-slate-300">
                          {habit.category}
                        </Badge>
                        <Badge variant="secondary" className="capitalize bg-slate-700/50 text-slate-300">
                          {habit.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-orange-500">
                        <Flame className="h-5 w-5" />
                        <span className="font-bold text-2xl text-white">{habit.streak}</span>
                      </div>
                      <span className="text-xs text-slate-400">days streak</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Progress to target</span>
                    <span className="font-medium text-white">{habit.streak}/{habit.target} days</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-3 rounded-full transition-all duration-500 bg-gradient-to-r from-orange-500 to-red-500"
                      style={{ width: `${Math.min(100, (habit.streak / habit.target) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-sm p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-700/50 mx-auto mb-4">
              <Flame className="h-8 w-8 text-slate-400" />
            </div>
            <h4 className="font-semibold text-white mb-2">No streaks yet</h4>
            <p className="text-slate-400 text-sm">Start building your habit streaks to see them here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitStatisticsStreaks;
