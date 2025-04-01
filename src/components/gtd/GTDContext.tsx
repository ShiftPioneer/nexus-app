
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type TaskPriority = "Very Low" | "Low" | "Medium" | "High" | "Very High";
export type TaskStatus = "inbox" | "next-action" | "project" | "waiting-for" | "someday" | "reference" | "completed" | "deleted" | "today";

export interface GTDTask {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: Date;
  createdAt: Date;
  tags?: string[];
  context?: string;
  project?: string;
  timeEstimate?: number;
  delegatedTo?: string;
}

interface GTDContextType {
  tasks: GTDTask[];
  addTask: (task: Omit<GTDTask, "id" | "createdAt">) => void;
  updateTask: (id: string, updates: Partial<GTDTask>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, newStatus: TaskStatus, newPriority?: TaskPriority) => void;
  activeView: "capture" | "clarify" | "organize" | "reflect" | "engage";
  setActiveView: (view: "capture" | "clarify" | "organize" | "reflect" | "engage") => void;
}

const GTDContext = createContext<GTDContextType | null>(null);

export const useGTD = () => {
  const context = useContext(GTDContext);
  if (!context) {
    throw new Error("useGTD must be used within a GTDProvider");
  }
  return context;
};

export const GTDProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<GTDTask[]>([
    {
      id: "1",
      title: "Review project proposal",
      description: "Need to check the details and provide feedback",
      priority: "Medium",
      status: "inbox",
      createdAt: new Date(),
      tags: ["work", "review"],
      context: "office"
    },
    {
      id: "2",
      title: "Schedule dentist appointment",
      priority: "High",
      status: "next-action",
      createdAt: new Date(),
      context: "phone"
    },
    {
      id: "3",
      title: "Deep work session: Complete research",
      description: "Focus on gathering key insights for the presentation",
      priority: "Medium",
      status: "waiting-for",
      createdAt: new Date(),
      tags: ["focus", "research"],
      context: "deep-work"
    }
  ]);

  const [activeView, setActiveView] = useState<"capture" | "clarify" | "organize" | "reflect" | "engage">("capture");

  const addTask = (task: Omit<GTDTask, "id" | "createdAt">) => {
    const newTask: GTDTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updates: Partial<GTDTask>) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const moveTask = (id: string, newStatus: TaskStatus, newPriority?: TaskPriority) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const updates: Partial<GTDTask> = { status: newStatus };
        if (newPriority) {
          updates.priority = newPriority;
        }
        return { ...task, ...updates };
      }
      return task;
    }));
  };

  return (
    <GTDContext.Provider value={{
      tasks,
      addTask,
      updateTask,
      deleteTask,
      moveTask,
      activeView,
      setActiveView,
    }}>
      {children}
    </GTDContext.Provider>
  );
};
