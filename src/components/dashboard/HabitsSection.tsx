import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Plus, Flame, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
    <Card className="border-slate-800 bg-slate-950/40 backdrop-blur-sm h-fit">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center border border-success/20">
              <Target className="h-5 w-5 text-success" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-slate-100">Today's Habits</CardTitle>
              <p className="text-sm text-slate-400 mt-0.5">Build consistency, one step at a time</p>
            </div>
          </div>
          <Link to="/habits">
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs px-3 py-1.5 h-7 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {habits.length > 0 ? (
          <div className="space-y-3">
            {habits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div
                  className={cn(
                    "group relative p-3 rounded-lg border transition-all duration-300 overflow-hidden",
                    habit.completed
                      ? "bg-success/10 border-success/30"
                      : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleHabitCompletion(habit.id)}
                      className={cn(
                        "relative w-10 h-10 rounded-lg border flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 flex-shrink-0",
                        habit.completed
                          ? "bg-success border-success shadow-lg shadow-success/20"
                          : "border-slate-700 bg-slate-800/50 hover:border-success/50"
                      )}
                      aria-label={`Mark ${habit.name} as ${habit.completed ? 'incomplete' : 'complete'}`}
                    >
                      {habit.completed ? (
                        <CheckCircle className="h-5 w-5 text-white animate-in fade-in zoom-in-50 duration-300" />
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-slate-600 group-hover:bg-success/80 transition-colors duration-200" />
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                        <h4 className={cn(
                          "font-medium text-sm truncate transition-colors duration-200",
                          habit.completed ? "text-success" : "text-slate-100"
                        )}>
                          {habit.name}
                        </h4>
                      
                      {habit.streak > 0 && (
                        <div className={cn(
                          "flex items-center gap-1.5 text-xs font-medium mt-1",
                          getStreakColor(habit.streak)
                        )}>
                          <Flame className="h-3.5 w-3.5" />
                          <span>{habit.streak} day streak</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 flex flex-col items-center justify-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center border border-success/20">
              <Target className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">Forge New Habits</h3>
            <p className="text-sm text-slate-400 mb-4 max-w-xs mx-auto">
              Small, consistent actions lead to remarkable results. Start today.
            </p>
            <Link to="/habits">
              <Button 
                className="bg-success hover:bg-success/90 text-success-foreground px-4 py-2 h-auto font-medium shadow-lg shadow-success/20 hover:shadow-success/30 transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Habit
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HabitsSection;
