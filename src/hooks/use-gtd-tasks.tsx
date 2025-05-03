
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GTDTask, TaskStatus, TaskPriority } from '@/types/gtd';

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

  // Save tasks to local storage when they change
  useEffect(() => {
    localStorage.setItem('gtdTasks', JSON.stringify(tasks));
  }, [tasks]);

  // Log task updates for debugging
  useEffect(() => {
    console.log("Tasks updated:", tasks);
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
    console.log(`New task added (${task.status}):`, newTask);
  };

  const updateTask = (id: string, updates: Partial<GTDTask>) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === id) {
        const updatedTask = { ...task, ...updates };
        console.log(`Task updated (${task.id}):`, updatedTask);
        return updatedTask;
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(task => task.id === id);
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
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
        console.log(`Task moved (${id}) to ${newStatus}:`, updatedTask);
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
    moveTask
  };
};
