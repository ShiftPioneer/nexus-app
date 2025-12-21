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
          const dailyTarget = habit.dailyTarget || 1;
          const todayCompletions = (habit.todayCompletions || 0) + 1;
          
          // Check if we've reached the daily target
          const isFullyCompleted = todayCompletions >= dailyTarget;
          
          // Only add to completionDates if this is the first completion today
          const alreadyHasEntryToday = habit.completionDates.some(date => {
            const completionDate = new Date(date);
            completionDate.setHours(0, 0, 0, 0);
            return completionDate.getTime() === today.getTime();
          });

          // Update completion history
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

          return {
            ...habit,
            completionDates: alreadyHasEntryToday ? habit.completionDates : [...habit.completionDates, today],
            todayCompletions,
            completionHistory: updatedHistory,
            streak: isFullyCompleted && !alreadyHasEntryToday ? habit.streak + 1 : habit.streak,
            status: isFullyCompleted ? "completed" as const : "partial" as const
          };
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