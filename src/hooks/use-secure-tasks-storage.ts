import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { UnifiedTask, TaskType, TaskPriority, TaskStatus } from "@/types/unified-tasks";

export const useSecureTasksStorage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<UnifiedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasSynced, setHasSynced] = useState(false);

  // Load tasks from Supabase
  const loadTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('unified_tasks')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const loadedTasks: UnifiedTask[] = (data || []).map((row: any) => {
        const taskData = row.data as any;
        return {
          ...taskData,
          id: row.id,
          createdAt: taskData.createdAt ? new Date(taskData.createdAt) : new Date(row.created_at),
          dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
          scheduledDate: taskData.scheduledDate ? new Date(taskData.scheduledDate) : undefined,
          completedAt: taskData.completedAt ? new Date(taskData.completedAt) : undefined,
          deletedAt: taskData.deletedAt ? new Date(taskData.deletedAt) : undefined,
        };
      });

      setTasks(loadedTasks);
      setHasSynced(true);
    } catch (error) {
      console.error('Error loading tasks from Supabase:', error);
      // Fall back to localStorage if Supabase fails
      try {
        const localTasks = localStorage.getItem('unifiedTasks');
        if (localTasks) {
          const parsed = JSON.parse(localTasks);
          setTasks(parsed.map((t: any) => ({
            ...t,
            createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
            dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
            scheduledDate: t.scheduledDate ? new Date(t.scheduledDate) : undefined,
            completedAt: t.completedAt ? new Date(t.completedAt) : undefined,
            deletedAt: t.deletedAt ? new Date(t.deletedAt) : undefined,
          })));
        }
      } catch (e) {
        console.error('Error loading tasks from localStorage:', e);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Migrate localStorage tasks to Supabase on first sync
  const migrateLocalTasks = useCallback(async () => {
    if (!user || hasSynced) return;

    try {
      const localTasks = localStorage.getItem('unifiedTasks');
      if (!localTasks) return;

      const parsed = JSON.parse(localTasks) as any[];
      if (parsed.length === 0) return;

      // Check if we already have tasks in Supabase
      const { data: existingTasks } = await supabase
        .from('unified_tasks')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (existingTasks && existingTasks.length > 0) {
        // Already have tasks in Supabase, don't overwrite
        return;
      }

      // Upload local tasks to Supabase
      const tasksToInsert = parsed.map((task: any) => ({
        id: task.id,
        user_id: user.id,
        data: task,
      }));

      const { error } = await supabase
        .from('unified_tasks')
        .upsert(tasksToInsert, { onConflict: 'id' });

      if (error) throw error;

      console.log(`Migrated ${tasksToInsert.length} tasks to Supabase`);
    } catch (error) {
      console.error('Error migrating local tasks to Supabase:', error);
    }
  }, [user, hasSynced]);

  useEffect(() => {
    if (user) {
      migrateLocalTasks().then(() => loadTasks());
    } else {
      setTasks([]);
      setLoading(false);
    }
  }, [user, loadTasks, migrateLocalTasks]);

  // Save a single task to Supabase
  const saveTask = useCallback(async (task: UnifiedTask) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('unified_tasks')
        .upsert({
          id: task.id,
          user_id: user.id,
          data: JSON.parse(JSON.stringify(task)),
        }, { onConflict: 'id' });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving task to Supabase:', error);
      throw error;
    }
  }, [user]);

  // Delete a task from Supabase
  const removeTask = useCallback(async (taskId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('unified_tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting task from Supabase:', error);
      throw error;
    }
  }, [user]);

  // Batch save all tasks
  const saveTasks = useCallback(async (tasksToSave: UnifiedTask[]) => {
    if (!user) return;

    try {
      const tasksData = tasksToSave.map(task => ({
        id: task.id,
        user_id: user.id,
        data: JSON.parse(JSON.stringify(task)),
      }));

      const { error } = await supabase
        .from('unified_tasks')
        .upsert(tasksData, { onConflict: 'id' });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving tasks to Supabase:', error);
      throw error;
    }
  }, [user]);

  return {
    tasks,
    setTasks,
    loading,
    saveTask,
    removeTask,
    saveTasks,
    refresh: loadTasks,
    isAuthenticated: !!user,
  };
};
