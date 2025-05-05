
import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useHabitsReset } from "@/hooks/use-habits-reset";
import HabitList from "@/components/habits/HabitList";
import HabitForm from "@/components/habits/HabitForm";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { loadFromStorage, saveToStorage } from "@/hooks/use-persistence";

// Define the Habit interface
interface Habit {
  id: string;
  title: string;
  category: string;
  streak: number;
  target: number;
  status: "completed" | "pending" | "missed";
  type: "daily" | "weekly" | "monthly";
  completedToday: boolean;
  accountabilityScore: number;
}

const Habits = () => {
  // Use our habit reset hook
  useHabitsReset();

  const [habits, setHabits] = useState<Habit[]>(() => loadFromStorage('habits', []));
  const [showHabitForm, setShowHabitForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    saveToStorage('habits', habits);
  }, [habits]);

  const addHabit = (habit: Habit) => {
    const newHabit = { ...habit, id: Date.now().toString(), completedToday: false, accountabilityScore: 0 };
    setHabits([newHabit, ...habits]);
    setShowHabitForm(false);
    toast({
      title: "Habit Added",
      description: "Your new habit has been added successfully."
    });
  };

  const toggleHabitCompletion = (id: string) => {
    const updatedHabits = habits.map(habit =>
      habit.id === id ? { ...habit, completedToday: !habit.completedToday, accountabilityScore: habit.completedToday ? habit.accountabilityScore - 1 : habit.accountabilityScore + 1 } : habit
    );
    setHabits(updatedHabits);
  };

  const deleteHabit = (id: string) => {
    const updatedHabits = habits.filter(habit => habit.id !== id);
    setHabits(updatedHabits);
    toast({
      title: "Habit Deleted",
      description: "Your habit has been deleted successfully."
    });
  };

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Habits</h1>
            <p className="text-muted-foreground">Track your habits and build a better you</p>
          </div>
          <Button onClick={() => setShowHabitForm(true)} className="gap-2">
            <Plus size={16} />
            Add Habit
          </Button>
        </div>

        {habits.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <p className="text-muted-foreground mb-4">No habits yet. Start building your success by adding a new habit.</p>
              <Button onClick={() => setShowHabitForm(true)}>Add Your First Habit</Button>
            </CardContent>
          </Card>
        ) : (
          <HabitList habits={habits} toggleHabitCompletion={toggleHabitCompletion} deleteHabit={deleteHabit} />
        )}

        <HabitForm open={showHabitForm} onOpenChange={setShowHabitForm} addHabit={addHabit} />
      </div>
    </AppLayout>
  );
};

export default Habits;
