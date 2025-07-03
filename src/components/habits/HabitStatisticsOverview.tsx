
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Flame, TrendingUp, Calendar, Award } from "lucide-react";

interface HabitStatisticsOverviewProps {
  habits: Habit[];
}

const HabitStatisticsOverview = ({ habits }: HabitStatisticsOverviewProps) => {
  // Calculate overview statistics
  const totalHabits = habits.length;
  const activeHabits = habits.filter(h => h.completionDates.length > 0).length;
  const completedToday = habits.filter(h => {
    const today = new Date().toDateString();
    return h.completionDates.some(date => new Date(date).toDateString() === today);
  }).length;

  // Calculate streaks
  const getCurrentStreak = (habit: Habit) => {
    if (habit.completionDates.length === 0) return 0;
    
    const sortedDates = habit.completionDates
      .map(date => new Date(date))
      .sort((a, b) => b.getTime() - a.getTime());
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < sortedDates.length; i++) {
      const daysDiff = Math.floor((today.getTime() - sortedDates[i].getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff === i) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const longestStreak = Math.max(...habits.map(getCurrentStreak), 0);
  const averageCompletion = habits.length > 0 
    ? Math.round((habits.reduce((sum, h) => sum + h.completionDates.length, 0) / habits.length / 30) * 100)
    : 0;

  const stats = [
    {
      title: "Total Habits",
      value: totalHabits,
      icon: Target,
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-500/10 to-indigo-600/10",
      description: "Habits being tracked"
    },
    {
      title: "Active Habits",
      value: activeHabits,
      icon: TrendingUp,
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-500/10 to-teal-600/10",
      description: "Habits with progress"
    },
    {
      title: "Completed Today",
      value: completedToday,
      icon: Calendar,
      gradient: "from-primary to-orange-600",
      bgGradient: "from-primary/10 to-orange-600/10",
      description: "Today's completions"
    },
    {
      title: "Longest Streak",
      value: longestStreak,
      icon: Flame,
      gradient: "from-red-500 to-pink-600",
      bgGradient: "from-red-500/10 to-pink-600/10",
      description: "Days in a row"
    },
    {
      title: "Average Rate",
      value: `${averageCompletion}%`,
      icon: Trophy,
      gradient: "from-purple-500 to-violet-600",
      bgGradient: "from-purple-500/10 to-violet-600/10",
      description: "Monthly completion"
    },
    {
      title: "Achievement Score",
      value: Math.round((activeHabits / Math.max(totalHabits, 1)) * 100),
      icon: Award,
      gradient: "from-amber-500 to-yellow-600",
      bgGradient: "from-amber-500/10 to-yellow-600/10",
      description: "Overall progress"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden bg-slate-900/50 border-slate-700/30 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300">
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`} />
            
            <CardContent className="relative z-10 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <Badge variant="secondary" className="bg-slate-800/50 text-slate-300 border-slate-600/50">
                  Active
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-400">{stat.title}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">{stat.value}</span>
                </div>
                <p className="text-xs text-slate-500">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Insights */}
      <Card className="bg-slate-900/50 border-slate-700/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-orange-600 shadow-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            Quick Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/20">
              <h4 className="font-semibold text-white mb-2">Performance Today</h4>
              <p className="text-slate-400 text-sm">
                You've completed {completedToday} out of {totalHabits} habits today. 
                {completedToday === totalHabits && totalHabits > 0 && " Perfect day! 🎉"}
              </p>
            </div>
            
            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/20">
              <h4 className="font-semibold text-white mb-2">Streak Status</h4>
              <p className="text-slate-400 text-sm">
                Your longest current streak is {longestStreak} days. 
                {longestStreak === 0 ? " Start building consistency!" : " Keep it up! 🔥"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HabitStatisticsOverview;
