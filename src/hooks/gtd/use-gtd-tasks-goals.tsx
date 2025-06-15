
import { useEffect } from 'react';
import { GTDTask } from '@/types/gtd';

export const useGTDTasksGoals = (tasks: GTDTask[]) => {
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
        window.dispatchEvent(new CustomEvent('goalsUpdated'));
        console.log("Goals updated based on task completion");
      }
    } catch (error) {
      console.error("Error updating goals from tasks:", error);
    }
  }, [tasks]);
};
