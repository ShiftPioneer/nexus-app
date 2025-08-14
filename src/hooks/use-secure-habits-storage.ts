import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useSecureHabitsStorage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadHabits();
    } else {
      setHabits([]);
      setLoading(false);
    }
  }, [user]);

  const loadHabits = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedHabits = data?.map(habit => ({
        id: habit.id,
        title: habit.title,
        category: habit.category as HabitCategory,
        streak: habit.streak || 0,
        target: habit.target || 1,
        status: habit.status as "completed" | "pending" | "missed",
        completionDates: JSON.parse(habit.completion_dates as string).map((date: string) => new Date(date)),
        type: habit.type as "daily" | "weekly" | "monthly",
        createdAt: new Date(habit.created_at),
        duration: habit.duration,
        scoreValue: habit.score_value,
        penaltyValue: habit.penalty_value
      })) || [];

      setHabits(formattedHabits);
    } catch (error) {
      console.error('Error loading habits:', error);
      toast({
        title: "Error",
        description: "Failed to load habits",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async (habit: Omit<Habit, 'id'>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save habits",
        variant: "destructive"
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('habits')
        .insert({
          user_id: user.id,
          title: habit.title,
          category: habit.category,
          streak: habit.streak,
          target: habit.target,
          status: habit.status,
          completion_dates: JSON.stringify(habit.completionDates),
          type: habit.type,
          duration: habit.duration,
          score_value: habit.scoreValue,
          penalty_value: habit.penaltyValue
        })
        .select()
        .single();

      if (error) throw error;

      const newHabit: Habit = {
        id: data.id,
        title: data.title,
        category: data.category as HabitCategory,
        streak: data.streak || 0,
        target: data.target || 1,
        status: data.status as "completed" | "pending" | "missed",
        completionDates: JSON.parse(data.completion_dates as string).map((date: string) => new Date(date)),
        type: data.type as "daily" | "weekly" | "monthly",
        createdAt: new Date(data.created_at),
        duration: data.duration,
        scoreValue: data.score_value,
        penaltyValue: data.penalty_value
      };

      setHabits(prev => [newHabit, ...prev]);
      
      toast({
        title: "Success",
        description: "Habit saved securely",
      });

      return newHabit;
    } catch (error) {
      console.error('Error adding habit:', error);
      toast({
        title: "Error",
        description: "Failed to save habit",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateHabit = async (id: string, updates: Partial<Habit>) => {
    if (!user) return;

    try {
      const updateData: any = { ...updates };
      if (updates.completionDates) {
        updateData.completion_dates = JSON.stringify(updates.completionDates);
      }
      
      const { data, error } = await supabase
        .from('habits')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      const updatedHabit: Habit = {
        id: data.id,
        title: data.title,
        category: data.category as HabitCategory,
        streak: data.streak || 0,
        target: data.target || 1,
        status: data.status as "completed" | "pending" | "missed",
        completionDates: JSON.parse(data.completion_dates as string).map((date: string) => new Date(date)),
        type: data.type as "daily" | "weekly" | "monthly",
        createdAt: new Date(data.created_at),
        duration: data.duration,
        scoreValue: data.score_value,
        penaltyValue: data.penalty_value
      };

      setHabits(prev => prev.map(habit => 
        habit.id === id ? updatedHabit : habit
      ));

      toast({
        title: "Success",
        description: "Habit updated",
      });
    } catch (error) {
      console.error('Error updating habit:', error);
      toast({
        title: "Error",
        description: "Failed to update habit",
        variant: "destructive"
      });
    }
  };

  const deleteHabit = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setHabits(prev => prev.filter(habit => habit.id !== id));
      
      toast({
        title: "Success",
        description: "Habit deleted",
      });
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast({
        title: "Error", 
        description: "Failed to delete habit",
        variant: "destructive"
      });
    }
  };

  return {
    habits,
    loading,
    addHabit,
    updateHabit,
    deleteHabit,
    refresh: loadHabits
  };
};