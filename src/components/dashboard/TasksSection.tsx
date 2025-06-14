import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Plus, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { format, isToday } from "date-fns";
const TasksSection = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<any[]>([]);
  useEffect(() => {
    // Load tasks from localStorage
    const loadTasks = () => {
      try {
        const savedTasks = localStorage.getItem('gtdTasks');
        if (savedTasks) {
          const allTasks = JSON.parse(savedTasks);
          // Filter for today's tasks - either status is "today" or due date is today
          const todayTasks = allTasks.filter((task: any) => {
            if (task.status === "today") return true;
            if (task.dueDate) {
              const taskDate = new Date(task.dueDate);
              return isToday(taskDate);
            }
            return false;
          }).filter((task: any) => task.status !== "completed" && task.status !== "deleted");
          setTasks(todayTasks);
        }
      } catch (error) {
        console.error("Failed to load tasks:", error);
      }
    };
    loadTasks();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadTasks();
    };
    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom events when tasks are updated
    const handleTaskUpdate = () => {
      loadTasks();
    };
    window.addEventListener('tasksUpdated', handleTaskUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tasksUpdated', handleTaskUpdate);
    };
  }, []);
  const handleCompleteTask = (taskId: string) => {
    try {
      const savedTasks = localStorage.getItem('gtdTasks');
      if (savedTasks) {
        const allTasks = JSON.parse(savedTasks);
        const updatedTasks = allTasks.map((task: any) => task.id === taskId ? {
          ...task,
          status: "completed"
        } : task);
        localStorage.setItem('gtdTasks', JSON.stringify(updatedTasks));

        // Trigger custom event to update other components
        window.dispatchEvent(new CustomEvent('tasksUpdated'));

        // Update local state
        setTasks(prev => prev.filter(task => task.id !== taskId));
      }
    } catch (error) {
      console.error("Failed to complete task:", error);
    }
  };
  return <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-slate-950 rounded-md">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Today's Tasks
        </CardTitle>
        <Button size="sm" onClick={() => navigate("/actions")} className="gap-1">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </CardHeader>
      <CardContent className="bg-slate-950 rounded-md">
        {tasks.length === 0 ? <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No tasks scheduled for today</p>
            <Button variant="outline" size="sm" onClick={() => navigate("/actions")}>
              Schedule Tasks
            </Button>
          </div> : <div className="space-y-3">
            {tasks.slice(0, 5).map(task => <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{task.title}</h4>
                  {task.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {task.description}
                    </p>}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {task.priority}
                    </Badge>
                    {task.dueDate && <Badge variant="secondary" className="text-xs">
                        {format(new Date(task.dueDate), "MMM d")}
                      </Badge>}
                  </div>
                </div>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100" onClick={() => handleCompleteTask(task.id)}>
                  <CheckCircle2 className="h-4 w-4" />
                </Button>
              </div>)}
            {tasks.length > 5 && <Button variant="ghost" className="w-full text-sm" onClick={() => navigate("/actions")}>
                View all {tasks.length} tasks
              </Button>}
          </div>}
      </CardContent>
    </Card>;
};
export default TasksSection;