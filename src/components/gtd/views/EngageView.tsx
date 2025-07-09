
import React, { useState, useEffect } from "react";
import { useGTD } from "../GTDContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, Clock, TrendingUp, Target, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import TasksSection from "./engage/TasksSection";
import StatsCard from "./engage/StatsCard";

const EngageView = () => {
  const { tasks, moveTask } = useGTD();
  const [nextActions, setNextActions] = useState<any[]>([]);
  const [todayTasks, setTodayTasks] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

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
      state: { task }
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

  const completedToday = tasks.filter(task => 
    task.status === "completed" && 
    new Date(task.createdAt).toDateString() === new Date().toDateString()
  ).length;

  const totalActions = nextActions.length + todayTasks.length;
  const completionRate = totalActions > 0 ? Math.round((completedToday / totalActions) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Enhanced Productivity Overview */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{todayTasks.length}</p>
                <p className="text-sm text-slate-400">Today's Focus</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{completedToday}</p>
                <p className="text-sm text-slate-400">Completed Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{completionRate}%</p>
                <p className="text-sm text-slate-400">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Task Sections */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6" 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <TasksSection 
          title="Today's Actions" 
          description="Actions you've scheduled for today" 
          icon={<Calendar className="h-5 w-5 text-primary" />} 
          tasks={todayTasks} 
          emptyMessage="No actions scheduled for today" 
          emptyActionText="Plan Your Day" 
          onEmptyAction={navigateToActions} 
          onStartFocus={handleStartFocus} 
          onCompleteTask={handleCompleteTask} 
        />
        
        <TasksSection 
          title="Next Actions" 
          description="Ready to be scheduled or done next" 
          icon={<Clock className="h-5 w-5 text-primary" />} 
          tasks={nextActions} 
          emptyMessage="No next actions available" 
          emptyActionText="Process Your Inbox" 
          onEmptyAction={navigateToActions} 
          onStartFocus={handleStartFocus} 
          onCompleteTask={handleCompleteTask} 
          onMoveToToday={handleMoveToToday} 
        />
      </motion.div>

      {/* Enhanced Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <TrendingUp className="h-5 w-5" />
              Your Progress
            </CardTitle>
            <CardDescription className="text-slate-400">
              Track your GTD workflow progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatsCard 
                title="In Inbox" 
                value={tasks.filter(task => task.status === "inbox").length} 
                bgClass="bg-blue-500/20" 
                textClass="text-blue-400" 
              />
              <StatsCard 
                title="Next Actions" 
                value={tasks.filter(task => task.status === "next-action").length} 
                bgClass="bg-purple-500/20" 
                textClass="text-purple-400" 
              />
              <StatsCard 
                title="Waiting For" 
                value={tasks.filter(task => task.status === "waiting-for").length} 
                bgClass="bg-amber-500/20" 
                textClass="text-amber-400" 
              />
              <StatsCard 
                title="Completed" 
                value={tasks.filter(task => task.status === "completed").length} 
                bgClass="bg-green-500/20" 
                textClass="text-green-400" 
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EngageView;
