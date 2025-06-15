
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Plus, Flame, Target, Calendar, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Habit {
  id: string;
  name: string;
  category: string;
  frequency: string;
  streak: number;
  completed: boolean;
  lastCompleted?: string;
}

const HabitsSection = () => {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    // Load habits from localStorage
    try {
      const savedHabits = localStorage.getItem('habits');
      if (savedHabits) {
        const parsedHabits = JSON.parse(savedHabits);
        setHabits(parsedHabits.slice(0, 4)); // Show only first 4 habits
      }
    } catch (error) {
      console.error("Failed to load habits:", error);
    }
  }, []);

  const toggleHabitCompletion = (habitId: string) => {
    setHabits(prev => prev.map(habit => 
      habit.id === habitId 
        ? { 
            ...habit, 
            completed: !habit.completed,
            streak: !habit.completed ? habit.streak + 1 : Math.max(0, habit.streak - 1),
            lastCompleted: !habit.completed ? new Date().toISOString() : habit.lastCompleted
          }
        : habit
    ));
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "health": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "productivity": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "learning": return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "mindfulness": return "bg-lime-500/10 text-lime-600 border-lime-500/20";
      default: return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 7) return "text-orange-500";
    if (streak >= 3) return "text-yellow-500";
    return "text-lime-500";
  };

  return (
    <Card className="border-slate-300 bg-slate-950 overflow-hidden">
      <CardHeader className="pb-4 bg-slate-950 border-b border-slate-300/20">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-500/10 flex items-center justify-center">
              <Target className="h-5 w-5 text-lime-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-white">Today's Habits</CardTitle>
              <p className="text-sm text-slate-400 mt-0.5">Build consistency, one day at a time</p>
            </div>
          </div>
          <Link to="/habits">
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs px-4 py-2 h-8 border-lime-500/30 text-lime-400 hover:bg-lime-500/10 hover:border-lime-500/50 transition-all duration-200"
            >
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 bg-slate-950">
        {habits.length > 0 ? (
          <div className="space-y-4">
            {habits.map((habit) => (
              <div 
                key={habit.id}
                className={cn(
                  "group relative p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02]",
                  habit.completed
                    ? "bg-gradient-to-r from-lime-500/5 to-emerald-500/5 border-lime-500/30"
                    : "bg-slate-900/50 border-slate-700/50 hover:border-slate-600/70"
                )}
              >
                <div className="flex items-center gap-4">
                  {/* Enhanced Toggle Button */}
                  <button
                    onClick={() => toggleHabitCompletion(habit.id)}
                    className={cn(
                      "relative w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95",
                      habit.completed
                        ? "bg-lime-500 border-lime-500 shadow-lg shadow-lime-500/25"
                        : "border-slate-600 hover:border-lime-500/50 hover:bg-lime-500/5"
                    )}
                    aria-label={`Mark ${habit.name} as ${habit.completed ? 'incomplete' : 'complete'}`}
                  >
                    {habit.completed && (
                      <CheckCircle className="h-6 w-6 text-white animate-in fade-in scale-in duration-200" />
                    )}
                    {!habit.completed && (
                      <div className="w-3 h-3 rounded-full bg-slate-600 group-hover:bg-lime-500/30 transition-colors duration-200" />
                    )}
                  </button>
                  
                  {/* Habit Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className={cn(
                        "font-medium text-base truncate transition-colors duration-200",
                        habit.completed ? "text-lime-400" : "text-white"
                      )}>
                        {habit.name}
                      </h4>
                      {habit.completed && (
                        <Star className="h-4 w-4 text-lime-400 animate-in fade-in scale-in duration-300" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs px-2 py-1 font-medium", getCategoryColor(habit.category))}
                      >
                        {habit.category}
                      </Badge>
                      
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Calendar className="h-3 w-3" />
                        <span>{habit.frequency}</span>
                      </div>
                      
                      {habit.streak > 0 && (
                        <div className={cn(
                          "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                          "bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20",
                          getStreakColor(habit.streak)
                        )}>
                          <Flame className="h-3 w-3" />
                          <span>{habit.streak} day{habit.streak !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Completion Overlay */}
                {habit.completed && (
                  <div className="absolute inset-0 bg-lime-500/5 rounded-xl pointer-events-none animate-in fade-in duration-500" />
                )}
              </div>
            ))}
            
            {/* Add New Habit CTA */}
            <div className="pt-2">
              <Link to="/habits">
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-sm border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all duration-200 group"
                >
                  <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                  Add New Habit
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Enhanced Empty State */
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-lime-500/10 to-emerald-500/10 flex items-center justify-center">
              <Target className="h-8 w-8 text-lime-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Start Building Habits</h3>
            <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">
              Transform your daily routine with powerful habit tracking. Small changes, big results.
            </p>
            <Link to="/habits">
              <Button 
                className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2.5 h-auto font-medium shadow-lg shadow-lime-500/25 hover:shadow-lime-500/40 transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Habit
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HabitsSection;
