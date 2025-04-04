
import React, { createContext, useContext, useState, ReactNode } from "react";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
  dueDate?: Date;
  dueTime?: string;
  tags?: string[];
}

interface TaskContextProps {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  getTodaysTasks: () => Task[];
  getCompletionRate: () => number;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: "1", 
      title: "Complete quarterly goal planning", 
      completed: false, 
      priority: "high",
      dueTime: "11:00 AM",
      dueDate: new Date()
    },
    { 
      id: "2", 
      title: "Review habit tracking data", 
      completed: false, 
      priority: "medium",
      dueTime: "2:30 PM",
      dueDate: new Date()
    },
    { 
      id: "3", 
      title: "Journal entry for the day", 
      completed: false, 
      priority: "medium",
      dueDate: new Date()
    },
    { 
      id: "4", 
      title: "30 minutes meditation session", 
      completed: true, 
      priority: "high",
      dueDate: new Date()
    },
    { 
      id: "5", 
      title: "Update progress on fitness goal", 
      completed: true, 
      priority: "low",
      dueDate: new Date()
    },
  ]);

  const addTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const completeTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: true } : task
    ));
  };

  const getTodaysTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      
      return taskDate.getTime() === today.getTime();
    });
  };

  const getCompletionRate = () => {
    const todayTasks = getTodaysTasks();
    if (todayTasks.length === 0) return 0;
    
    const completed = todayTasks.filter(task => task.completed).length;
    return completed / todayTasks.length;
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        getTodaysTasks,
        getCompletionRate
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
