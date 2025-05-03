
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2, Circle, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGTD } from "@/components/gtd/GTDContext";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

const TasksSection = () => {
  const { tasks, moveTask, updateTask } = useGTD();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [todayTasks, setTodayTasks] = useState<any[]>([]);
  const [completedTasks, setCompletedTasks] = useState<any[]>([]);
  const [progressStats, setProgressStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0
  });
  
  useEffect(() => {
    // Filter tasks for today's tasks that are not "Not To Do" items
    const todayItems = tasks.filter(task => 
      task.status === "today" && !task.isToDoNot
    );
    
    // Count completed tasks for today
    const completedItems = tasks.filter(task => 
      task.status === "completed" && !task.isToDoNot
    );
    
    setTodayTasks(todayItems.filter(task => !task.completed));
    setCompletedTasks(completedItems);
    
    // Calculate stats
    const total = todayItems.length;
    const completed = completedItems.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    setProgressStats({
      total,
      completed,
      pending: total - completed,
      completionRate
    });
    
  }, [tasks]);
  
  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const newStatus = task.status === "completed" ? "today" : "completed";
      moveTask(id, newStatus);
      
      if (task.status !== "completed") {
        toast({
          title: "Task Completed",
          description: `You've completed "${task.title}"!`,
        });
      }
    }
  };
  
  const addNewTask = () => {
    navigate("/actions");
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
            <Button onClick={addNewTask} size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              <span>New Task</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div className="text-base font-medium">
                  Tasks Completed
                </div>
              </div>
              <div className="text-2xl font-bold">
                {progressStats.completed}/{progressStats.total}
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">
                  {progressStats.completionRate}% Complete
                </span>
                <span className="text-xs text-muted-foreground">
                  {progressStats.pending} remaining
                </span>
              </div>
              <Progress value={progressStats.completionRate} className="h-2" />
            </div>

            {todayTasks.length === 0 && completedTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-success mb-2" />
                <h4 className="text-lg font-medium">No tasks for today!</h4>
                <p className="text-sm text-muted-foreground">
                  Add some tasks to get started.
                </p>
                <Button 
                  onClick={() => navigate("/actions")} 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                >
                  Add Tasks
                </Button>
              </div>
            ) : (
              <>
                {todayTasks.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <h4 className="text-sm font-medium mb-2">Pending</h4>
                    {todayTasks.map((task) => (
                      <div 
                        key={task.id} 
                        className={`flex items-center gap-3 p-3 rounded-md border border-border hover:bg-accent/5 transition-colors
                          ${task.priority === 'High' || task.priority === 'Very High' ? 'border-l-4 border-l-warning' : 
                            task.priority === 'Medium' ? 'border-l-4 border-l-primary' : ''}
                        `}
                      >
                        <Checkbox 
                          id={`task-${task.id}`} 
                          checked={task.status === "completed"}
                          onCheckedChange={() => toggleTask(task.id)}
                          className={`h-5 w-5 ${
                            task.priority === 'High' || task.priority === 'Very High' ? 'data-[state=checked]:bg-warning data-[state=checked]:border-warning' :
                            task.priority === 'Medium' ? 'data-[state=checked]:bg-primary data-[state=checked]:border-primary' :
                            'data-[state=checked]:bg-success data-[state=checked]:border-success'
                          }`}
                        />
                        <label 
                          htmlFor={`task-${task.id}`}
                          className="flex-1 text-sm font-medium cursor-pointer"
                        >
                          {task.title}
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                {completedTasks.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Completed</h4>
                    <div className="space-y-2">
                      {completedTasks.slice(0, 3).map((task) => (
                        <div 
                          key={task.id} 
                          className="flex items-center gap-3 p-3 rounded-md bg-muted/20 border border-border"
                        >
                          <Checkbox 
                            id={`task-${task.id}`} 
                            checked={true}
                            onCheckedChange={() => toggleTask(task.id)}
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
                      
                      {completedTasks.length > 3 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full text-muted-foreground" 
                          onClick={() => navigate("/actions")}
                        >
                          View {completedTasks.length - 3} more completed tasks
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default TasksSection;
