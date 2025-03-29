import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Plus, Award, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Habit {
  id: string;
  title: string;
  streak: number;
  target: number;
  status: "completed" | "pending" | "missed";
  category: "health" | "productivity" | "mindfulness" | "personal";
}

const HabitsSection = () => {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: "1",
      title: "Daily Meditation",
      streak: 7,
      target: 10,
      status: "completed",
      category: "mindfulness"
    },
    {
      id: "2",
      title: "Morning Exercise",
      streak: 3,
      target: 5,
      status: "pending",
      category: "health"
    },
    {
      id: "3",
      title: "Read 30 minutes",
      streak: 12,
      target: 30,
      status: "pending",
      category: "personal"
    },
    {
      id: "4",
      title: "Water Intake",
      streak: 5,
      target: 8,
      status: "pending",
      category: "health"
    }
  ]);

  const { toast } = useToast();
  
  const completeHabit = (id: string) => {
    setHabits(habits.map(habit =>
      habit.id === id ? 
        { 
          ...habit, 
          status: "completed", 
          streak: habit.streak + 1 
        } : habit
    ));
    
    const habit = habits.find(h => h.id === id);
    if (habit) {
      toast({
        title: "Habit Completed!",
        description: `${habit.title} completed for today.`,
      });
      
      // Check if streak milestone reached
      const updatedStreak = habit.streak + 1;
      if (updatedStreak === habit.target) {
        setTimeout(() => {
          toast({
            title: "Achievement Unlocked!",
            description: `You've reached your streak goal of ${habit.target} days for ${habit.title}!`,
            variant: "default",
          });
        }, 1000);
      }
    }
  };
  
  const addNewHabit = () => {
    toast({
      description: "Habit creation coming soon!",
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health':
        return 'bg-success/10 text-success';
      case 'productivity':
        return 'bg-primary/10 text-primary';
      case 'mindfulness':
        return 'bg-accent/10 text-accent';
      case 'personal':
        return 'bg-secondary/10 text-secondary';
      default:
        return 'bg-muted/10 text-muted-foreground';
    }
  };

  const pendingHabits = habits.filter(habit => habit.status === "pending");
  
  return (
    <section className="mb-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Daily Habits</CardTitle>
              <CardDescription>Track your consistency and build momentum</CardDescription>
            </div>
            <Button onClick={addNewHabit} size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              <span>New Habit</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {habits.map((habit) => (
              <Card 
                key={habit.id} 
                className={cn(
                  "border overflow-hidden group hover:border-primary/30 transition-colors",
                  habit.status === "completed" && "border-success/30 bg-success/5"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div 
                        className={`h-10 w-10 rounded-full flex items-center justify-center
                          ${habit.status === "completed" ? 'bg-success/20' : 'bg-muted/30'}
                        `}
                      >
                        <CheckCircle 
                          className={`h-5 w-5 
                            ${habit.status === "completed" ? 'text-success' : 'text-muted-foreground/50'}
                          `} 
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{habit.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Award className="h-3.5 w-3.5 text-energy" />
                          <span className="text-xs text-muted-foreground">
                            {habit.streak} day streak
                          </span>
                          <span className="text-xs px-1.5 py-0.5 rounded-full text-muted-foreground bg-muted/30">
                            {habit.target} day goal
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      {habit.status === "pending" ? (
                        <Button 
                          size="sm" 
                          variant="outline"
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

                  <div className="mt-3">
                    <div className="progress-bar-bg">
                      <div 
                        className="progress-bar-fill"
                        style={{ 
                          width: `${(habit.streak / habit.target) * 100}%`,
                          backgroundColor: habit.category === 'health' ? '#39D98A' : 
                                        habit.category === 'productivity' ? '#FF6500' :
                                        habit.category === 'mindfulness' ? '#00D4FF' : '#024CAA'
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex justify-between items-center">
                    <div className={`px-2 py-0.5 rounded-full text-xs ${getCategoryColor(habit.category)}`}>
                      {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
                    </div>
                    
                    {habit.streak === (habit.target - 1) && habit.status === "pending" && (
                      <div className="text-xs text-energy flex items-center gap-1">
                        <span>1 more to reach your goal!</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-4 flex justify-center">
            <Button variant="outline" onClick={addNewHabit}>
              View All Habits
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default HabitsSection;
