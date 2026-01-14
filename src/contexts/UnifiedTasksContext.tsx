import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useSecureTasksStorage } from "@/hooks/use-secure-tasks-storage";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { toastHelpers } from "@/utils/toast-helpers";
import { useGamification } from "@/hooks/use-gamification";
import { ConfettiEffect } from "@/components/ui/confetti-effect";
import { MilestoneBanner } from "@/components/ui/milestone-banner";
import { LevelUpBadge } from "@/components/ui/level-up-badge";
import { 
  UnifiedTask, 
  UnifiedTasksContextType, 
  TaskPriority, 
  TaskType, 
  TaskStatus 
} from "@/types/unified-tasks";

const UnifiedTasksContext = createContext<UnifiedTasksContextType | undefined>(undefined);

export const useUnifiedTasks = () => {
  const context = useContext(UnifiedTasksContext);
  if (!context) {
    throw new Error('useUnifiedTasks must be used within a UnifiedTasksProvider');
  }
  return context;
};

// Migration helper - converts old task formats to unified format
const migrateOldTasks = (): UnifiedTask[] => {
  const unifiedTasks: UnifiedTask[] = [];
  const migratedIds = new Set<string>();
  
  // Migrate from "tasks" (ActionsContext format)
  try {
    const oldActionsTasks = localStorage.getItem('tasks');
    if (oldActionsTasks) {
      const parsed = JSON.parse(oldActionsTasks);
      parsed.forEach((task: any) => {
        if (!migratedIds.has(task.id)) {
          migratedIds.add(task.id);
          unifiedTasks.push({
            id: task.id,
            title: task.title,
            description: task.description,
            type: task.type || 'todo',
            status: task.deleted ? 'deleted' : (task.completed ? 'completed' : 'active'),
            priority: task.priority || 'medium',
            category: task.category || 'general',
            urgent: task.urgent,
            important: task.important,
            clarified: true,
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
            createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
            deletedAt: task.deletedAt ? new Date(task.deletedAt) : undefined,
            tags: task.tags,
            completed: task.completed || false,
          });
        }
      });
    }
  } catch (e) {
    console.error('Error migrating actions tasks:', e);
  }
  
  // Migrate from "gtdTasks" (GTDContext format)
  try {
    const oldGtdTasks = localStorage.getItem('gtdTasks');
    if (oldGtdTasks) {
      const parsed = JSON.parse(oldGtdTasks);
      parsed.forEach((task: any) => {
        if (!migratedIds.has(task.id)) {
          migratedIds.add(task.id);
          
          let status: TaskStatus = 'inbox';
          if (task.status === 'completed') status = 'completed';
          else if (task.status === 'deleted') status = 'deleted';
          else if (task.status === 'waiting-for') status = 'waiting-for';
          else if (task.status === 'someday') status = 'someday';
          else if (task.status === 'inbox' || !task.clarified) status = 'inbox';
          else status = 'active';
          
          let type: TaskType = 'todo';
          if (task.type === 'project') type = 'project';
          else if (task.type === 'reference') type = 'reference';
          else if (task.isToDoNot) type = 'not-todo';
          
          unifiedTasks.push({
            id: task.id,
            title: task.title,
            description: task.description,
            type,
            status,
            priority: task.priority || 'medium',
            category: task.category || 'general',
            clarified: task.clarified || false,
            context: task.context,
            nextAction: task.nextAction,
            delegatedTo: task.delegatedTo,
            goalId: task.goalId,
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
            timeEstimate: task.timeEstimate,
            createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
            tags: task.tags,
            completed: task.status === 'completed',
          });
        }
      });
    }
  } catch (e) {
    console.error('Error migrating GTD tasks:', e);
  }
  
  return unifiedTasks;
};

