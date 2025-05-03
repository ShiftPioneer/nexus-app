
import React, { useState, useEffect } from "react";
import { useGTD } from "../GTDContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Play, Check, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import TasksList from "../TasksList";
import { useToast } from "@/hooks/use-toast";

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
    navigate("/focus", { state: { task } });
  };
  
  const handleCompleteTask = (taskId: string) => {
    moveTask(taskId, "completed");
    toast({
      title: "Task Completed",
      description: "Nice work! Task marked as complete",
    });
  };
  
  const handleMoveToToday = (taskId: string) => {
    moveTask(taskId, "today");
    toast({
      title: "Action Scheduled",
      description: "Action moved to Today's list",
    });
  };
  
  return (
    <div className="space-y-6">
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Today's Actions
            </CardTitle>
            <CardDescription>
              Actions you've scheduled for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todayTasks.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <p>No actions scheduled for today</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => navigate("/actions")}
                >
                  Plan Your Day
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {todayTasks.map(task => (
                  <Card key={task.id} className="bg-card/50 border">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-base font-medium">{task.title}</h4>
                          {task.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4 shrink-0">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleStartFocus(task)}
                          >
                            <Play className="h-3 w-3" />
                            <span className="sr-only">Start Focus</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleCompleteTask(task.id)}
                          >
                            <Check className="h-3 w-3" />
                            <span className="sr-only">Complete</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Next Actions
            </CardTitle>
            <CardDescription>
              Ready to be scheduled or done next
            </CardDescription>
          </CardHeader>
          <CardContent>
            {nextActions.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <p>No next actions available</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => navigate("/actions")}
                >
                  Process Your Inbox
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {nextActions.map(task => (
                  <Card key={task.id} className="bg-card/50 border">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-base font-medium">{task.title}</h4>
                          {task.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4 shrink-0">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleMoveToToday(task.id)}
                          >
                            <Calendar className="h-3 w-3" />
                            <span className="sr-only">Schedule Today</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleStartFocus(task)}
                          >
                            <Play className="h-3 w-3" />
                            <span className="sr-only">Start Focus</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>
            Track your GTD workflow progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatsCard 
                title="In Inbox" 
                value={tasks.filter(task => task.status === "inbox").length} 
                bgClass="bg-blue-50 dark:bg-blue-900/20"
                textClass="text-blue-800 dark:text-blue-300"
              />
              <StatsCard 
                title="Next Actions" 
                value={tasks.filter(task => task.status === "next-action").length} 
                bgClass="bg-purple-50 dark:bg-purple-900/20"
                textClass="text-purple-800 dark:text-purple-300"
              />
              <StatsCard 
                title="Waiting For" 
                value={tasks.filter(task => task.status === "waiting-for").length} 
                bgClass="bg-amber-50 dark:bg-amber-900/20"
                textClass="text-amber-800 dark:text-amber-300"
              />
              <StatsCard 
                title="Completed" 
                value={tasks.filter(task => task.status === "completed").length} 
                bgClass="bg-green-50 dark:bg-green-900/20"
                textClass="text-green-800 dark:text-green-300"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: number;
  bgClass: string;
  textClass: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, bgClass, textClass }) => {
  return (
    <div className={`p-4 rounded-lg ${bgClass}`}>
      <h3 className={`text-lg font-medium ${textClass}`}>{value}</h3>
      <p className={`text-sm ${textClass} opacity-90`}>{title}</p>
    </div>
  );
};

export default EngageView;
