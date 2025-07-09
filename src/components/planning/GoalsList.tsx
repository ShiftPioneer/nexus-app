
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import GoalCard from "./goals/GoalCard";
import EmptyGoalsView from "./goals/EmptyGoalsView";

interface GoalsListProps {
  onCreateGoal: () => void;
  onEditGoal: (goal: Goal) => void;
  onDeleteGoal: (id: string) => void;
}

const GoalsList: React.FC<GoalsListProps> = ({ onCreateGoal, onEditGoal, onDeleteGoal }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedGoals = localStorage.getItem('planningGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  const updateGoalProgress = (goalId: string, newProgress: number) => {
    const updatedGoals = goals.map(goal => 
      goal.id === goalId 
        ? { 
            ...goal, 
            progress: newProgress,
            status: (newProgress === 100 ? 'completed' : 
                   newProgress > 0 ? 'in-progress' : 'not-started') as "completed" | "in-progress" | "not-started"
          }
        : goal
    );
    
    setGoals(updatedGoals);
    localStorage.setItem('planningGoals', JSON.stringify(updatedGoals));
    
    toast({
      title: "Progress Updated",
      description: `Goal progress updated to ${newProgress}%`
    });
  };

  if (goals.length === 0) {
    return <EmptyGoalsView onCreateGoal={onCreateGoal} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          onEdit={onEditGoal}
          onDelete={onDeleteGoal}
          onUpdateProgress={updateGoalProgress}
        />
      ))}
    </div>
  );
};

export default GoalsList;
