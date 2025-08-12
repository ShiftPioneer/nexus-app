import { useState, useEffect } from "react";

export const useHabitsStorage = () => {
  const [habits, setHabits] = useState<Habit[]>([]);

  // Load habits from localStorage on mount
  useEffect(() => {
    try {
      const storedHabits = localStorage.getItem('habits');
      if (storedHabits) {
        const parsedHabits = JSON.parse(storedHabits);
        // Convert date strings back to Date objects
        const habitsWithDates = parsedHabits.map((habit: any) => ({
          ...habit,
          createdAt: new Date(habit.createdAt),
          completionDates: habit.completionDates.map((date: string) => new Date(date))
        }));
        setHabits(habitsWithDates);
      }
    } catch (error) {
      console.error('Failed to load habits from localStorage:', error);
    }
  }, []);

  // Save habits to localStorage whenever habits change
  useEffect(() => {
    try {
      localStorage.setItem('habits', JSON.stringify(habits));
    } catch (error) {
      console.error('Failed to save habits to localStorage:', error);
    }
  }, [habits]);

  const addHabit = (habit: Habit) => {
    setHabits(prev => [...prev, habit]);
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits(prev => 
      prev.map(habit => 
        habit.id === id ? { ...habit, ...updates } : habit
      )
    );
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
  };

  const markHabitComplete = (id: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    setHabits(prev => 
      prev.map(habit => {
        if (habit.id === id) {
          const alreadyCompletedToday = habit.completionDates.some(date => {
            const completionDate = new Date(date);
            completionDate.setHours(0, 0, 0, 0);
            return completionDate.getTime() === today.getTime();
          });

          if (!alreadyCompletedToday) {
            return {
              ...habit,
              completionDates: [...habit.completionDates, today],
              streak: habit.streak + 1,
              status: "completed" as const
            };
          }
        }
        return habit;
      })
    );
  };

  const markHabitMissed = (id: string) => {
    setHabits(prev => 
      prev.map(habit => 
        habit.id === id ? { ...habit, streak: 0, status: "missed" as const } : habit
      )
    );
  };

  return {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    markHabitComplete,
    markHabitMissed
  };
};