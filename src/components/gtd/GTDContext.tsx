
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export type TaskPriority = "Very Low" | "Low" | "Medium" | "High" | "Very High";
export type TaskStatus = "inbox" | "next-action" | "project" | "waiting-for" | "someday" | "reference" | "completed" | "deleted" | "today";

export interface TaskAttachment {
  name: string;
  type: string;
  url?: string;
}

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
  attachment?: TaskAttachment;
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
  const navigate = useNavigate();
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

  // Sync with Tasks page when adding or modifying Next Actions
  useEffect(() => {
    // This is where you would implement sync with Tasks page
    const nextActionTasks = tasks.filter(task => task.status === "next-action");
    console.log("Tasks to sync with Tasks page:", nextActionTasks);
    // You would sync these with the Tasks page state
  }, [tasks]);

  // Sync projects with Planning page
  useEffect(() => {
    const projectTasks = tasks.filter(task => task.status === "project");
    console.log("Projects to sync with Planning page:", projectTasks);
    // Here you would sync with the Planning page's state
  }, [tasks]);

  const addTask = (task: Omit<GTDTask, "id" | "createdAt">) => {
    const newTask: GTDTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    setTasks([...tasks, newTask]);
    
    // If task is a project, sync with Planning page
    if (task.status === "project") {
      console.log("New project added:", newTask);
      // Here you would sync with the Planning page
      // e.g., addProjectToPlanning(newTask);
    }
    
    // If task is a next action, sync with Tasks page
    if (task.status === "next-action") {
      console.log("New next action added:", newTask);
      // Here you would sync with the Tasks page
      // e.g., addTaskToTasksPage(newTask);
    }
  };

  const updateTask = (id: string, updates: Partial<GTDTask>) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const updatedTask = { ...task, ...updates };
        
        // If task status changed to project, sync with Planning page
        if (updates.status === "project" && task.status !== "project") {
          console.log("Task converted to project:", updatedTask);
          // Here you would sync with the Planning page
          // e.g., addProjectToPlanning(updatedTask);
        }
        
        // If task status changed to next-action, sync with Tasks page
        if (updates.status === "next-action" && task.status !== "next-action") {
          console.log("Task converted to next action:", updatedTask);
          // Here you would sync with the Tasks page
          // e.g., addTaskToTasksPage(updatedTask);
        }
        
        return updatedTask;
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(task => task.id === id);
    setTasks(tasks.filter(task => task.id !== id));
    
    // If task was a project, remove from Planning page
    if (taskToDelete && taskToDelete.status === "project") {
      console.log("Project deleted:", taskToDelete);
      // Here you would remove from the Planning page
      // e.g., removeProjectFromPlanning(taskToDelete);
    }
    
    // If task was a next action, remove from Tasks page
    if (taskToDelete && taskToDelete.status === "next-action") {
      console.log("Next action deleted:", taskToDelete);
      // Here you would remove from the Tasks page
      // e.g., removeTaskFromTasksPage(taskToDelete);
    }
  };

  const moveTask = (id: string, newStatus: TaskStatus, newPriority?: TaskPriority) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const updates: Partial<GTDTask> = { status: newStatus };
        if (newPriority) {
          updates.priority = newPriority;
        }
        
        const updatedTask = { ...task, ...updates };
        
        // Handle syncing with Planning page if task is moved to/from project status
        if (newStatus === "project" && task.status !== "project") {
          console.log("Task moved to projects:", updatedTask);
          // Here you would sync with the Planning page
          // e.g., addProjectToPlanning(updatedTask);
        } else if (task.status === "project" && newStatus !== "project") {
          console.log("Project moved to another status:", updatedTask);
          // Here you would remove from the Planning page
          // e.g., removeProjectFromPlanning(updatedTask);
        }
        
        // Handle syncing with Tasks page if task is moved to/from next-action status
        if (newStatus === "next-action" && task.status !== "next-action") {
          console.log("Task moved to next actions:", updatedTask);
          // Here you would sync with the Tasks page
          // e.g., addTaskToTasksPage(updatedTask);
        } else if (task.status === "next-action" && newStatus !== "next-action") {
          console.log("Next action moved to another status:", updatedTask);
          // Here you would remove from the Tasks page
          // e.g., removeTaskFromTasksPage(updatedTask);
        }
        
        return updatedTask;
      }
      return task;
    }));
  };

  // Function to navigate to Planning page
  const goToPlanning = () => {
    navigate('/planning');
  };

  // Function to navigate to Tasks page
  const goToTasks = () => {
    navigate('/tasks');
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
