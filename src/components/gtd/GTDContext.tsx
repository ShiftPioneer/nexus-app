
import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { GTDTask, TaskStatus, TaskPriority, GTDContextType } from "@/types/gtd";
import { useGTDTasks } from "@/hooks/use-gtd-tasks";
import { useGTDView } from "@/hooks/use-gtd-view";
import { useGTDDragDrop } from "@/hooks/use-gtd-drag-drop";
import { DropResult } from "react-beautiful-dnd";
import { useToast } from "@/hooks/use-toast";

// Re-export types from the types file for backward compatibility
export type { GTDTask, TaskPriority, TaskStatus } from "@/types/gtd";
export { type TaskAttachment } from "@/types/gtd";

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
  const { toast } = useToast();
  
  const { 
    tasks, 
    getTaskById, 
    addTask, 
    updateTask, 
    deleteTask,
    permanentlyDeleteTask,
    getDeletedTasks,
    restoreTask,
    moveTask 
  } = useGTDTasks();
  
  const {
    activeView,
    setActiveView,
    hasUnreadNotifications,
    setHasUnreadNotifications,
    markNotificationsAsRead
  } = useGTDView();

  const { handleDragEnd } = useGTDDragDrop(moveTask);

  // Add synchronization effect for task status changes
  useEffect(() => {
    // Handle synchronization based on task status changes
    const syncTasksWithActions = () => {
      // If a task is marked as "do-it", move it to "next-action"
      // If a task is marked as "delegate-it", move it to "waiting-for"
      // If a task is marked as "defer-it", move it to "someday"
      const updatedTasks = tasks.map(task => {
        if (task.status === "do-it") {
          return { ...task, status: "next-action" as TaskStatus };
        } else if (task.status === "delegate-it") {
          return { ...task, status: "waiting-for" as TaskStatus };
        } else if (task.status === "defer-it") {
          return { ...task, status: "someday" as TaskStatus };
        }
        return task;
      });

      // Only update if there were changes
      const hasChanges = updatedTasks.some((task, index) => task.status !== tasks[index].status);
      if (hasChanges) {
        updatedTasks.forEach(updatedTask => {
          const originalTask = tasks.find(t => t.id === updatedTask.id);
          if (originalTask && originalTask.status !== updatedTask.status) {
            updateTask(updatedTask.id, { status: updatedTask.status });
          }
        });
      }
    };

    syncTasksWithActions();
  }, [tasks, updateTask]);

  // Save all data before unloading page
  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        localStorage.setItem('gtdTasks', JSON.stringify(tasks));
        console.log("GTD tasks saved before unload");
      } catch (error) {
        console.error("Failed to save GTD tasks:", error);
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [tasks]);

  return (
    <GTDContext.Provider value={{
      tasks,
      addTask,
      updateTask,
      deleteTask,
      permanentlyDeleteTask,
      getDeletedTasks,
      restoreTask,
      moveTask,
      activeView,
      setActiveView,
      getTaskById,
      hasUnreadNotifications,
      setHasUnreadNotifications,
      markNotificationsAsRead,
      handleDragEnd
    }}>
      {children}
    </GTDContext.Provider>
  );
};
