import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Clock, Calendar, Target, TrendingUp, Repeat, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { CircularProgress } from "@/components/ui/circular-progress";
import { StreakFire } from "@/components/ui/streak-fire";

interface ModernHabitCardProps {
  habit: Habit;
  onComplete: (id: string) => void;
  onSkip: (id: string) => void;
  onEdit: (habit: Habit) => void;
  onSchedule?: (habit: Habit) => void;
}

const ModernHabitCard: React.FC<ModernHabitCardProps> = ({ habit, onComplete, onSkip, onEdit, onSchedule }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health': return 'bg-emerald-500/20 text-emerald-400 border-slate-300';
      case 'mindfulness': return 'bg-blue-500/20 text-blue-400 border-slate-300';
      case 'learning': return 'bg-purple-500/20 text-purple-400 border-slate-300';
      case 'productivity': return 'bg-primary/20 text-primary border-slate-300';
      case 'relationships': return 'bg-pink-500/20 text-pink-400 border-slate-300';
      case 'finance': return 'bg-emerald-500/20 text-emerald-400 border-slate-300';
      case 'religion': return 'bg-amber-500/20 text-amber-400 border-slate-300';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-300';
    }
  };

  const dailyTarget = habit.dailyTarget || 1;
  const todayCompletions = habit.todayCompletions || 0;
  const isMultiDaily = dailyTarget > 1;
  const dailyProgress = Math.min(100, Math.round((todayCompletions / dailyTarget) * 100));

  const getStatusIcon = () => {
    if (habit.status === "completed") {
      return <CheckCircle className="h-8 w-8 text-emerald-400" />;
    }
    if (habit.status === "partial") {
      return (
        <div className="relative">
          <Circle className="h-8 w-8 text-amber-400" />
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-amber-400">
            {todayCompletions}
          </span>
        </div>
      );
    }
    return <Circle className="h-8 w-8 text-slate-600" />;
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return "text-primary";
    if (streak >= 14) return "text-emerald-400";
    if (streak >= 7) return "text-blue-400";
    return "text-slate-400";
  };

  const progressPercentage = Math.round((habit.streak / habit.target) * 100);

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden border transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-slate-900/50 card-enhanced",
        habit.status === "completed" 
          ? "border-emerald-500/50 bg-emerald-950/20" 
          : habit.status === "partial"
          ? "border-amber-500/50 bg-amber-950/20"
          : habit.status === "missed" 
          ? "border-red-500/50 bg-red-950/20"
          : "border-slate-300 bg-slate-950/40 hover:border-slate-200"
      )}
      onClick={() => onEdit(habit)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              {getStatusIcon()}
              {habit.status === "completed" && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">{habit.title}</h3>
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{habit.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{habit.type}</span>
                </div>
                {isMultiDaily && (
                  <div className="flex items-center gap-1 text-amber-400">
                    <Repeat className="h-4 w-4" />
                    <span>{dailyTarget}x/day</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <Badge variant="outline" className={getCategoryColor(habit.category)}>
            {habit.category}
          </Badge>
        </div>

        <div className="space-y-4">
          {/* Multi-daily Progress (if applicable) */}
          {isMultiDaily && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Today's Progress</span>
                <span className={cn(
                  "font-medium",
                  habit.status === "completed" ? "text-emerald-400" : "text-amber-400"
                )}>
                  {todayCompletions} / {dailyTarget}
                </span>
              </div>
              <div className="relative w-full bg-slate-800/50 h-2 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    habit.status === "completed" 
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-400" 
                      : "bg-gradient-to-r from-amber-500 to-amber-400"
                  )}
                  style={{ width: `${dailyProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Streak and Progress */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StreakFire 
                count={habit.streak} 
                size="sm" 
                animated={habit.status === "completed"}
                showCount={false}
              />
              <span className={cn("font-bold text-lg", getStreakColor(habit.streak))}>
                {habit.streak} day streak
              </span>
            </div>
            <CircularProgress
              value={progressPercentage}
              size="sm"
              variant={habit.status === "completed" ? "success" : "primary"}
              showLabel
            />
          </div>

          {/* Progress Info */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <Target className="h-4 w-4" />
              <span>Goal: {habit.target} days</span>
            </div>
            <span className="text-slate-400">{progressPercentage}% complete</span>
          </div>

          {/* Score Display */}
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-300">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-slate-300">Points</span>
            </div>
            <div className="text-right">
              <span className="text-emerald-400 font-medium">+{habit.scoreValue || 5}</span>
              <span className="text-slate-500 text-xs ml-2">/ -{habit.penaltyValue || 10}</span>
            </div>
          </div>

          {/* Action Buttons */}
          {(habit.status === "pending" || habit.status === "partial") && (
            <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                size="sm" 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white border-slate-300"
                onClick={(e) => {
                  e.stopPropagation();
                  onComplete(habit.id);
                }}
              >
                {isMultiDaily ? `Complete (${todayCompletions + 1}/${dailyTarget})` : "Complete"}
              </Button>
              {onSchedule && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-primary/50 text-primary hover:bg-primary/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSchedule(habit);
                  }}
                >
                  <CalendarClock className="h-4 w-4" />
                </Button>
              )}
              <Button 
                size="sm" 
                variant="outline" 
                className="border-slate-300 text-red-400 hover:bg-red-500/10"
                onClick={(e) => {
                  e.stopPropagation();
                  onSkip(habit.id);
                }}
              >
                Skip
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModernHabitCard;
