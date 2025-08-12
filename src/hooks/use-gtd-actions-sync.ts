import { useEffect, useCallback } from "react";
import { GTDTask } from "@/types/gtd";
import { useToast } from "@/hooks/use-toast";

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
}

export const useGTDActionsSync = () => {
  const { toast } = useToast();

  const syncTaskToActions = useCallback((gtdTask: GTDTask, targetType: 'todo' | 'deleted') => {
    try {
      // Get existing actions tasks
      const existingTasks = JSON.parse(localStorage.getItem('actionsTasks') || '[]') as Task[];
      
      // Map GTD priority to Actions priority
      const mapPriority = (gtdPriority: string): 'low' | 'medium' | 'high' | 'urgent' => {
        switch (gtdPriority) {
          case 'urgent': return 'urgent';
          case 'high': return 'high';
          case 'medium': return 'medium';
          case 'low': return 'low';
          default: return 'medium';
        }
      };

      // Create new task for Actions page
      const newTask: Task = {
        id: `gtd-${gtdTask.id}`,
        title: gtdTask.title,
        description: gtdTask.description,
        completed: targetType === 'deleted',
        priority: mapPriority(gtdTask.priority),
        category: gtdTask.context || 'general',
        dueDate: gtdTask.dueDate,
        createdAt: new Date(),
        tags: gtdTask.tags || [],
        type: 'todo'
      };

      // Check if task already exists (to avoid duplicates)
      const existingIndex = existingTasks.findIndex(task => task.id === newTask.id);
      
      if (existingIndex >= 0) {
        // Update existing task
        existingTasks[existingIndex] = newTask;
      } else {
        // Add new task
        existingTasks.push(newTask);
      }

      // Save to localStorage
      localStorage.setItem('actionsTasks', JSON.stringify(existingTasks));
      
      toast({
        title: "Task Synced",
        description: `GTD task "${gtdTask.title}" has been synced to Actions page.`,
      });
      
    } catch (error) {
      console.error('Failed to sync GTD task to Actions:', error);
      toast({
        title: "Sync Failed",
        description: "Failed to sync task to Actions page.",
        variant: "destructive"
      });
    }
  }, [toast]);

  return { syncTaskToActions };
};