
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { CheckCircle, Circle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Let's simulate getting goals from localStorage for now
// In a real app, this would come from a context or API
const GoalSection = () => {
  const [goals, setGoals] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Try to load goals from localStorage
    try {
      const savedGoals = localStorage.getItem('planningGoals');
      if (savedGoals) {
        const parsedGoals = JSON.parse(savedGoals);
        // Only show active goals
        const activeGoals = parsedGoals.filter((goal: any) => 
          goal.status === 'active' || goal.status === 'in-progress'
        );
        setGoals(activeGoals);
      }
    } catch (error) {
      console.error("Failed to load goals:", error);
    }
  }, []);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Active Goals</CardTitle>
          <Link 
            to="/planning" 
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View All
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.length > 0 ? (
          goals.slice(0, 3).map((goal: any, index: number) => (
            <div key={goal.id || index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{goal.title}</span>
                <span className="text-xs text-muted-foreground">
                  {goal.progress || 0}%
                </span>
              </div>
              <Progress value={goal.progress || 0} className="h-2" />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">No active goals found</p>
            <Link
              to="/planning"
              className="text-xs text-primary hover:underline"
            >
              Create a goal
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalSection;
