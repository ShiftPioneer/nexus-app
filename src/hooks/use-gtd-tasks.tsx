
import { useGTDTasksStorage } from './gtd/use-gtd-tasks-storage';
import { useGTDTasksGoals } from './gtd/use-gtd-tasks-goals';
import { useGTDTasksOperations } from './gtd/use-gtd-tasks-operations';

export const useGTDTasks = () => {
  const { tasks, setTasks, triggerTaskUpdate } = useGTDTasksStorage();
  
  // Initialize goal synchronization
  useGTDTasksGoals(tasks);
  
  // Get task operations
  const operations = useGTDTasksOperations(tasks, setTasks);

  return {
    tasks,
    ...operations
  };
};
