
import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from "@/hooks/use-local-storage";

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
  handleCreateTask: (taskData: Partial<Task>, taskType: 'todo' | 'not-todo') => void;
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

  const activeTasks = tasks.filter(task => !task.deleted);
  const deletedTasks = tasks.filter(task => task.deleted);
  const todoTasks = activeTasks.filter(task => task.type === 'todo');
  const notTodoTasks = activeTasks.filter(task => task.type === 'not-todo');

  const handleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleTaskEdit = (task: Task) => {
    // This will be handled by the parent component
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, deleted: true, deletedAt: new Date() } : task
    ));
  };

  const handleTaskRestore = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, deleted: false, deletedAt: undefined } : task
    ));
  };

  const handleTaskPermanentDelete = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleCreateTask = (taskData: Partial<Task>, taskType: 'todo' | 'not-todo') => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title || '',
      description: taskData.description || '',
      completed: false,
      priority: taskData.priority || 'medium',
      category: taskData.category || 'General',
      createdAt: new Date(),
      tags: taskData.tags || [],
      type: taskType,
      dueDate: taskData.dueDate,
      deleted: false
    };
    setTasks([...tasks, newTask]);
  };

  return (
    <ActionsContext.Provider value={{
      tasks,
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
      handleCreateTask
    }}>
      {children}
    </ActionsContext.Provider>
  );
};
