import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { useLocalStorage } from "@/hooks/use-local-storage";
import { toastHelpers } from "@/utils/toast-helpers";
import { useGamification } from "@/hooks/use-gamification";
import { ConfettiEffect } from "@/components/ui/confetti-effect";
import { MilestoneBanner } from "@/components/ui/milestone-banner";
import { LevelUpBadge } from "@/components/ui/level-up-badge";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;

  /**
   * Eisenhower model (source of truth).
   * If missing (legacy tasks), we derive it from `priority`.
   */
  urgent?: boolean;
  important?: boolean;

  /**
   * Legacy/compat: used by lists & badges.
   * We keep this in sync with urgent/important.
   */
  priority: "low" | "medium" | "high" | "urgent";

  category: string;
  dueDate?: Date;
  createdAt: Date;
  tags?: string[];
  type: "todo" | "not-todo";
  deleted?: boolean;
  deletedAt?: Date;
}

interface ActionsContextType {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  activeTasks: Task[];
  deletedTasks: Task[];
  todoTasks: Task[];
  notTodoTasks: Task[];
  handleTaskComplete: (taskId: string) => void;
  handleTaskEdit: (task: Task) => void;
  handleTaskDelete: (taskId: string) => void;
  handleTaskRestore: (taskId: string) => void;
  handleTaskPermanentDelete: (taskId: string) => void;
  handleCreateTask: (taskData: Partial<Task>, taskType: "todo" | "not-todo") => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
}

const ActionsContext = createContext<ActionsContextType | undefined>(undefined);

export const useActions = () => {
  const context = useContext(ActionsContext);
  if (!context) {
    throw new Error('useActions must be used within an ActionsProvider');
  }
  return context;
};

export const ActionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  const { rewardTaskComplete, levelUp, clearLevelUp, XP_REWARDS } = useGamification();

  const derivePriorityFromEisenhower = useCallback((urgent: boolean, important: boolean) => {
    if (urgent && important) return "urgent" as const;
    if (!urgent && important) return "high" as const;
    if (urgent && !important) return "medium" as const;
    return "low" as const;
  }, []);

  const deriveEisenhowerFromPriority = useCallback((priority: Task["priority"]) => {
    // Sensible legacy mapping:
    // urgent -> (urgent+important)
    // high   -> (not urgent + important)
    // medium -> (urgent + not important)
    // low    -> (not urgent + not important)
    if (priority === "urgent") return { urgent: true, important: true };
    if (priority === "high") return { urgent: false, important: true };
    if (priority === "medium") return { urgent: true, important: false };
    return { urgent: false, important: false };
  }, []);

  const normalizeTask = useCallback(
    (t: Task): Task => {
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
    },
    [deriveEisenhowerFromPriority, derivePriorityFromEisenhower]
  );

  const normalizedTasks = tasks.map(normalizeTask);

  // Celebration state
  const [showConfetti, setShowConfetti] = useState(false);
  const [milestone, setMilestone] = useState<{ title: string; description: string } | null>(null);

  const activeTasks = normalizedTasks.filter((task) => !task.deleted);
  const deletedTasks = normalizedTasks.filter((task) => task.deleted);
  const todoTasks = activeTasks.filter((task) => task.type === "todo");
  const notTodoTasks = activeTasks.filter((task) => task.type === "not-todo");

  const handleTaskComplete = useCallback(
    (taskId: string) => {
      const task = normalizedTasks.find((t) => t.id === taskId);
      const wasCompleted = task?.completed;

      setTasks(
        normalizedTasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
      );

      if (!wasCompleted && task) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);

        rewardTaskComplete();
        toastHelpers.xpGained(XP_REWARDS.taskComplete, `"${task.title}" completed!`);

        const completedCount = todoTasks.filter((t) => t.completed).length + 1;
        if (completedCount % 5 === 0) {
          setMilestone({
            title: `${completedCount} Tasks Completed!`,
            description: "You're on fire! Keep up the amazing momentum.",
          });
        }
      }
    },
    [normalizedTasks, setTasks, rewardTaskComplete, XP_REWARDS, todoTasks]
  );

  const handleTaskEdit = (task: Task) => {
    // This will be handled by the parent component
  };

  const updateTask = useCallback(
    (taskId: string, updates: Partial<Task>) => {
      setTasks(
        normalizedTasks.map((t) => {
          if (t.id !== taskId) return t;

          const nextUrgent = typeof updates.urgent === "boolean" ? updates.urgent : t.urgent ?? false;
          const nextImportant =
            typeof updates.important === "boolean" ? updates.important : t.important ?? false;

          const nextPriority = derivePriorityFromEisenhower(nextUrgent, nextImportant);

          return {
            ...t,
            ...updates,
            urgent: nextUrgent,
            important: nextImportant,
            priority: updates.priority ?? nextPriority,
          };
        })
      );
    },
    [setTasks, normalizedTasks, derivePriorityFromEisenhower]
  );

  const handleTaskDelete = (taskId: string) => {
    setTasks(
      normalizedTasks.map((task) =>
        task.id === taskId ? { ...task, deleted: true, deletedAt: new Date() } : task
      )
    );
  };

  const handleTaskRestore = (taskId: string) => {
    setTasks(
      normalizedTasks.map((task) =>
        task.id === taskId ? { ...task, deleted: false, deletedAt: undefined } : task
      )
    );
  };

  const handleTaskPermanentDelete = (taskId: string) => {
    setTasks(normalizedTasks.filter((task) => task.id !== taskId));
  };

  const handleCreateTask = (taskData: Partial<Task>, taskType: "todo" | "not-todo") => {
    const urgent = Boolean(taskData.urgent);
    const important = Boolean(taskData.important);

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title || "",
      description: taskData.description || "",
      completed: false,
      urgent,
      important,
      priority: derivePriorityFromEisenhower(urgent, important),
      category: taskData.category || "General",
      createdAt: new Date(),
      tags: taskData.tags || [],
      type: taskType,
      dueDate: taskData.dueDate,
      deleted: false,
    };
    setTasks([...normalizedTasks, newTask]);
  };

  return (
    <ActionsContext.Provider
      value={{
        tasks: normalizedTasks,
        setTasks,
        activeTasks,
        deletedTasks,
        todoTasks,
        notTodoTasks,
        handleTaskComplete,
        handleTaskEdit,
        handleTaskDelete,
        handleTaskRestore,
        handleTaskPermanentDelete,
        handleCreateTask,
        updateTask,
      }}
    >
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
    </ActionsContext.Provider>
  );
};
