import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Goal, Milestone } from "@/types/planning";

interface GoalContextProps {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, "id">) => string;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  getGoalsProgress: () => number;
  addSubGoal: (parentId: string, subGoal: Omit<Goal, "id" | "parentGoalId">) => void;
  getGoalById: (id: string) => Goal | undefined;
  toggleGoalPin: (id: string) => void;
  addMilestone: (goalId: string, milestone: Omit<Milestone, "id">) => void;
  updateMilestone: (goalId: string, milestoneId: string, updates: Partial<Milestone>) => void;
  deleteMilestone: (goalId: string, milestoneId: string) => void;
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
  const [goals, setGoals] = useState<Goal[]>(() => {
    // Try to get goals from local storage
    const savedGoals = localStorage.getItem('goals');
    if (savedGoals) {
      try {
        const parsedGoals = JSON.parse(savedGoals);
        // Ensure dates are Date objects
        return parsedGoals.map((goal: any) => ({
          ...goal,
          startDate: new Date(goal.startDate),
          endDate: new Date(goal.endDate),
          milestones: goal.milestones ? goal.milestones.map((m: any) => ({
            ...m,
            dueDate: new Date(m.dueDate)
          })) : []
        }));
      } catch (e) {
        console.error("Error parsing goals from local storage:", e);
        return getDefaultGoals();
      }
    }
    return getDefaultGoals();
  });

  // Save goals to local storage when they change
  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  function getDefaultGoals(): Goal[] {
    return [
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
        status: "in-progress",
        pinned: true
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
        status: "in-progress",
        pinned: false
      }
    ];
  }

  // Calculate progress for a goal based on milestones
  const calculateGoalProgress = (goal: Goal): number => {
    // If there are no milestones, return the current progress value
    if (!goal.milestones || goal.milestones.length === 0) {
      // If there are subgoals, calculate based on them
      if (goal.subGoals && goal.subGoals.length > 0) {
        const subGoalProgress = goal.subGoals.reduce((sum, subGoal) => {
          return sum + calculateGoalProgress(subGoal);
        }, 0);
        return subGoalProgress / goal.subGoals.length;
      }
      return goal.progress;
    }

    // Calculate based on completed milestones
    const totalMilestones = goal.milestones.length;
    const completedMilestones = goal.milestones.filter(m => m.completed).length;
    
    // Calculate percentage
    return Math.round((completedMilestones / totalMilestones) * 100);
  };

  // Update all goal progress
  const updateAllGoalProgress = () => {
    setGoals(prevGoals => {
      const updateGoalAndSubgoals = (goal: Goal): Goal => {
        // Calculate progress for this goal
        const progress = calculateGoalProgress(goal);
        
        // Update subgoals recursively if they exist
        const updatedSubGoals = goal.subGoals ? 
          goal.subGoals.map(subGoal => updateGoalAndSubgoals(subGoal)) : 
          undefined;
        
        return {
          ...goal,
          progress,
          subGoals: updatedSubGoals
        };
      };
      
      return prevGoals.map(goal => updateGoalAndSubgoals(goal));
    });
  };

  // Recalculate all goal progress when milestones or subgoals change
  useEffect(() => {
    updateAllGoalProgress();
  }, []);

  const addGoal = (goal: Omit<Goal, "id">): string => {
    const newId = uuidv4();
    const newGoal: Goal = {
      ...goal,
      id: newId
    };
    
    setGoals(prev => [...prev, newGoal]);
    return newId;
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prevGoals => {
      const updateGoalById = (goals: Goal[]): Goal[] => {
        return goals.map(goal => {
          if (goal.id === id) {
            return { ...goal, ...updates };
          }
          
          // Check subgoals recursively
          if (goal.subGoals) {
            return {
              ...goal,
              subGoals: updateGoalById(goal.subGoals)
            };
          }
          
          return goal;
        });
      };
      
      return updateGoalById(prevGoals);
    });

    // Update progress after updates
    updateAllGoalProgress();
  };

  const deleteGoal = (id: string) => {
    setGoals(prevGoals => {
      const removeGoalById = (goals: Goal[]): Goal[] => {
        return goals.filter(goal => {
          if (goal.id === id) {
            return false;
          }
          
          // Keep filtering subgoals recursively
          if (goal.subGoals) {
            return {
              ...goal,
              subGoals: removeGoalById(goal.subGoals)
            };
          }
          
          return true;
        });
      };
      
      return removeGoalById(prevGoals);
    });
  };

  const addSubGoal = (parentId: string, subGoal: Omit<Goal, "id" | "parentGoalId">) => {
    const newSubGoalId = uuidv4();
    
    setGoals(prevGoals => {
      const addSubGoalToParent = (goals: Goal[]): Goal[] => {
        return goals.map(goal => {
          if (goal.id === parentId) {
            const newSubGoal: Goal = {
              ...subGoal,
              id: newSubGoalId,
              parentGoalId: parentId
            };
            
            const updatedSubGoals = goal.subGoals ? [...goal.subGoals, newSubGoal] : [newSubGoal];
            
            return {
              ...goal,
              subGoals: updatedSubGoals
            };
          }
          
          // Check subgoals recursively
          if (goal.subGoals) {
            return {
              ...goal,
              subGoals: addSubGoalToParent(goal.subGoals)
            };
          }
          
          return goal;
        });
      };
      
      return addSubGoalToParent(prevGoals);
    });

    // Update progress after adding a subgoal
    updateAllGoalProgress();
  };

  const getGoalById = (id: string): Goal | undefined => {
    const findGoalById = (goals: Goal[]): Goal | undefined => {
      for (const goal of goals) {
        if (goal.id === id) {
          return goal;
        }
        
        if (goal.subGoals) {
          const foundInSubgoals = findGoalById(goal.subGoals);
          if (foundInSubgoals) {
            return foundInSubgoals;
          }
        }
      }
      
      return undefined;
    };
    
    return findGoalById(goals);
  };

  const toggleGoalPin = (id: string) => {
    setGoals(prevGoals => {
      const togglePin = (goals: Goal[]): Goal[] => {
        return goals.map(goal => {
          if (goal.id === id) {
            return { ...goal, pinned: !goal.pinned };
          }
          
          // Check subgoals recursively
          if (goal.subGoals) {
            return {
              ...goal,
              subGoals: togglePin(goal.subGoals)
            };
          }
          
          return goal;
        });
      };
      
      return togglePin(prevGoals);
    });
  };

  const addMilestone = (goalId: string, milestone: Omit<Milestone, "id">) => {
    setGoals(prevGoals => {
      const addMilestoneToGoal = (goals: Goal[]): Goal[] => {
        return goals.map(goal => {
          if (goal.id === goalId) {
            const newMilestone: Milestone = {
              ...milestone,
              id: uuidv4()
            };
            
            const updatedMilestones = goal.milestones ? [...goal.milestones, newMilestone] : [newMilestone];
            
            return {
              ...goal,
              milestones: updatedMilestones
            };
          }
          
          // Check subgoals recursively
          if (goal.subGoals) {
            return {
              ...goal,
              subGoals: addMilestoneToGoal(goal.subGoals)
            };
          }
          
          return goal;
        });
      };
      
      return addMilestoneToGoal(prevGoals);
    });

    // Update progress after adding a milestone
    updateAllGoalProgress();
  };

  const updateMilestone = (goalId: string, milestoneId: string, updates: Partial<Milestone>) => {
    setGoals(prevGoals => {
      const updateMilestoneInGoal = (goals: Goal[]): Goal[] => {
        return goals.map(goal => {
          if (goal.id === goalId && goal.milestones) {
            const updatedMilestones = goal.milestones.map(m => 
              m.id === milestoneId ? { ...m, ...updates } : m
            );
            
            return {
              ...goal,
              milestones: updatedMilestones
            };
          }
          
          // Check subgoals recursively
          if (goal.subGoals) {
            return {
              ...goal,
              subGoals: updateMilestoneInGoal(goal.subGoals)
            };
          }
          
          return goal;
        });
      };
      
      return updateMilestoneInGoal(prevGoals);
    });

    // Update progress after milestone update
    updateAllGoalProgress();
  };

  const deleteMilestone = (goalId: string, milestoneId: string) => {
    setGoals(prevGoals => {
      const deleteMilestoneFromGoal = (goals: Goal[]): Goal[] => {
        return goals.map(goal => {
          if (goal.id === goalId && goal.milestones) {
            const updatedMilestones = goal.milestones.filter(m => m.id !== milestoneId);
            
            return {
              ...goal,
              milestones: updatedMilestones
            };
          }
          
          // Check subgoals recursively
          if (goal.subGoals) {
            return {
              ...goal,
              subGoals: deleteMilestoneFromGoal(goal.subGoals)
            };
          }
          
          return goal;
        });
      };
      
      return deleteMilestoneFromGoal(prevGoals);
    });

    // Update progress after deleting a milestone
    updateAllGoalProgress();
  };

  const getGoalsProgress = () => {
    if (goals.length === 0) return 0;
    
    // Only consider active goals
    const activeGoals = goals.filter(g => g.status === "in-progress" || g.status === "not-started");
    if (activeGoals.length === 0) return 0;
    
    const totalProgress = activeGoals.reduce((sum, goal) => sum + goal.progress, 0);
    return totalProgress / activeGoals.length;
  };

  return (
    <GoalContext.Provider
      value={{
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        getGoalsProgress,
        addSubGoal,
        getGoalById,
        toggleGoalPin,
        addMilestone,
        updateMilestone,
        deleteMilestone
      }}
    >
      {children}
    </GoalContext.Provider>
  );
};
