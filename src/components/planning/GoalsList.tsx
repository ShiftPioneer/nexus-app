
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import GoalCard from "./goals/GoalCard";
import EmptyGoalsView from "./goals/EmptyGoalsView";
import PlanningFilters from "./PlanningFilters";

interface GoalsListProps {
  onCreateGoal: () => void;
  onEditGoal: (goal: Goal) => void;
  onDeleteGoal: (id: string) => void;
}

interface GoalFilters {
  category: string;
  timeframe: string;
  priority: string;
  status: string;
}

const GoalsList: React.FC<GoalsListProps> = ({ onCreateGoal, onEditGoal, onDeleteGoal }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [filters, setFilters] = useState<GoalFilters>({
    category: 'all',
    timeframe: 'all',
    priority: 'all',
    status: 'all'
  });
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

  const filteredGoals = goals.filter(goal => {
    if (filters.category !== 'all' && goal.category !== filters.category) return false;
    if (filters.timeframe !== 'all' && goal.timeframe !== filters.timeframe) return false;
    if (filters.priority !== 'all' && goal.priority !== filters.priority) return false;
    if (filters.status !== 'all' && goal.status !== filters.status) return false;
    return true;
  });

  const clearFilters = () => {
    setFilters({
      category: 'all',
      timeframe: 'all',
      priority: 'all',
      status: 'all'
    });
  };

  if (goals.length === 0) {
    return <EmptyGoalsView onCreateGoal={onCreateGoal} />;
  }

  return (
    <div className="space-y-6">
      <PlanningFilters
        filterType="goals"
        filters={filters}
        onFiltersChange={(newFilters) => setFilters(newFilters as GoalFilters)}
        onClearFilters={clearFilters}
      />
      
      {filteredGoals.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">No goals match the selected filters</p>
          <p className="text-slate-500 text-sm mt-2">Try adjusting your filters or create a new goal</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={onEditGoal}
              onDelete={onDeleteGoal}
              onUpdateProgress={updateGoalProgress}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GoalsList;
