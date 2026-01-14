import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useSecureHabitsStorage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasSynced, setHasSynced] = useState(false);

  // Migrate local habits to Supabase
  const migrateLocalHabits = useCallback(async () => {
    if (!user || hasSynced) return;

    try {
      const localHabits = localStorage.getItem('habits');
      if (!localHabits) return;

      const parsed = JSON.parse(localHabits) as any[];
      if (parsed.length === 0) return;

      // Check if we already have habits in Supabase
      const { data: existingHabits } = await supabase
        .from('habits')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (existingHabits && existingHabits.length > 0) {
        // Already have habits in Supabase, don't overwrite
        return;
      }

      // Upload local habits to Supabase
      for (const habit of parsed) {
        await supabase.from('habits').insert({
          user_id: user.id,
          title: habit.title,
          category: habit.category || 'other',
          streak: habit.streak || 0,
          target: habit.dailyTarget || habit.target || 1,
          status: habit.status || 'pending',
          completion_dates: JSON.stringify(habit.completionDates || []),
          type: habit.type || 'daily',
          duration: habit.duration,
          score_value: habit.scoreValue,
          penalty_value: habit.penaltyValue
        });
      }

      console.log(`Migrated ${parsed.length} habits to Supabase`);
    } catch (error) {
      console.error('Error migrating local habits to Supabase:', error);
    }
  }, [user, hasSynced]);

  const loadHabits = useCallback(async () => {
    if (!user) {
      // Fall back to localStorage when not authenticated
      try {
        const storedHabits = localStorage.getItem('habits');
        if (storedHabits) {
          const parsedHabits = JSON.parse(storedHabits);
          const habitsWithDates = parsedHabits.map((habit: any) => ({
            ...habit,
            createdAt: habit.createdAt ? new Date(habit.createdAt) : new Date(),
            completionDates: (habit.completionDates || []).map((date: string) => new Date(date)),
            completionHistory: (habit.completionHistory || []).map((h: any) => ({
              ...h,
              date: new Date(h.date)
            }))
          }));
          setHabits(habitsWithDates);
        }
      } catch (error) {
        console.error('Failed to load habits from localStorage:', error);
      }
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedHabits: Habit[] = (data || []).map(habit => {
        let completionDates: Date[] = [];
        try {
          const parsed = typeof habit.completion_dates === 'string' 
            ? JSON.parse(habit.completion_dates) 
            : habit.completion_dates;
          completionDates = (parsed || []).map((date: string) => new Date(date));
        } catch (e) {
          console.error('Error parsing completion dates:', e);
        }

        return {
          id: habit.id,
          title: habit.title,
          category: habit.category as HabitCategory,
          streak: habit.streak || 0,
          target: habit.target || 1,
          dailyTarget: habit.target || 1,
          status: (habit.status || 'pending') as "completed" | "pending" | "missed" | "partial",
          completionDates,
          type: (habit.type || 'daily') as "daily" | "weekly" | "monthly",
          createdAt: new Date(habit.created_at || Date.now()),
          duration: habit.duration || undefined,
          scoreValue: habit.score_value || undefined,
          penaltyValue: habit.penalty_value || undefined,
          todayCompletions: 0,
          completionHistory: []
        };
      });

      setHabits(formattedHabits);
      setHasSynced(true);
    } catch (error) {
      console.error('Error loading habits:', error);
      // Fall back to localStorage
      try {
        const storedHabits = localStorage.getItem('habits');
        if (storedHabits) {
          const parsedHabits = JSON.parse(storedHabits);
          const habitsWithDates = parsedHabits.map((habit: any) => ({
            ...habit,
            createdAt: habit.createdAt ? new Date(habit.createdAt) : new Date(),
            completionDates: (habit.completionDates || []).map((date: string) => new Date(date))
          }));
          setHabits(habitsWithDates);
        }
      } catch (e) {
        console.error('Failed to load habits from localStorage:', e);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      migrateLocalHabits().then(() => loadHabits());
    } else {
      loadHabits();
    }
  }, [user, loadHabits, migrateLocalHabits]);

  const addHabit = async (habit: Omit<Habit, 'id'>) => {
    if (!user) {
      // Save to localStorage when not authenticated
      const newHabit: Habit = {
        ...habit,
        id: `habit-${Date.now()}`,
      };
      const updatedHabits = [...habits, newHabit];
      setHabits(updatedHabits);
      localStorage.setItem('habits', JSON.stringify(updatedHabits));
      return newHabit;
    }

    try {
      const { data, error } = await supabase
        .from('habits')
        .insert({
          user_id: user.id,
          title: habit.title,
          category: habit.category,
          streak: habit.streak || 0,
          target: habit.dailyTarget || habit.target || 1,
          status: habit.status || 'pending',
          completion_dates: JSON.stringify(habit.completionDates || []),
          type: habit.type || 'daily',
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
        dailyTarget: data.target || 1,
        status: (data.status || 'pending') as "completed" | "pending" | "missed" | "partial",
        completionDates: [],
        type: (data.type || 'daily') as "daily" | "weekly" | "monthly",
        createdAt: new Date(data.created_at || Date.now()),
        duration: data.duration || undefined,
        scoreValue: data.score_value || undefined,
        penaltyValue: data.penalty_value || undefined,
        todayCompletions: 0,
        completionHistory: []
      };

      setHabits(prev => [newHabit, ...prev]);
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
    if (!user) {
      // Update in localStorage when not authenticated
      const updatedHabits = habits.map(habit => 
        habit.id === id ? { ...habit, ...updates } : habit
      );
      setHabits(updatedHabits);
      localStorage.setItem('habits', JSON.stringify(updatedHabits));
      return;
    }

    try {
      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.streak !== undefined) updateData.streak = updates.streak;
      if (updates.target !== undefined) updateData.target = updates.target;
      if (updates.dailyTarget !== undefined) updateData.target = updates.dailyTarget;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.type !== undefined) updateData.type = updates.type;
      if (updates.duration !== undefined) updateData.duration = updates.duration;
      if (updates.scoreValue !== undefined) updateData.score_value = updates.scoreValue;
      if (updates.penaltyValue !== undefined) updateData.penalty_value = updates.penaltyValue;
      if (updates.completionDates !== undefined) {
        updateData.completion_dates = JSON.stringify(updates.completionDates);
      }
      
      const { error } = await supabase
        .from('habits')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setHabits(prev => prev.map(habit => 
        habit.id === id ? { ...habit, ...updates } : habit
      ));
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
    if (!user) {
      // Delete from localStorage when not authenticated
      const updatedHabits = habits.filter(habit => habit.id !== id);
      setHabits(updatedHabits);
      localStorage.setItem('habits', JSON.stringify(updatedHabits));
      return;
    }

    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setHabits(prev => prev.filter(habit => habit.id !== id));
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast({
        title: "Error", 
        description: "Failed to delete habit",
        variant: "destructive"
      });
    }
  };

  const markHabitComplete = async (id: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const dailyTarget = habit.dailyTarget || 1;
    const todayCompletions = (habit.todayCompletions || 0) + 1;
    const isFullyCompleted = todayCompletions >= dailyTarget;
    
    const alreadyHasEntryToday = habit.completionDates.some(date => {
      const completionDate = new Date(date);
      completionDate.setHours(0, 0, 0, 0);
      return completionDate.getTime() === today.getTime();
    });

    const completionHistory = habit.completionHistory || [];
    const todayHistoryIndex = completionHistory.findIndex(h => {
      const historyDate = new Date(h.date);
      historyDate.setHours(0, 0, 0, 0);
      return historyDate.getTime() === today.getTime();
    });
    
    let updatedHistory: HabitCompletion[];
    if (todayHistoryIndex >= 0) {
      updatedHistory = completionHistory.map((h, i) => 
        i === todayHistoryIndex ? { ...h, count: h.count + 1 } : h
      );
    } else {
      updatedHistory = [...completionHistory, { date: today, count: 1 }];
    }

    const updates: Partial<Habit> = {
      completionDates: alreadyHasEntryToday ? habit.completionDates : [...habit.completionDates, today],
      todayCompletions,
      completionHistory: updatedHistory,
      streak: isFullyCompleted && !alreadyHasEntryToday ? habit.streak + 1 : habit.streak,
      status: isFullyCompleted ? "completed" : "partial"
    };

    await updateHabit(id, updates);
  };

  const markHabitMissed = async (id: string) => {
    await updateHabit(id, { streak: 0, status: "missed" });
  };

  return {
    habits,
    loading,
    addHabit,
    updateHabit,
    deleteHabit,
    markHabitComplete,
    markHabitMissed,
    refresh: loadHabits,
    isAuthenticated: !!user
  };
};
