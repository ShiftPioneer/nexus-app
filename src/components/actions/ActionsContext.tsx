import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { useLocalStorage } from "@/hooks/use-local-storage";
import { toastHelpers } from "@/utils/toast-helpers";
import { useGamification } from "@/hooks/use-gamification";
import { ConfettiEffect } from "@/components/ui/confetti-effect";
import { MilestoneBanner } from "@/components/ui/milestone-banner";
import { LevelUpBadge } from "@/components/ui/level-up-badge";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  dueDate?: Date;
  createdAt: Date;
  tags?: string[];
  type: 'todo' | 'not-todo';
  deleted?: boolean;
  deletedAt?: Date;
}

interface ActionsContextType {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  activeTasks: Task[];
  deletedTasks: Task[];
  todoTasks: Task[];
  notTodoTasks: Task[];
  handleTaskComplete: (taskId: string) => void;
  handleTaskEdit: (task: Task) => void;
  handleTaskDelete: (taskId: string) => void;
  handleTaskRestore: (taskId: string) => void;
  handleTaskPermanentDelete: (taskId: string) => void;
  handleCreateTask: (taskData: Partial<Task>, taskType: 'todo' | 'not-todo') => void;
}

const ActionsContext = createContext<ActionsContextType | undefined>(undefined);

export const useActions = () => {
  const context = useContext(ActionsContext);
  if (!context) {
    throw new Error('useActions must be used within an ActionsProvider');
  }
  return context;
};

export const ActionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  const { rewardTaskComplete, levelUp, clearLevelUp, XP_REWARDS } = useGamification();
  
  // Celebration state
  const [showConfetti, setShowConfetti] = useState(false);
  const [milestone, setMilestone] = useState<{ title: string; description: string } | null>(null);

  const activeTasks = tasks.filter(task => !task.deleted);
  const deletedTasks = tasks.filter(task => task.deleted);
  const todoTasks = activeTasks.filter(task => task.type === 'todo');
  const notTodoTasks = activeTasks.filter(task => task.type === 'not-todo');

  const handleTaskComplete = useCallback((taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    const wasCompleted = task?.completed;
    
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));

    // If completing (not uncompleting), trigger celebrations
    if (!wasCompleted && task) {
      // Show confetti for completion
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      
      // Award XP
      rewardTaskComplete();
      toastHelpers.xpGained(XP_REWARDS.taskComplete, `"${task.title}" completed!`);
      
      // Check for milestone (every 5 tasks)
      const completedCount = todoTasks.filter(t => t.completed).length + 1;
      if (completedCount % 5 === 0) {
        setMilestone({
          title: `${completedCount} Tasks Completed!`,
          description: "You're on fire! Keep up the amazing momentum."
        });
      }
    }
  }, [tasks, setTasks, rewardTaskComplete, XP_REWARDS, todoTasks]);

  const handleTaskEdit = (task: Task) => {
    // This will be handled by the parent component
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, deleted: true, deletedAt: new Date() } : task
    ));
  };

  const handleTaskRestore = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, deleted: false, deletedAt: undefined } : task
    ));
  };

  const handleTaskPermanentDelete = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleCreateTask = (taskData: Partial<Task>, taskType: 'todo' | 'not-todo') => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title || '',
      description: taskData.description || '',
      completed: false,
      priority: taskData.priority || 'medium',
      category: taskData.category || 'General',
      createdAt: new Date(),
      tags: taskData.tags || [],
      type: taskType,
      dueDate: taskData.dueDate,
      deleted: false
    };
    setTasks([...tasks, newTask]);
  };

  return (
    <ActionsContext.Provider value={{
      tasks,
      setTasks,
      activeTasks,
      deletedTasks,
      todoTasks,
      notTodoTasks,
      handleTaskComplete,
      handleTaskEdit,
      handleTaskDelete,
      handleTaskRestore,
      handleTaskPermanentDelete,
      handleCreateTask
    }}>
      {children}
      
      {/* Celebration Effects */}
      <ConfettiEffect active={showConfetti} />
      
      <MilestoneBanner
        title={milestone?.title || ""}
        description={milestone?.description}
        visible={!!milestone}
        onClose={() => setMilestone(null)}
        variant="gold"
      />
      
      {levelUp && (
        <LevelUpBadge
          level={levelUp}
          visible={!!levelUp}
          onClose={clearLevelUp}
        />
      )}
    </ActionsContext.Provider>
  );
};
