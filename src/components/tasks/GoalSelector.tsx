
import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target } from "lucide-react";

interface GoalSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

const GoalSelector: React.FC<GoalSelectorProps> = ({
  value,
  onValueChange,
  placeholder = "Select a goal (optional)"
}) => {
  const [goals, setGoals] = useState<any[]>([]);

  useEffect(() => {
    try {
      const savedGoals = localStorage.getItem('planningGoals');
      if (savedGoals) {
        const parsedGoals = JSON.parse(savedGoals);
        const activeGoals = parsedGoals.filter((goal: any) => 
          goal.status !== 'completed'
        );
        setGoals(activeGoals);
      }
    } catch (error) {
      console.error("Error loading goals:", error);
    }
  }, []);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="pointer-events-auto">
        <SelectItem value="none">None</SelectItem>
        {goals.map((goal) => (
          <SelectItem key={goal.id} value={goal.id}>
            <div className="flex items-center">
              <Target className="h-4 w-4 mr-2 text-primary" />
              {goal.title}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default GoalSelector;
