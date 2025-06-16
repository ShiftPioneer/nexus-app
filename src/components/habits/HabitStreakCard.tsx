
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HabitStreakCardProps {
  habits: Habit[];
}

const HabitStreakCard: React.FC<HabitStreakCardProps> = ({ habits }) => {
  const sortedHabits = habits
    .filter(h => h.streak > 0)
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 4);

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return "text-orange-400 bg-orange-400/20";
    if (streak >= 14) return "text-yellow-400 bg-yellow-400/20";
    if (streak >= 7) return "text-lime-400 bg-lime-400/20";
    return "text-blue-400 bg-blue-400/20";
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      health: "bg-green-500/80",
      mindfulness: "bg-blue-500/80",
      learning: "bg-purple-500/80",
      productivity: "bg-orange-500/80",
      relationships: "bg-pink-500/80",
      finance: "bg-emerald-500/80",
      religion: "bg-amber-500/80",
      other: "bg-gray-500/80"
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const totalStreaks = habits.reduce((sum, habit) => sum + habit.streak, 0);
  const longestStreak = Math.max(...habits.map(h => h.streak), 0);

  return (
    <Card className="bg-slate-950/40 border-slate-300 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Flame className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <span className="text-white text-lg font-semibold">Active Streaks</span>
              <p className="text-slate-400 text-sm font-normal">Your momentum builders</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-400">{sortedHabits.length}</div>
            <div className="text-xs text-slate-400">active</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-slate-800/50 rounded-lg border border-slate-300">
          <div className="text-center">
            <div className="text-lg font-bold text-white">{totalStreaks}</div>
            <div className="text-xs text-slate-400">Total Days</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-400">{longestStreak}</div>
            <div className="text-xs text-slate-400">Best Streak</div>
          </div>
        </div>

        {/* Streaks List */}
        {sortedHabits.length > 0 ? (
          <div className="space-y-3">
            {sortedHabits.map((habit) => (
              <div key={habit.id} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-300 hover:bg-slate-800/50 transition-colors">
                <div className={`w-3 h-3 rounded-full ${getCategoryColor(habit.category)}`} />
                <span className="text-white flex-1 font-medium text-sm">{habit.title}</span>
                <Badge variant="outline" className={`${getStreakColor(habit.streak)} border-current px-2 py-1`}>
                  <Flame className="h-3 w-3 mr-1" />
                  {habit.streak}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <TrendingUp className="h-12 w-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No active streaks yet</p>
            <p className="text-slate-600 text-xs mt-1">Complete habits to build momentum!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HabitStreakCard;
