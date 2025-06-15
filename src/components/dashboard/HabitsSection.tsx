
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Plus, Flame, Target } from "lucide-react";
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
      case "health": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "productivity": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "learning": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "mindfulness": return "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <Card className="border-slate-300 bg-slate-950">
      <CardHeader className="pb-3 bg-slate-950 border-slate-300 rounded-lg">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Target className="h-5 w-5 text-lime-600" />
            Today's Habits
          </CardTitle>
          <Link to="/habits">
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs px-3 py-1 h-7 border-lime-600 text-lime-600 hover:bg-lime-50 dark:hover:bg-lime-950/20"
            >
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent className="bg-slate-950 rounded-lg space-y-3">
        {habits.length > 0 ? (
          <>
            {habits.map((habit) => (
              <div 
                key={habit.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => toggleHabitCompletion(habit.id)}
                    className={cn(
                      "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                      habit.completed
                        ? "bg-lime-600 border-lime-600 text-white"
                        : "border-slate-600 hover:border-lime-600"
                    )}
                  >
                    {habit.completed && <CheckCircle className="h-4 w-4" />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-medium text-sm truncate",
                      habit.completed && "line-through text-slate-400"
                    )}>
                      {habit.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="secondary" 
                        className={cn("text-xs px-2 py-0", getCategoryColor(habit.category))}
                      >
                        {habit.category}
                      </Badge>
                      {habit.streak > 0 && (
                        <div className="flex items-center gap-1 text-xs text-lime-600">
                          <Flame className="h-3 w-3" />
                          <span>{habit.streak}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="pt-2 border-t border-slate-700">
              <Link to="/habits">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs h-8 border-lime-600 text-lime-600 hover:bg-lime-50 dark:hover:bg-lime-950/20"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add New Habit
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <Target className="h-12 w-12 mx-auto mb-3 text-slate-600" />
            <p className="text-sm text-slate-400 mb-3">No habits tracked yet</p>
            <Link to="/habits">
              <Button 
                size="sm"
                className="bg-lime-600 hover:bg-lime-700 text-white"
              >
                <Plus className="h-4 w-4 mr-1" />
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
