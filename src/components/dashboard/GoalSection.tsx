
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { CheckCircle, Circle, CalendarIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";

// Let's improve the goals section by making it dynamic and better functioning
const GoalSection = () => {
  const [goals, setGoals] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Try to load goals from localStorage
    try {
      const savedGoals = localStorage.getItem('planningGoals');
      if (savedGoals) {
        const parsedGoals = JSON.parse(savedGoals);
        // Only show active and in-progress goals
        const activeGoals = parsedGoals.filter((goal: any) => 
          goal.status === 'active' || goal.status === 'in-progress' || goal.status === 'not-started'
        );
        setGoals(activeGoals);
      }
    } catch (error) {
      console.error("Failed to load goals:", error);
    }
  }, []);

  // Function to format date nicely
  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "No deadline";
    try {
      return format(new Date(date), "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <Card className="min-h-[150px] h-auto">
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
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarIcon className="h-3 w-3" />
                <span>Due: {formatDate(goal.endDate)}</span>
              </div>
              {goal.milestones && goal.milestones.length > 0 && (
                <div className="text-xs">
                  <span className="text-muted-foreground">
                    {goal.milestones.filter((m: any) => m.completed).length} of {goal.milestones.length} milestones completed
                  </span>
                </div>
              )}
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
