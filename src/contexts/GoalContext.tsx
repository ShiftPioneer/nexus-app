
import React, { createContext, useContext, useState, ReactNode } from "react";

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate: Date;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  category: "wealth" | "health" | "relationships" | "spirituality" | "education" | "career";
  timeframe: "week" | "month" | "quarter" | "year" | "decade" | "lifetime";
  progress: number;
  startDate: Date;
  endDate: Date;
  milestones: Milestone[];
  status: "not-started" | "in-progress" | "completed";
  blockingGoals?: string[];
  blockedByGoals?: string[];
  timeframeAnswers?: {
    questionIndex: number;
    answer: string;
  }[];
}

interface GoalContextProps {
  goals: Goal[];
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  getGoalsProgress: () => number;
}

const GoalContext = createContext<GoalContextProps | undefined>(undefined);

export const useGoals = () => {
  const context = useContext(GoalContext);
  if (!context) {
    throw new Error("useGoals must be used within a GoalProvider");
  }
  return context;
};

interface GoalProviderProps {
  children: ReactNode;
}

export const GoalProvider: React.FC<GoalProviderProps> = ({ children }) => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Run a 10K race",
      description: "Train for and complete a 10K race",
      category: "health",
      timeframe: "month",
      progress: 65,
      startDate: new Date(2023, 6, 1),
      endDate: new Date(2023, 6, 30),
      milestones: [
        {
          id: "1-1",
          title: "Complete 5K training program",
          completed: true,
          dueDate: new Date(2023, 6, 10)
        },
        {
          id: "1-2",
          title: "Run 8K without stopping",
          completed: true,
          dueDate: new Date(2023, 6, 20)
        },
        {
          id: "1-3",
          title: "Register for local 10K event",
          completed: false,
          dueDate: new Date(2023, 6, 25)
        },
        {
          id: "1-4",
          title: "Complete the race",
          completed: false,
          dueDate: new Date(2023, 6, 30)
        }
      ],
      status: "in-progress"
    },
    {
      id: "2",
      title: "Learn intermediate Spanish",
      description: "Reach B1 level in Spanish",
      category: "education",
      timeframe: "quarter",
      progress: 40,
      startDate: new Date(2023, 9, 1),
      endDate: new Date(2023, 11, 15),
      milestones: [
        {
          id: "2-1",
          title: "Complete beginner course",
          completed: true,
          dueDate: new Date(2023, 9, 30)
        },
        {
          id: "2-2",
          title: "Learn 500 common words",
          completed: true,
          dueDate: new Date(2023, 10, 15)
        },
        {
          id: "2-3",
          title: "Have a 5-minute conversation",
          completed: false,
          dueDate: new Date(2023, 11, 1)
        },
        {
          id: "2-4",
          title: "Pass intermediate exam",
          completed: false,
          dueDate: new Date(2023, 11, 15)
        }
      ],
      status: "in-progress"
    }
  ]);

  const addGoal = (goal: Goal) => {
    setGoals(prev => [...prev, goal]);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, ...updates } : goal
    ));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };

  const getGoalsProgress = () => {
    if (goals.length === 0) return 0;
    
    const totalProgress = goals.reduce((sum, goal) => sum + goal.progress, 0);
    return totalProgress / goals.length;
  };

  return (
    <GoalContext.Provider
      value={{
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        getGoalsProgress
      }}
    >
      {children}
    </GoalContext.Provider>
  );
};
