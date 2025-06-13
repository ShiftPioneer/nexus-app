
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Plus, Award, Clock, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface Habit {
  id: string;
  title: string;
  streak: number;
  target: number;
  status: "completed" | "pending" | "missed";
  category: "health" | "productivity" | "mindfulness" | "personal" | "religion" | "learning" | "other";
  duration?: string;
  completionDates: Date[];
}

const HabitsSection = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load habits from localStorage
  useEffect(() => {
    try {
      const savedHabits = localStorage.getItem('userHabits');
      if (savedHabits) {
        const parsedHabits = JSON.parse(savedHabits);
        setHabits(parsedHabits);
      }
    } catch (error) {
      console.error("Failed to load habits:", error);
    }

    // Listen for habit updates
    const handleHabitsUpdate = () => {
      try {
        const savedHabits = localStorage.getItem('userHabits');
        if (savedHabits) {
          const parsedHabits = JSON.parse(savedHabits);
          setHabits(parsedHabits);
        }
      } catch (error) {
        console.error("Failed to load updated habits:", error);
      }
    };

    window.addEventListener('storage', handleHabitsUpdate);
    return () => {
      window.removeEventListener('storage', handleHabitsUpdate);
    };
  }, []);

  const completeHabit = (id: string) => {
    const today = new Date();
    const updatedHabits = habits.map(habit => {
      if (habit.id === id) {
        // Check if already completed today
        const completedToday = habit.completionDates.some(date => 
          new Date(date).toDateString() === today.toDateString()
        );
        
        if (completedToday) {
          toast({
            title: "Already Completed",
            description: `${habit.title} has already been completed today.`,
          });
          return habit;
        }

        const updatedHabit = {
          ...habit,
          status: "completed" as const,
          streak: habit.streak + 1,
          completionDates: [today, ...habit.completionDates]
        };

        return updatedHabit;
      }
      return habit;
    });

    setHabits(updatedHabits);
    
    // Save to localStorage
    try {
      localStorage.setItem('userHabits', JSON.stringify(updatedHabits));
    } catch (error) {
      console.error("Failed to save habits:", error);
    }

    const habit = habits.find(h => h.id === id);
    if (habit) {
      toast({
        title: "Habit Completed! 🎉",
        description: `${habit.title} completed for today.`
      });

      // Check if streak milestone reached
      const updatedStreak = habit.streak + 1;
      if (updatedStreak === habit.target) {
        setTimeout(() => {
          toast({
            title: "Achievement Unlocked! 🏆",
            description: `You've reached your streak goal of ${habit.target} days for ${habit.title}!`,
          });
        }, 1000);
      }
    }
  };

  const navigateToHabits = () => {
    navigate("/habits");
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'productivity':
        return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
      case 'mindfulness':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'personal':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case 'learning':
        return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400';
      case 'religion':
        return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <section className="mb-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Habits</CardTitle>
              <CardDescription>Track your daily habits and build streaks</CardDescription>
            </div>
            <Button onClick={navigateToHabits} size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              <span>View All</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {habits.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-2">No habits created yet</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={navigateToHabits}
              >
                Create Your First Habit
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {habits.slice(0, 3).map(habit => (
                <Card 
                  key={habit.id} 
                  className={cn(
                    "border overflow-hidden group hover:border-primary/30 transition-colors",
                    habit.status === "completed" && "border-success/30 bg-success/5"
                  )}
                >
                  <CardContent className="p-3 py-[14px]">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center
                            ${habit.status === "completed" ? 'bg-success/20' : 'bg-muted/30'}
                          `}>
                          <CheckCircle className={`h-5 w-5 
                              ${habit.status === "completed" ? 'text-success' : 'text-muted-foreground/50'}
                            `} />
                        </div>
                        <div>
                          <h4 className="font-medium">{habit.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{habit.duration}</span>
                            <span className="flex items-center gap-1">
                              <Award className="h-3.5 w-3.5 text-orange-500" />
                              <span>{habit.streak} day streak</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        {habit.status === "pending" ? (
                          <Button 
                            size="sm" 
                            onClick={() => completeHabit(habit.id)} 
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Complete
                          </Button>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-success/20 text-success">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-4 flex justify-center">
            <Button variant="outline" onClick={navigateToHabits}>
              View All Habits
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default HabitsSection;
