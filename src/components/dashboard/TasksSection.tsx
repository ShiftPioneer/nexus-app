
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Circle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { format, isToday } from "date-fns";
import { motion } from "framer-motion";

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
  return <Card className="border-slate-800 bg-slate-950/40 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-100">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          Today's Focus
        </CardTitle>
        <Button size="sm" onClick={() => navigate("/actions")} className="gap-1 bg-primary/20 text-primary hover:bg-primary/30">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? <div className="text-center py-8 flex flex-col items-center justify-center">
            <CheckCircle2 className="h-16 w-16 text-slate-700 mb-4" />
            <h3 className="text-lg font-semibold text-slate-200">All Clear for Today!</h3>
            <p className="text-slate-400 text-sm mt-1 mb-4">You have no tasks scheduled for today. Time to plan or relax!</p>
            <Button variant="outline" size="sm" onClick={() => navigate("/actions")} className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
              Plan Your Day
            </Button>
          </div> : <div className="space-y-3">
            {tasks.slice(0, 5).map((task, index) => <motion.div key={task.id} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.3,
          delay: index * 0.05
        }} className="group flex items-center gap-4 p-3 rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-800/60 hover:border-slate-700 transition-all">
                <button onClick={() => handleCompleteTask(task.id)} className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-slate-600 group-hover:border-green-500 flex items-center justify-center transition-colors duration-200" aria-label={`Complete task: ${task.title}`}>
                  <Circle className="h-3 w-3 text-slate-600 group-hover:text-green-500 transition-colors" />
                </button>
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-slate-100">{task.title}</h4>
                  {task.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {task.description}
                    </p>}
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="outline" className="text-xs border-primary/30 bg-primary/10 text-primary capitalize">
                      {task.priority}
                    </Badge>
                    {task.dueDate && <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300 border-transparent">
                        <Calendar className="h-3 w-3 mr-1.5" />
                        {format(new Date(task.dueDate), "MMM d")}
                      </Badge>}
                  </div>
                </div>
              </motion.div>)}
            {tasks.length > 5 && <Button variant="ghost" className="w-full text-sm text-primary/80 hover:text-primary" onClick={() => navigate("/actions")}>
                View all {tasks.length} tasks
              </Button>}
          </div>}
      </CardContent>
    </Card>;
};
export default TasksSection;
