
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Flame, Clock, Calendar, Target, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModernHabitCardProps {
  habit: Habit;
  onComplete: (id: string) => void;
  onSkip: (id: string) => void;
  onEdit: (habit: Habit) => void;
}

const ModernHabitCard: React.FC<ModernHabitCardProps> = ({ habit, onComplete, onSkip, onEdit }) => {
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

  const getStatusIcon = () => {
    if (habit.status === "completed") {
      return <CheckCircle className="h-8 w-8 text-emerald-400" />;
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
              </div>
            </div>
          </div>
          
          <Badge variant="outline" className={getCategoryColor(habit.category)}>
            {habit.category}
          </Badge>
        </div>

        <div className="space-y-4">
          {/* Streak and Progress */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className={cn("h-5 w-5", getStreakColor(habit.streak))} />
              <span className={cn("font-bold text-lg", getStreakColor(habit.streak))}>
                {habit.streak} day streak
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Target className="h-4 w-4" />
              <span className="text-sm">Goal: {habit.target} days</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Progress</span>
              <span className="text-white font-medium">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 border border-slate-300">
              <div 
                className={cn(
                  "h-2 rounded-full transition-all duration-500",
                  habit.status === "completed" ? "bg-emerald-400" : "bg-primary"
                )}
                style={{ width: `${Math.min(100, progressPercentage)}%` }}
              />
            </div>
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
          {habit.status === "pending" && (
            <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                size="sm" 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white border-slate-300"
                onClick={(e) => {
                  e.stopPropagation();
                  onComplete(habit.id);
                }}
              >
                Complete
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 border-slate-300 text-red-400 hover:bg-red-500/10"
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
