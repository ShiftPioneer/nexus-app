
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GTDTask, TaskStatus, TaskPriority } from '@/types/gtd';
import { useToast } from '@/hooks/use-toast';

export const useGTDTasks = () => {
  const [tasks, setTasks] = useState<GTDTask[]>(() => {
    // Try to get tasks from local storage
    const savedTasks = localStorage.getItem('gtdTasks');
    return savedTasks ? JSON.parse(savedTasks) : [
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
      },
      {
        id: "4",
        title: "Daily exercise routine",
        priority: "High",
        status: "today",
        createdAt: new Date(),
        tags: ["health", "exercise"]
      },
      {
        id: "5",
        title: "Scroll social media",
        priority: "Low",
        status: "todo",
        createdAt: new Date(),
        tags: ["avoid"],
        isToDoNot: true
      },
      {
        id: "6",
        title: "Eat junk food",
        priority: "Medium",
        status: "todo",
        createdAt: new Date(),
        tags: ["health", "avoid"],
        isToDoNot: true
      }
    ];
  });
  const { toast } = useToast();

  // Save tasks to local storage when they change
  useEffect(() => {
    try {
      localStorage.setItem('gtdTasks', JSON.stringify(tasks));
      console.log("Tasks saved to localStorage:", tasks.length);
    } catch (error) {
      console.error("Failed to save tasks:", error);
    }
  }, [tasks]);

  // Update associated goals with task completion
  useEffect(() => {
    try {
      const savedGoals = localStorage.getItem('planningGoals');
      if (!savedGoals) return;
      
      const goals = JSON.parse(savedGoals);
      let goalsUpdated = false;
      
      const updatedGoals = goals.map((goal: any) => {
        // Find all tasks linked to this goal
        const linkedTasks = tasks.filter(task => task.goalId === goal.id);
        
        if (linkedTasks.length === 0) return goal;
        
        // Calculate completion percentage based on linked tasks
        const completedTasks = linkedTasks.filter(task => task.status === "completed").length;
        const completionPercentage = Math.round((completedTasks / linkedTasks.length) * 100);
        
        // Only update if there's a significant change
        if (Math.abs((goal.progress || 0) - completionPercentage) > 5) {
          goalsUpdated = true;
          return {
            ...goal,
            progress: completionPercentage,
            // If all tasks are completed, mark as in-progress or completed based on milestones
            status: completionPercentage === 100 ? 
              (goal.milestones?.some((m: any) => !m.completed) ? 'in-progress' : 'completed') 
              : (goal.status === 'not-started' ? 'in-progress' : goal.status)
          };
        }
        
        return goal;
      });
      
      if (goalsUpdated) {
        localStorage.setItem('planningGoals', JSON.stringify(updatedGoals));
        console.log("Goals updated based on task completion");
      }
    } catch (error) {
      console.error("Error updating goals from tasks:", error);
    }
  }, [tasks]);

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
    tasks,
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
