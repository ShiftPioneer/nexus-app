
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGTD } from "../GTDContext";
import { useFocusTimer } from "@/components/focus/FocusTimerService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TasksPanel from "./engage/TasksPanel";
import ContextPanel from "./engage/ContextPanel";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Clock, Play, Pause, RotateCcw, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EngageView: React.FC = () => {
  const [activeTab, setActiveTab] = useState("tasks");
  const { tasks, updateTask } = useGTD();
  const { 
    isTimerRunning, 
    timeRemaining, 
    timerProgress, 
    category,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer 
  } = useFocusTimer();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Filter tasks that are next actions and not completed/deleted
  const nextActionTasks = tasks.filter(task => 
    task.status === "next-action" && 
    task.status !== "completed" &&
    task.status !== "deleted"
  );
  
  // Fix TypeScript error by using proper type guard
  const activeNextActionTasks = tasks.filter(task => {
    return task.status === "next-action" && !["completed", "deleted"].includes(task.status);
  });
  
  // Filter tasks by context
  const contexts = Array.from(
    new Set(tasks.filter(t => t.context).map(t => t.context))
  ) as string[];

  const handleStartFocus = (taskTitle: string) => {
    setSelectedTask(taskTitle);
    startTimer(25, taskTitle); // 25-minute focus session with task name as category
    
    toast({
      title: "Focus session started",
      description: `Now focusing on: ${taskTitle}`,
    });
  };

  const handleCompleteTask = (taskId: string) => {
    updateTask(taskId, { status: "completed" });
    
    // If this is the selected task and timer is running, stop it
    const task = tasks.find(t => t.id === taskId);
    if (task && selectedTask === task.title && isTimerRunning) {
      stopTimer();
      setSelectedTask(null);
    }
    
    toast({
      title: "Task completed",
      description: "Task has been marked as complete",
    });
  };

  const toggleTimer = () => {
    if (isTimerRunning) {
      pauseTimer();
    } else {
      resumeTimer();
    }
  };

  const stopFocusSession = () => {
    stopTimer();
    setSelectedTask(null);
    
    // Record completed session if there was progress
    if (timerProgress > 0) {
      toast({
        title: "Focus session ended",
        description: "Your focus session has been recorded",
      });
      
      // Navigate to focus page to see stats
      navigate('/focus');
    }
  };

  // Format time as MM:SS
  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {selectedTask && (isTimerRunning || timerProgress > 0) ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>Current Focus Session</span>
                  </div>
                  <span className="text-2xl font-mono">
                    {formatTime(timeRemaining.minutes, timeRemaining.seconds)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{selectedTask}</h3>
                  
                  <Progress value={timerProgress} className="h-2" />
                  
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {isTimerRunning ? "Currently focusing on this task" : "Session paused"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleTimer}
                      >
                        {isTimerRunning ? (
                          <>
                            <Pause className="h-4 w-4 mr-1" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            Resume
                          </>
                        )}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resetTimer()}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Reset
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={stopFocusSession}
                        className="text-destructive"
                      >
                        Stop Session
                      </Button>
                      
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          const taskToComplete = tasks.find(t => t.title === selectedTask);
                          if (taskToComplete) {
                            handleCompleteTask(taskToComplete.id);
                          }
                        }}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Complete Task
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="contexts">Contexts</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tasks" className="mt-4">
                <TasksPanel 
                  tasks={activeNextActionTasks}
                  onStartFocus={handleStartFocus}
                  onCompleteTask={handleCompleteTask}
                />
              </TabsContent>
              
              <TabsContent value="contexts" className="mt-4">
                <ContextPanel 
                  tasks={activeNextActionTasks}
                  contexts={contexts}
                  onStartFocus={handleStartFocus}
                  onCompleteTask={handleCompleteTask}
                />
              </TabsContent>
            </Tabs>
          )}
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Session Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Today's Sessions</h4>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">25 minutes average</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Completed Tasks</h4>
                  <div className="text-2xl font-bold">
                    {tasks.filter(t => t.status === "completed").length}
                  </div>
                  <p className="text-xs text-muted-foreground">Today</p>
                </div>
                
                <Button 
                  onClick={() => navigate('/focus')}
                  className="w-full"
                >
                  View All Focus Statistics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EngageView;
