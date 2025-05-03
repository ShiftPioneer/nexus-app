
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useGTD, GTDTask } from "@/components/gtd/GTDContext";
import { CheckCircle, Circle } from "lucide-react";
import { Link } from "react-router-dom";

const TasksSection = () => {
  const { tasks } = useGTD();
  
  // Filter to get only do it tasks (equivalent to "to do" tasks)
  const todoTasks = tasks.filter(task => 
    task.status === "do-it" && !task.isToDoNot
  ).slice(0, 5); // Show only top 5 tasks
  
  // Calculate completion percentage
  const calculateCompletion = () => {
    if (!tasks || tasks.length === 0) return 0;
    
    // Count tasks that have been categorized (moved out of inbox)
    const completedTasks = tasks.filter(task => task.status !== "inbox").length;
    return Math.round((completedTasks / tasks.length) * 100);
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Tasks</CardTitle>
          <Link 
            to="/actions" 
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View All
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
          <span>Progress</span>
          <span>{calculateCompletion()}% tasks categorized</span>
        </div>
        
        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full">
          <div 
            className="h-full bg-green-500 rounded-full"
            style={{ width: `${calculateCompletion()}%` }}
          />
        </div>
        
        <div className="space-y-2 pt-2">
          {todoTasks.length > 0 ? (
            todoTasks.map(task => (
              <div key={task.id} className="flex items-center gap-2">
                {task.status === "do-it" ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-400" />
                )}
                <span className="text-sm truncate">{task.title}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No tasks available</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TasksSection;
