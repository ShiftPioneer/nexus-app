import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { format, isAfter, addDays } from "date-fns";
import { CalendarIcon, Target, AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useGTD } from "@/components/gtd/GTDContext";
const GoalSection = () => {
  const [goals, setGoals] = useState<any[]>([]);
  const {
    tasks
  } = useGTD();
  useEffect(() => {
    // Try to load goals from localStorage
    try {
      const savedGoals = localStorage.getItem('planningGoals');
      if (savedGoals) {
        const parsedGoals = JSON.parse(savedGoals);

        // Sort by due date (closest first)
        const sortedGoals = parsedGoals.filter((goal: any) => goal.status === 'active' || goal.status === 'in-progress' || goal.status === 'not-started').sort((a: any, b: any) => {
          const dateA = a.endDate ? new Date(a.endDate) : new Date();
          const dateB = b.endDate ? new Date(b.endDate) : new Date();
          return dateA.getTime() - dateB.getTime();
        });

        // Count linked tasks for each goal
        const goalsWithTaskCounts = sortedGoals.map((goal: any) => {
          const linkedTasks = tasks.filter(task => task.goalId === goal.id);
          const completedTasks = linkedTasks.filter(task => task.status === "completed");
          return {
            ...goal,
            taskCount: linkedTasks.length,
            completedTaskCount: completedTasks.length,
            // Calculate progress based on milestones and linked tasks
            calculatedProgress: calculateGoalProgress(goal, linkedTasks)
          };
        });
        setGoals(goalsWithTaskCounts);
      }
    } catch (error) {
      console.error("Failed to load goals:", error);
    }
  }, [tasks]);

  // Calculate goal progress based on milestones and linked tasks
  const calculateGoalProgress = (goal: any, linkedTasks: any[]) => {
    let progress = goal.progress || 0;

    // If the goal has milestones, use those for progress calculation
    if (goal.milestones && goal.milestones.length > 0) {
      const completedMilestones = goal.milestones.filter((m: any) => m.completed).length;
      progress = Math.round(completedMilestones / goal.milestones.length * 100);
    }
    // If there are linked tasks and no specific progress is set, calculate from tasks
    else if (linkedTasks.length > 0 && progress === 0) {
      const completedTasks = linkedTasks.filter(task => task.status === "completed").length;
      progress = linkedTasks.length > 0 ? Math.round(completedTasks / linkedTasks.length * 100) : 0;
    }
    return progress;
  };

  // Function to format date nicely
  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "No deadline";
    try {
      return format(new Date(date), "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  // Function to determine if a goal is overdue
  const isOverdue = (date: string | Date | undefined) => {
    if (!date) return false;
    try {
      return isAfter(new Date(), new Date(date));
    } catch (error) {
      return false;
    }
  };

  // Function to determine if a goal is due soon (within 3 days)
  const isDueSoon = (date: string | Date | undefined) => {
    if (!date) return false;
    try {
      const dueDate = new Date(date);
      const soon = addDays(new Date(), 3);
      return !isAfter(dueDate, soon) && !isAfter(new Date(), dueDate);
    } catch (error) {
      return false;
    }
  };
  return <Card className="min-h-[100px] h-auto rounded-md">
      <CardHeader className="pb-2 bg-slate-950 rounded-md">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Active Goals</CardTitle>
          <Link to="/planning" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            View All
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 bg-slate-950 rounded-md">
        {goals.length > 0 ? goals.slice(0, 3).map((goal: any, index: number) => <div key={goal.id || index} className="space-y-2 p-3 border rounded-md">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-lime-500">{goal.title}</span>
                </div>
                <Badge variant={isOverdue(goal.endDate) ? "destructive" : isDueSoon(goal.endDate) ? "default" : "outline"} className="text-xs bg-lime-500 text-slate-200 ">
                  {isOverdue(goal.endDate) ? "Overdue" : isDueSoon(goal.endDate) ? "Due Soon" : goal.endDate ? "On Track" : "No Deadline"}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  Progress
                </span>
                <span className="text-xs text-muted-foreground">
                  {goal.calculatedProgress || 0}%
                </span>
              </div>
              
              <Progress value={goal.calculatedProgress || 0} className="h-2" color={isOverdue(goal.endDate) ? "bg-red-500" : undefined} />
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarIcon className="h-3 w-3" />
                <span className={isOverdue(goal.endDate) ? "text-red-500" : ""}>
                  Due: {formatDate(goal.endDate)}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 text-xs">
                {goal.taskCount > 0 && <div className="flex items-center gap-1 text-muted-foreground">
                    <CheckCircle className="h-3 w-3" />
                    <span>{goal.completedTaskCount} of {goal.taskCount} tasks completed</span>
                  </div>}
                
                {goal.milestones && goal.milestones.length > 0 && <div className="flex items-center gap-1 text-muted-foreground">
                    <Target className="h-3 w-3" />
                    <span>
                      {goal.milestones.filter((m: any) => m.completed).length} of {goal.milestones.length} milestones completed
                    </span>
                  </div>}
              </div>
            </div>) : <div className="flex flex-col items-center justify-center py-6 text-center">
            <Target className="h-10 w-10 text-muted-foreground opacity-50 mb-2" />
            <p className="text-sm text-muted-foreground mb-2">No active goals found</p>
            <Link to="/planning" className="text-xs text-primary hover:underline">
              Create a goal
            </Link>
          </div>}
        
        {goals.length > 0 && goals.length > 3 && <div className="text-center pt-2">
            <Link to="/planning" className="text-xs text-primary hover:underline">
              View all {goals.length} goals
            </Link>
          </div>}
      </CardContent>
    </Card>;
};
export default GoalSection;