
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useGTD } from "@/components/gtd/GTDContext";
import { CheckCircle, Circle, Clock, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { format, isToday, parseISO } from "date-fns";

const TasksSection = () => {
  const { tasks } = useGTD();
  
  // Filter to get only today's tasks
  const todayTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    try {
      const taskDate = typeof task.dueDate === 'string' ? parseISO(task.dueDate) : task.dueDate;
      return isToday(taskDate) && (
        task.status === "do-it" || 
        task.status === "today" || 
        task.status === "next-action" || 
        task.status === "todo"
      );
    } catch (error) {
      return false;
    }
  }).slice(0, 5);
  
  // Calculate today's completion percentage
  const calculateTodayCompletion = () => {
    const totalTodayTasks = tasks.filter(task => {
      if (!task.dueDate) return false;
      try {
        const taskDate = typeof task.dueDate === 'string' ? parseISO(task.dueDate) : task.dueDate;
        return isToday(taskDate) && !task.isToDoNot;
      } catch (error) {
        return false;
      }
    }).length;
    
    if (!totalTodayTasks || totalTodayTasks === 0) return 0;
    
    const completedTodayTasks = tasks.filter(task => {
      if (!task.dueDate) return false;
      try {
        const taskDate = typeof task.dueDate === 'string' ? parseISO(task.dueDate) : task.dueDate;
        return isToday(taskDate) && task.status === "completed" && !task.isToDoNot;
      } catch (error) {
        return false;
      }
    }).length;
    
    return Math.round((completedTodayTasks / totalTodayTasks) * 100);
  };
  
  return (
    <Card className="min-h-[100px] h-auto mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Today's Tasks</CardTitle>
          <Link 
            to="/actions" 
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            View All
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
          <span>Today's Progress</span>
          <span>{calculateTodayCompletion()}% completed</span>
        </div>
        
        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-700 ease-in-out"
            style={{ width: `${calculateTodayCompletion()}%` }}
          />
        </div>
        
        <div className="space-y-2 pt-2">
          {todayTasks.length > 0 ? (
            todayTasks.map(task => (
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
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Today
                    </span>
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
              <p className="text-sm text-slate-500">No tasks scheduled for today</p>
              <Link to="/actions" className="text-xs text-blue-600 hover:text-blue-800 mt-2 inline-block font-medium">
                Add a task for today
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TasksSection;
