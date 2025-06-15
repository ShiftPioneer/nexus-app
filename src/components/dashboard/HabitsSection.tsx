
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Plus, Flame, Target, Star } from "lucide-react";
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
        setHabits(parsedHabits.slice(0, 3)); // Show only first 3 habits
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

  const getStreakColor = (streak: number) => {
    if (streak >= 7) return "text-orange-400";
    if (streak >= 3) return "text-yellow-400";
    return "text-lime-400";
  };

  return (
    <Card className="border-slate-700/50 bg-slate-950 overflow-hidden h-fit">
      <CardHeader className="pb-4 bg-slate-950">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-500/10 flex items-center justify-center">
              <Target className="h-5 w-5 text-lime-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-white">Today's Habits</CardTitle>
              <p className="text-sm text-slate-400 mt-0.5">Build consistency, one step at a time</p>
            </div>
          </div>
          <Link to="/habits">
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs px-3 py-1.5 h-7 border-lime-500/30 text-lime-400 hover:bg-lime-500/10 hover:border-lime-500/50"
            >
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 bg-slate-950">
        {habits.length > 0 ? (
          <div className="space-y-3">
            {habits.map((habit) => (
              <div 
                key={habit.id}
                className={cn(
                  "group relative p-3 rounded-lg border transition-all duration-200 overflow-hidden",
                  habit.completed
                    ? "bg-lime-500/5 border-lime-500/30"
                    : "bg-slate-900/50 border-slate-700/50 hover:border-slate-600/70"
                )}
              >
                <div className="flex items-center gap-3">
                  {/* Larger, more accessible toggle button */}
                  <button
                    onClick={() => toggleHabitCompletion(habit.id)}
                    className={cn(
                      "relative w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0",
                      habit.completed
                        ? "bg-lime-500 border-lime-500 shadow-lg shadow-lime-500/25"
                        : "border-slate-600 hover:border-lime-500/50 hover:bg-lime-500/5"
                    )}
                    aria-label={`Mark ${habit.name} as ${habit.completed ? 'incomplete' : 'complete'}`}
                  >
                    {habit.completed && (
                      <CheckCircle className="h-5 w-5 text-white animate-in fade-in duration-200" />
                    )}
                    {!habit.completed && (
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-600 group-hover:bg-lime-500/50 transition-colors duration-200" />
                    )}
                  </button>
                  
                  {/* Habit Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={cn(
                        "font-medium text-sm truncate transition-colors duration-200",
                        habit.completed ? "text-lime-400" : "text-white"
                      )}>
                        {habit.name}
                      </h4>
                      {habit.completed && (
                        <Star className="h-3 w-3 text-lime-400 animate-in fade-in scale-in duration-200 flex-shrink-0" />
                      )}
                    </div>
                    
                    {habit.streak > 0 && (
                      <div className={cn(
                        "flex items-center gap-1 text-xs font-medium",
                        getStreakColor(habit.streak)
                      )}>
                        <Flame className="h-3 w-3" />
                        <span>{habit.streak} day streak</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add New Habit CTA */}
            <div className="pt-2">
              <Link to="/habits">
                <Button 
                  variant="outline" 
                  className="w-full h-10 text-sm border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all duration-200 group"
                >
                  <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                  Add New Habit
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Simplified Empty State */
          <div className="text-center py-6">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-lime-500/10 flex items-center justify-center">
              <Target className="h-6 w-6 text-lime-400" />
            </div>
            <h3 className="text-base font-medium text-white mb-2">Start Building Habits</h3>
            <p className="text-sm text-slate-400 mb-4">
              Small changes, big results.
            </p>
            <Link to="/habits">
              <Button 
                className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 h-auto font-medium shadow-lg shadow-lime-500/25 hover:shadow-lime-500/40 transition-all duration-200"
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
