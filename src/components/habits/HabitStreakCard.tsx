
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame } from "lucide-react";
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
    if (streak >= 30) return "text-orange-400";
    if (streak >= 14) return "text-yellow-400";
    if (streak >= 7) return "text-lime-400";
    return "text-blue-400";
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      health: "bg-green-500",
      mindfulness: "bg-blue-500",
      learning: "bg-purple-500",
      productivity: "bg-orange-500",
      relationships: "bg-pink-500",
      finance: "bg-emerald-500",
      religion: "bg-amber-500",
      other: "bg-gray-500"
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  return (
    <Card className="bg-slate-950/40 border-slate-800">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Flame className="h-5 w-5 text-orange-400" />
          <span className="text-white">Streaks</span>
        </CardTitle>
        <p className="text-slate-400 text-sm">Your longest streaks</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedHabits.length > 0 ? (
          sortedHabits.map((habit) => (
            <div key={habit.id} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${getCategoryColor(habit.category)}`} />
              <span className="text-white flex-1 font-medium">{habit.title}</span>
              <Badge variant="outline" className={`${getStreakColor(habit.streak)} border-current`}>
                {habit.streak} days
              </Badge>
            </div>
          ))
        ) : (
          <p className="text-slate-500 text-sm text-center py-4">
            No active streaks yet. Start building consistency!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default HabitStreakCard;
