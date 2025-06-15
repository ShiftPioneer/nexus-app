
import { useState, useEffect } from 'react';
import { GTDTask } from '@/types/gtd';

export const useGTDTasksStorage = () => {
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

  // Helper function to trigger custom event
  const triggerTaskUpdate = () => {
    window.dispatchEvent(new CustomEvent('tasksUpdated'));
  };

  // Save tasks to local storage when they change
  useEffect(() => {
    try {
      localStorage.setItem('gtdTasks', JSON.stringify(tasks));
      triggerTaskUpdate();
      console.log("Tasks saved to localStorage:", tasks.length);
    } catch (error) {
      console.error("Failed to save tasks:", error);
    }
  }, [tasks]);

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

  return {
    tasks,
    setTasks,
    triggerTaskUpdate
  };
};