export const UnifiedTasksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { 
    tasks: supabaseTasks, 
    loading: supabaseLoading, 
    saveTask, 
    removeTask, 
    saveTasks,
    isAuthenticated 
  } = useSecureTasksStorage();
  
  const [localTasks, setLocalTasks] = useLocalStorage<UnifiedTask[]>("unifiedTasks", []);
  const [hasMigrated, setHasMigrated] = useLocalStorage<boolean>("tasksMigrated", false);
  const { rewardTaskComplete, levelUp, clearLevelUp, XP_REWARDS } = useGamification();
  
  // Use Supabase tasks when authenticated, localStorage otherwise
  const tasks = isAuthenticated ? supabaseTasks : localTasks;
  const setTasks = useCallback((newTasks: UnifiedTask[] | ((prev: UnifiedTask[]) => UnifiedTask[])) => {
    const resolvedTasks = typeof newTasks === 'function' ? newTasks(tasks) : newTasks;
    
    if (isAuthenticated) {
      // Save to Supabase
      saveTasks(resolvedTasks).catch(console.error);
    } else {
      // Save to localStorage
      setLocalTasks(resolvedTasks);
    }
  }, [isAuthenticated, tasks, saveTasks, setLocalTasks]);

  // Celebration state
  const [showConfetti, setShowConfetti] = useState(false);
  const [milestone, setMilestone] = useState<{ title: string; description: string } | null>(null);

  // Run migration on first load for localStorage
  useEffect(() => {
    if (!isAuthenticated && !hasMigrated && localTasks.length === 0) {
      const migratedTasks = migrateOldTasks();
      if (migratedTasks.length > 0) {
        setLocalTasks(migratedTasks);
        console.log(`Migrated ${migratedTasks.length} tasks to unified format`);
      }
      setHasMigrated(true);
    }
  }, [hasMigrated, localTasks.length, setLocalTasks, setHasMigrated, isAuthenticated]);

  // Priority derivation helpers
  const derivePriorityFromEisenhower = useCallback((urgent: boolean, important: boolean): TaskPriority => {
    if (urgent && important) return "urgent";
    if (!urgent && important) return "high";
    if (urgent && !important) return "medium";
    return "low";
  }, []);

  const deriveEisenhowerFromPriority = useCallback((priority: TaskPriority) => {
    if (priority === "urgent") return { urgent: true, important: true };
    if (priority === "high") return { urgent: false, important: true };
    if (priority === "medium") return { urgent: true, important: false };
    return { urgent: false, important: false };
  }, []);

  // Normalize task to ensure Eisenhower values are in sync
  const normalizeTask = useCallback((t: UnifiedTask): UnifiedTask => {
    if (typeof t.urgent === "boolean" && typeof t.important === "boolean") {
      return {
        ...t,
        priority: derivePriorityFromEisenhower(t.urgent, t.important),
      };
    }
    const derived = deriveEisenhowerFromPriority(t.priority);
    return {
      ...t,
      ...derived,
      priority: derivePriorityFromEisenhower(derived.urgent, derived.important),
    };
  }, [deriveEisenhowerFromPriority, derivePriorityFromEisenhower]);

  const normalizedTasks = tasks.map(normalizeTask);

  // Filtered views
  const inboxTasks = normalizedTasks.filter(t => t.status === 'inbox' && !t.clarified);
  const activeTasks = normalizedTasks.filter(t => t.status === 'active' && !t.completed);
  const todoTasks = normalizedTasks.filter(t => t.type === 'todo' && t.status !== 'deleted');
  const notTodoTasks = normalizedTasks.filter(t => t.type === 'not-todo' && t.status !== 'deleted');
  const waitingForTasks = normalizedTasks.filter(t => t.status === 'waiting-for');
  const somedayTasks = normalizedTasks.filter(t => t.status === 'someday');
  const deletedTasks = normalizedTasks.filter(t => t.status === 'deleted');
  const projectTasks = normalizedTasks.filter(t => t.type === 'project' && t.status !== 'deleted');

  // Task operations with Supabase sync
  const addTask = useCallback(async (task: Omit<UnifiedTask, "id" | "createdAt">) => {
    const newTask: UnifiedTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    if (newTask.urgent === undefined || newTask.important === undefined) {
      const derived = deriveEisenhowerFromPriority(newTask.priority);
      newTask.urgent = derived.urgent;
      newTask.important = derived.important;
    }
    
    const updatedTasks = [...normalizedTasks, newTask];
    
    if (isAuthenticated) {
      try {
        await saveTask(newTask);
      } catch (error) {
        console.error('Failed to save task to Supabase:', error);
      }
    }
    
    setTasks(updatedTasks);
  }, [normalizedTasks, setTasks, deriveEisenhowerFromPriority, isAuthenticated, saveTask]);

  const updateTask = useCallback(async (taskId: string, updates: Partial<UnifiedTask>) => {
    const updatedTasks = normalizedTasks.map(t => {
      if (t.id !== taskId) return t;
      
      const nextUrgent = typeof updates.urgent === "boolean" ? updates.urgent : t.urgent ?? false;
      const nextImportant = typeof updates.important === "boolean" ? updates.important : t.important ?? false;
      const nextPriority = derivePriorityFromEisenhower(nextUrgent, nextImportant);
      
      return {
        ...t,
        ...updates,
        urgent: nextUrgent,
        important: nextImportant,
        priority: updates.priority ?? nextPriority,
      };
    });
    
    if (isAuthenticated) {
      const updatedTask = updatedTasks.find(t => t.id === taskId);
      if (updatedTask) {
        try {
          await saveTask(updatedTask);
        } catch (error) {
          console.error('Failed to update task in Supabase:', error);
        }
      }
    }
    
    setTasks(updatedTasks);
  }, [normalizedTasks, setTasks, derivePriorityFromEisenhower, isAuthenticated, saveTask]);

  const deleteTask = useCallback(async (taskId: string) => {
    const updatedTasks = normalizedTasks.map(t => 
      t.id === taskId ? { ...t, status: 'deleted' as TaskStatus, deletedAt: new Date() } : t
    );
    
    if (isAuthenticated) {
      const updatedTask = updatedTasks.find(t => t.id === taskId);
      if (updatedTask) {
        try {
          await saveTask(updatedTask);
        } catch (error) {
          console.error('Failed to delete task in Supabase:', error);
        }
      }
    }
    
    setTasks(updatedTasks);
  }, [normalizedTasks, setTasks, isAuthenticated, saveTask]);

  const restoreTask = useCallback(async (taskId: string) => {
    const updatedTasks = normalizedTasks.map(t => 
      t.id === taskId ? { ...t, status: 'active' as TaskStatus, deletedAt: undefined } : t
    );
    
    if (isAuthenticated) {
      const updatedTask = updatedTasks.find(t => t.id === taskId);
      if (updatedTask) {
        try {
          await saveTask(updatedTask);
        } catch (error) {
          console.error('Failed to restore task in Supabase:', error);
        }
      }
    }
    
    setTasks(updatedTasks);
  }, [normalizedTasks, setTasks, isAuthenticated, saveTask]);

  const permanentlyDeleteTask = useCallback(async (taskId: string) => {
    if (isAuthenticated) {
      try {
        await removeTask(taskId);
      } catch (error) {
        console.error('Failed to permanently delete task from Supabase:', error);
      }
    }
    
    setTasks(normalizedTasks.filter(t => t.id !== taskId));
  }, [normalizedTasks, setTasks, isAuthenticated, removeTask]);

  const completeTask = useCallback(async (taskId: string) => {
    const task = normalizedTasks.find(t => t.id === taskId);
    const wasCompleted = task?.completed;
    
    const updatedTasks = normalizedTasks.map(t => 
      t.id === taskId ? { 
        ...t, 
        completed: !t.completed, 
        status: !t.completed ? 'completed' as TaskStatus : 'active' as TaskStatus,
        completedAt: !t.completed ? new Date() : undefined
      } : t
    );
    
    if (isAuthenticated) {
      const updatedTask = updatedTasks.find(t => t.id === taskId);
      if (updatedTask) {
        try {
          await saveTask(updatedTask);
        } catch (error) {
          console.error('Failed to complete task in Supabase:', error);
        }
      }
    }
    
    setTasks(updatedTasks);
    
    if (!wasCompleted && task) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      
      rewardTaskComplete();
      toastHelpers.xpGained(XP_REWARDS.taskComplete, `"${task.title}" completed!`);
      
      const completedCount = todoTasks.filter(t => t.completed).length + 1;
      if (completedCount % 5 === 0) {
        setMilestone({
          title: `${completedCount} Tasks Completed!`,
          description: "You're on fire! Keep up the amazing momentum.",
        });
      }
    }
  }, [normalizedTasks, setTasks, rewardTaskComplete, XP_REWARDS, todoTasks, isAuthenticated, saveTask]);

  // Quick capture - adds directly to inbox
  const quickCapture = useCallback((title: string, type: TaskType = 'todo', priority: TaskPriority = 'medium') => {
    const derived = deriveEisenhowerFromPriority(priority);
    const newTask: UnifiedTask = {
      id: Date.now().toString(),
      title,
      type,
      status: 'inbox',
      priority,
      category: 'general',
      urgent: derived.urgent,
      important: derived.important,
      clarified: false,
      createdAt: new Date(),
      completed: false,
    };
    
    if (isAuthenticated) {
      saveTask(newTask).catch(console.error);
    }
    
    setTasks([...normalizedTasks, newTask]);
    toastHelpers.success("Captured!", { description: `"${title}" added to inbox` });
  }, [normalizedTasks, setTasks, deriveEisenhowerFromPriority, isAuthenticated, saveTask]);

  // Clarify task - move from inbox to active with Eisenhower placement
  const clarifyTask = useCallback(async (taskId: string, urgent: boolean, important: boolean) => {
    const priority = derivePriorityFromEisenhower(urgent, important);
    const updatedTasks = normalizedTasks.map(t => 
      t.id === taskId ? { 
        ...t, 
        clarified: true, 
        status: 'active' as TaskStatus,
        urgent,
        important,
        priority
      } : t
    );
    
    if (isAuthenticated) {
      const updatedTask = updatedTasks.find(t => t.id === taskId);
      if (updatedTask) {
        try {
          await saveTask(updatedTask);
        } catch (error) {
          console.error('Failed to clarify task in Supabase:', error);
        }
      }
    }
    
    setTasks(updatedTasks);
  }, [normalizedTasks, setTasks, derivePriorityFromEisenhower, isAuthenticated, saveTask]);

  // Schedule task for Time Design
  const scheduleTask = useCallback(async (taskId: string, scheduledDate: Date) => {
    const updatedTasks = normalizedTasks.map(t => 
      t.id === taskId ? { ...t, scheduledDate } : t
    );
    
    if (isAuthenticated) {
      const updatedTask = updatedTasks.find(t => t.id === taskId);
      if (updatedTask) {
        try {
          await saveTask(updatedTask);
        } catch (error) {
          console.error('Failed to schedule task in Supabase:', error);
        }
      }
    }
    
    setTasks(updatedTasks);
  }, [normalizedTasks, setTasks, isAuthenticated, saveTask]);

  // Move to waiting for
  const moveToWaitingFor = useCallback(async (taskId: string, delegatedTo: string) => {
    const updatedTasks = normalizedTasks.map(t => 
      t.id === taskId ? { ...t, status: 'waiting-for' as TaskStatus, delegatedTo } : t
    );
    
    if (isAuthenticated) {
      const updatedTask = updatedTasks.find(t => t.id === taskId);
      if (updatedTask) {
        try {
          await saveTask(updatedTask);
        } catch (error) {
          console.error('Failed to move task to waiting in Supabase:', error);
        }
      }
    }
    
    setTasks(updatedTasks);
  }, [normalizedTasks, setTasks, isAuthenticated, saveTask]);

  // Move to someday/maybe
  const moveToSomeday = useCallback(async (taskId: string) => {
    const updatedTasks = normalizedTasks.map(t => 
      t.id === taskId ? { ...t, status: 'someday' as TaskStatus } : t
    );
    
    if (isAuthenticated) {
      const updatedTask = updatedTasks.find(t => t.id === taskId);
      if (updatedTask) {
        try {
          await saveTask(updatedTask);
        } catch (error) {
          console.error('Failed to move task to someday in Supabase:', error);
        }
      }
    }
    
    setTasks(updatedTasks);
  }, [normalizedTasks, setTasks, isAuthenticated, saveTask]);

  // Move to active
  const moveToActive = useCallback(async (taskId: string) => {
    const updatedTasks = normalizedTasks.map(t => 
      t.id === taskId ? { ...t, status: 'active' as TaskStatus } : t
    );
    
    if (isAuthenticated) {
      const updatedTask = updatedTasks.find(t => t.id === taskId);
      if (updatedTask) {
        try {
          await saveTask(updatedTask);
        } catch (error) {
          console.error('Failed to move task to active in Supabase:', error);
        }
      }
    }
    
    setTasks(updatedTasks);
  }, [normalizedTasks, setTasks, isAuthenticated, saveTask]);

  // Sync with old localStorage keys for backward compatibility (only when not authenticated)
  useEffect(() => {
    if (isAuthenticated) return;
    
    const actionsFormat = normalizedTasks
      .filter(t => (t.type === 'todo' || t.type === 'not-todo') && t.clarified)
      .map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        completed: t.completed,
        urgent: t.urgent,
        important: t.important,
        priority: t.priority,
        category: t.category,
        dueDate: t.dueDate,
        createdAt: t.createdAt,
        tags: t.tags,
        type: t.type,
        deleted: t.status === 'deleted',
        deletedAt: t.deletedAt,
      }));
    localStorage.setItem('tasks', JSON.stringify(actionsFormat));
    
    window.dispatchEvent(new CustomEvent('tasksUpdated'));
  }, [normalizedTasks, isAuthenticated]);

  return (
    <UnifiedTasksContext.Provider value={{
      tasks: normalizedTasks,
      setTasks,
      inboxTasks,
      activeTasks,
      todoTasks,
      notTodoTasks,
      waitingForTasks,
      somedayTasks,
      deletedTasks,
      projectTasks,
      addTask,
      updateTask,
      deleteTask,
      restoreTask,
      permanentlyDeleteTask,
      completeTask,
      quickCapture,
      clarifyTask,
      scheduleTask,
      moveToWaitingFor,
      moveToSomeday,
      moveToActive,
    }}>
      {children}
      
      {/* Celebration Effects */}
      <ConfettiEffect active={showConfetti} />
      
      <MilestoneBanner
        title={milestone?.title || ""}
        description={milestone?.description}
        visible={!!milestone}
        onClose={() => setMilestone(null)}
        variant="gold"
      />
      
      {levelUp && (
        <LevelUpBadge
          level={levelUp}
          visible={!!levelUp}
          onClose={clearLevelUp}
        />
      )}
    </UnifiedTasksContext.Provider>
  );
};
