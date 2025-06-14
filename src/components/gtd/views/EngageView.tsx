import React, { useState, useEffect } from "react";
import { useGTD } from "../GTDContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import TasksSection from "./engage/TasksSection";
import StatsCard from "./engage/StatsCard";
const EngageView = () => {
  const {
    tasks,
    moveTask
  } = useGTD();
  const [nextActions, setNextActions] = useState<any[]>([]);
  const [todayTasks, setTodayTasks] = useState<any[]>([]);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  useEffect(() => {
    // Get actions scheduled for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Today's tasks - those with status="today" or have a due date of today
    const todayItems = tasks.filter(task => {
      if (task.status === "today") return true;
      if (task.dueDate) {
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === today.getTime();
      }
      return false;
    });

    // Next actions - tasks with status="next-action" or due date in the future
    const nextItems = tasks.filter(task => {
      if (task.status === "next-action") return true;
      if (task.dueDate) {
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() > today.getTime();
      }
      return false;
    });
    setTodayTasks(todayItems);
    setNextActions(nextItems);
  }, [tasks]);
  const handleStartFocus = (task: any) => {
    navigate("/focus", {
      state: {
        task
      }
    });
  };
  const handleCompleteTask = (taskId: string) => {
    moveTask(taskId, "completed");
    toast({
      title: "Task Completed",
      description: "Nice work! Task marked as complete"
    });
  };
  const handleMoveToToday = (taskId: string) => {
    moveTask(taskId, "today");
    toast({
      title: "Action Scheduled",
      description: "Action moved to Today's list"
    });
  };
  const navigateToActions = () => {
    navigate("/actions");
  };
  return <div className="space-y-6">
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }}>
        <TasksSection title="Today's Actions" description="Actions you've scheduled for today" icon={<Calendar className="h-5 w-5 text-primary" />} tasks={todayTasks} emptyMessage="No actions scheduled for today" emptyActionText="Plan Your Day" onEmptyAction={navigateToActions} onStartFocus={handleStartFocus} onCompleteTask={handleCompleteTask} />
        
        <TasksSection title="Next Actions" description="Ready to be scheduled or done next" icon={<Clock className="h-5 w-5 text-primary" />} tasks={nextActions} emptyMessage="No next actions available" emptyActionText="Process Your Inbox" onEmptyAction={navigateToActions} onStartFocus={handleStartFocus} onCompleteTask={handleCompleteTask} onMoveToToday={handleMoveToToday} />
      </motion.div>

      <Card>
        <CardHeader className="bg-slate-950">
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>
            Track your GTD workflow progress
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-slate-950">
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatsCard title="In Inbox" value={tasks.filter(task => task.status === "inbox").length} bgClass="bg-blue-50 dark:bg-blue-900/20" textClass="text-blue-800 dark:text-blue-300" />
              <StatsCard title="Next Actions" value={tasks.filter(task => task.status === "next-action").length} bgClass="bg-purple-50 dark:bg-purple-900/20" textClass="text-purple-800 dark:text-purple-300" />
              <StatsCard title="Waiting For" value={tasks.filter(task => task.status === "waiting-for").length} bgClass="bg-amber-50 dark:bg-amber-900/20" textClass="text-amber-800 dark:text-amber-300" />
              <StatsCard title="Completed" value={tasks.filter(task => task.status === "completed").length} bgClass="bg-green-50 dark:bg-green-900/20" textClass="text-green-800 dark:text-green-300" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default EngageView;