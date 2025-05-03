import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

// Define TaskPriority and TaskStatus types with all possible values
export type TaskPriority = "Very Low" | "Low" | "Medium" | "High" | "Very High";
export type TaskStatus = "inbox" | "next-action" | "project" | "waiting-for" | "someday" | "reference" | "completed" | "deleted" | "today" | "todo" | "in-progress" | "do-it" | "delegate-it" | "defer-it";

export interface TaskAttachment {
  name: string;
  type: string;
  url?: string;
  file?: File;
}

export interface GTDTask {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date;
  createdAt: Date;
  tags?: string[];
  category?: TaskCategory;
  context?: string;
  timeEstimate?: number;
  project?: string;
  isToDoNot?: boolean;
  goalId?: string; // Add this missing property
}

export type TaskCategory = "work" | "personal" | "health" | "education" | "fun" | "other";

interface GTDContextType {
  tasks: GTDTask[];
  addTask: (task: Omit<GTDTask, "id" | "createdAt">) => void;
  updateTask: (id: string, updates: Partial<GTDTask>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, newStatus: TaskStatus, newPriority?: TaskPriority) => void;
  activeView: "capture" | "clarify" | "organize" | "reflect" | "engage";
  setActiveView: (view: "capture" | "clarify" | "organize" | "reflect" | "engage") => void;
  getTaskById: (id: string) => GTDTask | undefined;
  hasUnreadNotifications: boolean;
  setHasUnreadNotifications: (value: boolean) => void;
  markNotificationsAsRead: () => void;
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
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<GTDTask[]>(() => {
    // Try to get tasks from local storage
    const savedTasks = localStorage.getItem('gtdTasks');
    return savedTasks ? JSON.parse(savedTasks) : [
      {
        id: "1",
        title: "Review project proposal",
        description: "Need to check the details and provide feedback",
        status: "inbox",
        createdAt: new Date(),
        tags: ["work", "review"],
        context: "office"
      },
      {
        id: "2",
        title: "Schedule dentist appointment",
        status: "next-action",
        createdAt: new Date(),
        context: "phone"
      },
      {
        id: "3",
        title: "Deep work session: Complete research",
        description: "Focus on gathering key insights for the presentation",
        status: "waiting-for",
        createdAt: new Date(),
        tags: ["focus", "research"],
        context: "deep-work"
      },
      {
        id: "4",
        title: "Daily exercise routine",
        status: "today",
        createdAt: new Date(),
        tags: ["health", "exercise"]
      },
      {
        id: "5",
        title: "Scroll social media",
        status: "todo",
        createdAt: new Date(),
        tags: ["avoid"],
        isToDoNot: true
      },
      {
        id: "6",
        title: "Eat junk food",
        status: "todo",
        createdAt: new Date(),
        tags: ["health", "avoid"],
        isToDoNot: true
      }
    ];
  });

  const [activeView, setActiveView] = useState<"capture" | "clarify" | "organize" | "reflect" | "engage">("capture");
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState<boolean>(true); // Set to true by default for demo

  // Save tasks to local storage when they change
  useEffect(() => {
    localStorage.setItem('gtdTasks', JSON.stringify(tasks));
  }, [tasks]);

  // Sync tasks between different components
  useEffect(() => {
    // This is a general sync effect that can be enhanced based on specific sync requirements
    console.log("Tasks updated:", tasks);
  }, [tasks]);

  // Add logic to sync tasks between GTD and Actions pages
  useEffect(() => {
    // Handle synchronization based on task status changes
    const syncTasksWithActions = () => {
      setTasks(prevTasks => {
        return prevTasks.map(task => {
          // If a task is marked as "do-it", move it to "next-action"
          if (task.status === "do-it") {
            return { ...task, status: "next-action" };
          }
          // If a task is marked as "delegate-it", move it to "waiting-for"
          else if (task.status === "delegate-it") {
            return { ...task, status: "waiting-for" };
          }
          // If a task is marked as "defer-it", move it to "someday"
          else if (task.status === "defer-it") {
            return { ...task, status: "someday" };
          }
          return task;
        });
      });
    };

    // Run synchronization
    syncTasksWithActions();
  }, [tasks]); // This will run whenever tasks change

  const getTaskById = (id: string): GTDTask | undefined => {
    return tasks.find(task => task.id === id);
  };

  const addTask = (task: Omit<GTDTask, "id" | "createdAt">) => {
    const newTask: GTDTask = {
      ...task,
      id: uuidv4(),
      createdAt: new Date(),
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
    
    // Log for debugging
    console.log(`New task added (${task.status}):`, newTask);
  };

  const updateTask = (id: string, updates: Partial<GTDTask>) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === id) {
        const updatedTask = { ...task, ...updates };
        
        // Log for debugging
        console.log(`Task updated (${task.id}):`, updatedTask);
        
        return updatedTask;
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(task => task.id === id);
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    
    // Log for debugging
    console.log(`Task deleted (${id}):`, taskToDelete);
  };

  const moveTask = (id: string, newStatus: TaskStatus, newPriority?: TaskPriority) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === id) {
        const updates: Partial<GTDTask> = { status: newStatus };
        if (newPriority) {
          updates.priority = newPriority;
        }
        
        const updatedTask = { ...task, ...updates };
        
        // Log for debugging
        console.log(`Task moved (${id}) to ${newStatus}:`, updatedTask);
        
        return updatedTask;
      }
      return task;
    }));
  };

  const markNotificationsAsRead = () => {
    setHasUnreadNotifications(false);
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
      getTaskById,
      hasUnreadNotifications,
      setHasUnreadNotifications,
      markNotificationsAsRead
    }}>
      {children}
    </GTDContext.Provider>
  );
};
