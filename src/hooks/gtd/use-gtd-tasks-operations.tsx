
import { v4 as uuidv4 } from 'uuid';
import { GTDTask, TaskStatus, TaskPriority } from '@/types/gtd';
import { useToast } from '@/hooks/use-toast';

export const useGTDTasksOperations = (
  tasks: GTDTask[], 
  setTasks: React.Dispatch<React.SetStateAction<GTDTask[]>>
) => {
  const { toast } = useToast();

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
    toast({
      title: "Task added",
      description: `"${task.title}" has been added successfully.`,
    });
  };

  const updateTask = (id: string, updates: Partial<GTDTask>) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === id) {
        const updatedTask = { ...task, ...updates };
        return updatedTask;
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(task => task.id === id);
    if (!taskToDelete) return;
    
    // Instead of completely removing, mark as deleted
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === id) {
        return { ...task, status: "deleted" as TaskStatus };
      }
      return task;
    }));
    
    toast({
      title: "Task deleted",
      description: `"${taskToDelete.title}" has been moved to trash.`,
    });
  };

  const getDeletedTasks = () => {
    return tasks.filter(task => task.status === "deleted");
  };

  const restoreTask = (id: string) => {
    const taskToRestore = tasks.find(task => task.id === id && task.status === "deleted");
    if (!taskToRestore) return;
    
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === id) {
        // Restore to inbox or original status if known
        const newStatus = "inbox" as TaskStatus;
        return { ...task, status: newStatus };
      }
      return task;
    }));
    
    toast({
      title: "Task restored",
      description: `"${taskToRestore.title}" has been restored.`,
    });
  };

  const permanentlyDeleteTask = (id: string) => {
    const taskToDelete = tasks.find(task => task.id === id);
    if (!taskToDelete) return;
    
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    
    toast({
      title: "Task permanently deleted",
      description: `"${taskToDelete.title}" has been permanently removed.`,
    });
  };

  const moveTask = (id: string, newStatus: TaskStatus, newPriority?: TaskPriority) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === id) {
        const updates: Partial<GTDTask> = { status: newStatus };
        if (newPriority) {
          updates.priority = newPriority;
        }
        
        const updatedTask = { ...task, ...updates };
        return updatedTask;
      }
      return task;
    }));
  };

  return {
    getTaskById,
    addTask,
    updateTask,
    deleteTask,
    permanentlyDeleteTask,
    getDeletedTasks,
    restoreTask,
    moveTask
  };
};
