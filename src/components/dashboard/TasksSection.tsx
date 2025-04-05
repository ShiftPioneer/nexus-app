
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2, CheckSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTasks } from "@/contexts/TaskContext";

const TasksSection = () => {
  const { tasks, getTodaysTasks, getCompletionRate, completeTask } = useTasks();
  const { toast } = useToast();
  
  const todaysTasks = getTodaysTasks();
  const pendingTasks = todaysTasks.filter(task => !task.completed);
  const completedTasks = todaysTasks.filter(task => task.completed);

  const completionRate = Math.round(getCompletionRate() * 100);
  
  const handleToggleTask = (id: string) => {
    completeTask(id);
    
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      toast({
        title: "Task Completed",
        description: `You've completed "${task.title}"!`,
      });
    }
  };
  
  const addNewTask = () => {
    toast({
      description: "Task creation coming soon!",
    });
  };

  return (
    <section className="mb-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Today's Focus</CardTitle>
              <CardDescription>Tasks to complete today</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-[#101020] rounded-lg px-3 py-2 flex items-center gap-2 text-white">
                <CheckSquare className="h-5 w-5 text-blue-400" />
                <div>
                  <div className="font-bold">{completedTasks.length}/{todaysTasks.length}</div>
                  <div className="text-xs text-slate-400">{completionRate}% completion rate</div>
                </div>
              </div>
              <Button onClick={addNewTask} size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                <span>New Task</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {pendingTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-success mb-2" />
                <h4 className="text-lg font-medium">All caught up!</h4>
                <p className="text-sm text-muted-foreground">
                  You've completed all your tasks for today.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {pendingTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`flex items-center gap-3 p-3 rounded-md border border-border hover:bg-accent/5 transition-colors
                      ${task.priority === 'high' ? 'border-l-4 border-l-warning' : 
                        task.priority === 'medium' ? 'border-l-4 border-l-primary' : ''}
                    `}
                  >
                    <Checkbox 
                      id={`task-${task.id}`} 
                      checked={task.completed}
                      onCheckedChange={() => handleToggleTask(task.id)}
                      className={`h-5 w-5 ${
                        task.priority === 'high' ? 'data-[state=checked]:bg-warning data-[state=checked]:border-warning' :
                        task.priority === 'medium' ? 'data-[state=checked]:bg-primary data-[state=checked]:border-primary' :
                        'data-[state=checked]:bg-success data-[state=checked]:border-success'
                      }`}
                    />
                    <label 
                      htmlFor={`task-${task.id}`}
                      className="flex-1 text-sm font-medium cursor-pointer"
                    >
                      {task.title}
                    </label>
                    {task.dueTime && (
                      <span className="text-xs px-2 py-1 rounded-full bg-muted/50 text-muted-foreground">
                        {task.dueTime}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {completedTasks.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Completed</h4>
                <div className="space-y-2">
                  {completedTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="flex items-center gap-3 p-3 rounded-md bg-muted/20 border border-border"
                    >
                      <Checkbox 
                        id={`task-${task.id}`} 
                        checked={task.completed}
                        onCheckedChange={() => handleToggleTask(task.id)}
                        className="h-5 w-5 data-[state=checked]:bg-success data-[state=checked]:border-success"
                      />
                      <label 
                        htmlFor={`task-${task.id}`}
                        className="flex-1 text-sm line-through text-muted-foreground cursor-pointer"
                      >
                        {task.title}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default TasksSection;
