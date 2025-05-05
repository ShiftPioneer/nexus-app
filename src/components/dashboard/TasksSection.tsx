
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle, Circle, Clock, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// Create a simplified version that doesn't depend on GTD context
const TasksSection = () => {
  // Static sample tasks to display when GTD context isn't available
  const sampleTasks = [
    {
      id: "sample-1",
      title: "Review project proposal",
      status: "todo",
      priority: "Medium",
      dueDate: new Date(),
      timeEstimate: 30
    },
    {
      id: "sample-2",
      title: "Schedule team meeting",
      status: "today",
      priority: "High",
      dueDate: new Date(Date.now() + 86400000)
    }
  ];
  
  const todoTasks = sampleTasks;
  
  // Calculate completion percentage
  const calculateCompletion = () => {
    return 25; // Default sample value
  };
  
  return (
    <Card className="min-h-[100px] h-auto mb-6">
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
          <span>{calculateCompletion()}% tasks completed</span>
        </div>
        
        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full">
          <div 
            className="h-full bg-green-500 rounded-full transition-all duration-700 ease-in-out"
            style={{ width: `${calculateCompletion()}%` }}
          />
        </div>
        
        <div className="space-y-2 pt-2">
          {todoTasks.length > 0 ? (
            todoTasks.map(task => (
              <div key={task.id} className="flex items-start gap-2 p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="pt-0.5">
                  {task.status === "completed" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium truncate">{task.title}</span>
                    {task.priority && (
                      <Badge variant={
                        task.priority === "High" || task.priority === "Very High" 
                          ? "destructive" 
                          : task.priority === "Medium" 
                            ? "default" 
                            : "outline"
                      } className="ml-2 text-xs">
                        {task.priority}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                    {task.dueDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(task.dueDate), "MMM d")}
                      </span>
                    )}
                    {task.timeEstimate && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {task.timeEstimate}m
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-slate-500">No tasks available</p>
              <Link to="/actions" className="text-xs text-blue-600 hover:text-blue-800 mt-2 inline-block">
                Add a task
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TasksSection;
