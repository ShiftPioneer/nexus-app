
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { format, isAfter, addDays } from "date-fns";
import { CalendarIcon, Target, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useGTD } from "@/components/gtd/GTDContext";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
  return <Card className="border-slate-800 bg-slate-950/40 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Target className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-slate-100">Active Goals</CardTitle>
              <p className="text-sm text-slate-400 mt-0.5">Your current high-priority objectives</p>
            </div>
          </div>
          <Link to="/planning">
            <Button variant="outline" size="sm" className="text-xs px-3 py-1.5 h-7 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {goals.length > 0 ? goals.slice(0, 3).map((goal: any, index: number) => <motion.div key={goal.id || index} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.3,
          delay: index * 0.05
        }} className="space-y-3 p-4 border border-slate-800 bg-slate-900/50 rounded-lg hover:bg-slate-800/60 hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-slate-100">{goal.title}</span>
                <Badge variant={isOverdue(goal.endDate) ? "destructive" : isDueSoon(goal.endDate) ? "default" : "outline"} className={cn("text-xs", {
              "bg-error/20 text-error-foreground border-error/30": isOverdue(goal.endDate),
              "bg-warning/20 text-warning-foreground border-warning/30": isDueSoon(goal.endDate),
              "bg-slate-700 text-slate-300 border-slate-600": !isOverdue(goal.endDate) && !isDueSoon(goal.endDate)
            })}>
                  {isOverdue(goal.endDate) ? "Overdue" : isDueSoon(goal.endDate) ? "Due Soon" : "On Track"}
                </Badge>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-blue-400 font-medium">Progress</span>
                  <span className="text-xs text-slate-300 font-semibold">{goal.calculatedProgress || 0}%</span>
                </div>
                <Progress value={goal.calculatedProgress || 0} indicatorClassName={cn({
              "bg-blue-400": !isOverdue(goal.endDate),
              "bg-error": isOverdue(goal.endDate)
            })} />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="h-3 w-3" />
                  <span>
                    Due: {formatDate(goal.endDate)}
                  </span>
                </div>
                {goal.taskCount > 0 && <div className="flex items-center gap-1.5">
                    <CheckCircle className="h-3 w-3" />
                    <span>{goal.completedTaskCount}/{goal.taskCount} Tasks</span>
                  </div>}
              </div>
            </motion.div>) : <div className="flex flex-col items-center justify-center py-6 text-center">
            <Target className="h-16 w-16 text-slate-700 mb-4" />
            <h3 className="text-base font-semibold text-white mb-1">Set Your Sights</h3>
            <p className="text-sm text-slate-400 mb-4">Define your goals to start making progress.</p>
            <Link to="/planning">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                Create a Goal
              </Button>
            </Link>
          </div>}
        
        {goals.length > 3 && <div className="text-center pt-2">
            <Link to="/planning" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              View all {goals.length} goals
            </Link>
          </div>}
      </CardContent>
    </Card>;
};
export default GoalSection;
