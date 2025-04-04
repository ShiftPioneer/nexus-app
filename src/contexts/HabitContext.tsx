
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Habit {
  id: string;
  title: string;
  streak: number;
  target: number;
  status: "completed" | "pending" | "missed";
  category: "health" | "productivity" | "mindfulness" | "personal" | "religion" | "other";
  duration?: string;
  completedDates?: Date[];
}

interface HabitContextProps {
  habits: Habit[];
  dailyStreak: number;
  addHabit: (habit: Habit) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  completeHabit: (id: string) => void;
  calculateDailyStreak: () => number;
}

const HabitContext = createContext<HabitContextProps | undefined>(undefined);

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error("useHabits must be used within a HabitProvider");
  }
  return context;
};

interface HabitProviderProps {
  children: ReactNode;
}

export const HabitProvider: React.FC<HabitProviderProps> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: "1",
      title: "Daily Meditation",
      streak: 7,
      target: 10,
      status: "completed",
      category: "mindfulness",
      duration: "10 minutes",
      completedDates: Array.from({length: 7}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d;
      })
    },
    {
      id: "2",
      title: "Morning Exercise",
      streak: 3,
      target: 5,
      status: "pending",
      category: "health",
      duration: "30 minutes",
      completedDates: Array.from({length: 3}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i - 1);
        return d;
      })
    },
    {
      id: "3",
      title: "Read",
      streak: 12,
      target: 30,
      status: "pending",
      category: "personal",
      duration: "20 pages",
      completedDates: Array.from({length: 12}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i - 1);
        return d;
      })
    }
  ]);
  
  const [dailyStreak, setDailyStreak] = useState<number>(0);

  useEffect(() => {
    const streak = calculateDailyStreak();
    setDailyStreak(streak);
  }, [habits]);

  const addHabit = (habit: Habit) => {
    setHabits(prev => [...prev, habit]);
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id ? { ...habit, ...updates } : habit
    ));
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
  };

  const completeHabit = (id: string) => {
    setHabits(prev => {
      return prev.map(habit => {
        if (habit.id === id) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          // Check if already completed today
          const alreadyCompletedToday = habit.completedDates?.some(date => {
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);
            return d.getTime() === today.getTime();
          });
          
          if (alreadyCompletedToday) {
            return habit; // Already completed today, no change
          }
          
          const completedDates = [...(habit.completedDates || []), today];
          
          return {
            ...habit,
            status: "completed",
            streak: habit.streak + 1,
            completedDates
          };
        }
        return habit;
      });
    });
  };

  const calculateDailyStreak = () => {
    // Implement the daily streak calculation
    // A "streak" is defined as consecutive days where ALL habits were completed
    
    const dateMap = new Map<string, number>();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Count habits per day
    habits.forEach(habit => {
      if (habit.completedDates) {
        habit.completedDates.forEach(date => {
          const d = new Date(date);
          d.setHours(0, 0, 0, 0);
          const dateStr = d.toISOString().split('T')[0];
          dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1);
        });
      }
    });
    
    // Count how many days in a row ALL habits were completed
    let streak = 0;
    for (let i = 0; i <= 365; i++) { // Look back up to a year
      const checkDate = new Date();
      checkDate.setDate(today.getDate() - i);
      checkDate.setHours(0, 0, 0, 0);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      // If all habits were completed on this day
      if (dateMap.get(dateStr) === habits.length) {
        streak++;
      } else {
        break; // Streak is broken
      }
    }
    
    return streak;
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        dailyStreak,
        addHabit,
        updateHabit,
        deleteHabit,
        completeHabit,
        calculateDailyStreak
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};
