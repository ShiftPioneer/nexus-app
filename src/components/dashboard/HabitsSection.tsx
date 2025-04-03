import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Plus, Award, ArrowRight, Clock, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
interface Habit {
  id: string;
  title: string;
  streak: number;
  target: number;
  status: "completed" | "pending" | "missed";
  category: "health" | "productivity" | "mindfulness" | "personal" | "religion" | "other";
  duration?: string;
}
const HabitsSection = () => {
  const [habits, setHabits] = useState<Habit[]>([{
    id: "1",
    title: "Daily Meditation",
    streak: 7,
    target: 10,
    status: "completed",
    category: "mindfulness",
    duration: "10 minutes"
  }, {
    id: "2",
    title: "Morning Exercise",
    streak: 3,
    target: 5,
    status: "pending",
    category: "health",
    duration: "30 minutes"
  }, {
    id: "3",
    title: "Read",
    streak: 12,
    target: 30,
    status: "pending",
    category: "personal",
    duration: "20 pages"
  }]);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const completeHabit = (id: string) => {
    setHabits(habits.map(habit => habit.id === id ? {
      ...habit,
      status: "completed",
      streak: habit.streak + 1
    } : habit));
    const habit = habits.find(h => h.id === id);
    if (habit) {
      toast({
        title: "Habit Completed!",
        description: `${habit.title} completed for today.`
      });

      // Check if streak milestone reached
      const updatedStreak = habit.streak + 1;
      if (updatedStreak === habit.target) {
        setTimeout(() => {
          toast({
            title: "Achievement Unlocked!",
            description: `You've reached your streak goal of ${habit.target} days for ${habit.title}!`,
            variant: "default"
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
        return 'bg-green-100 text-green-600';
      case 'productivity':
        return 'bg-orange-100 text-orange-600';
      case 'mindfulness':
        return 'bg-blue-100 text-blue-600';
      case 'personal':
        return 'bg-purple-100 text-purple-600';
      case 'religion':
        return 'bg-amber-100 text-amber-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  const pendingHabits = habits.filter(habit => habit.status === "pending");
  return <section className="mb-6">
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
          <div className="space-y-2">
            {habits.slice(0, 3).map(habit => <Card key={habit.id} className={cn("border overflow-hidden group hover:border-primary/30 transition-colors", habit.status === "completed" && "border-success/30 bg-success/5")}>
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
                      {habit.status === "pending" ? <Button size="sm" onClick={e => completeHabit(habit.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                          Complete
                        </Button> : <span className="px-2 py-1 text-xs rounded-full bg-success/20 text-success">
                          Completed
                        </span>}
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>

          <div className="mt-4 flex justify-center">
            <Button variant="outline" onClick={navigateToHabits}>
              View All Habits
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>;
};
export default HabitsSection;