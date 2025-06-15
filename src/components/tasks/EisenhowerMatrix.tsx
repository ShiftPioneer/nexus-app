
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, AlertCircle, Clock, CheckCircle, Archive, Target, Zap } from "lucide-react";
import { useGTD } from "@/components/gtd/GTDContext";
import TaskDialog from "./TaskDialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EisenhowerMatrixProps {
  isToDoNot?: boolean;
}

const EisenhowerMatrix: React.FC<EisenhowerMatrixProps> = ({ isToDoNot = false }) => {
  const { tasks, addTask, updateTask, deleteTask } = useGTD();
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [selectedQuadrant, setSelectedQuadrant] = useState<string>("");

  const filteredTasks = tasks.filter(task => {
    if (isToDoNot !== !!task.isToDoNot) return false;
    if (task.status === "deleted") return false;
    return true;
  });

  const getQuadrantTasks = (urgent: boolean, important: boolean) => {
    return filteredTasks.filter(task => {
      const taskUrgent = task.priority === "Very High" || (task.dueDate && new Date(task.dueDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000));
      const taskImportant = task.goalId || task.priority === "Very High" || task.priority === "High";
      return taskUrgent === urgent && taskImportant === important;
    });
  };

  const quadrants = [
    {
      id: "urgent-important",
      title: "Do First",
      subtitle: "Urgent & Important",
      icon: AlertCircle,
      description: "Crisis, emergencies, deadline-driven projects",
      color: "from-red-500/20 to-red-600/30",
      borderColor: "border-red-500/50",
      iconColor: "text-red-600",
      bgClass: "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/40",
      tasks: getQuadrantTasks(true, true)
    },
    {
      id: "not-urgent-important", 
      title: "Schedule",
      subtitle: "Not Urgent & Important",
      icon: Target,
      description: "Prevention, planning, development, growth",
      color: "from-blue-500/20 to-blue-600/30",
      borderColor: "border-blue-500/50",
      iconColor: "text-blue-600",
      bgClass: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/40",
      tasks: getQuadrantTasks(false, true)
    },
    {
      id: "urgent-not-important",
      title: "Delegate",
      subtitle: "Urgent & Not Important", 
      icon: Zap,
      description: "Interruptions, some calls, some meetings",
      color: "from-lime-500/20 to-lime-600/30",
      borderColor: "border-lime-500/50",
      iconColor: "text-lime-600",
      bgClass: "bg-gradient-to-br from-lime-50 to-lime-100 dark:from-lime-950/30 dark:to-lime-900/40",
      tasks: getQuadrantTasks(true, false)
    },
    {
      id: "not-urgent-not-important",
      title: "Eliminate",
      subtitle: "Not Urgent & Not Important",
      icon: Archive,
      description: "Time wasters, busy work, some social media",
      color: "from-gray-500/20 to-gray-600/30",
      borderColor: "border-gray-500/50",
      iconColor: "text-gray-600",
      bgClass: "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950/30 dark:to-gray-900/40",
      tasks: getQuadrantTasks(false, false)
    }
  ];

  const handleAddTask = (quadrant: string) => {
    setSelectedQuadrant(quadrant);
    setSelectedTask(null);
    setShowTaskDialog(true);
  };

  const handleEditTask = (task: any) => {
    setSelectedTask(task);
    setShowTaskDialog(true);
  };

  const handleSaveTask = (task: any) => {
    if (selectedTask) {
      updateTask(selectedTask.id, task);
    } else {
      const quadrantConfig = {
        "urgent-important": { priority: "Very High" },
        "not-urgent-important": { priority: "High" },
        "urgent-not-important": { priority: "Very High" },
        "not-urgent-not-important": { priority: "Low" }
      };
      
      const config = quadrantConfig[selectedQuadrant as keyof typeof quadrantConfig] || {};
      
      addTask({
        ...task,
        ...config,
        isToDoNot,
        status: "todo"
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full border border-primary/20">
          <Target className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Eisenhower Decision Matrix
          </h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Prioritize {isToDoNot ? "habits to avoid" : "your tasks"} based on urgency and importance. 
          Focus on quadrant 2 for long-term success.
        </p>
      </div>

      {/* Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {quadrants.map((quadrant) => (
          <Card 
            key={quadrant.id} 
            className={cn(
              "relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]",
              quadrant.bgClass,
              quadrant.borderColor,
              "border-2"
            )}
          >
            {/* Gradient Overlay */}
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", quadrant.color)} />
            
            <CardHeader className="relative pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg bg-white/80 dark:bg-black/20", quadrant.iconColor)}>
                    <quadrant.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">{quadrant.title}</CardTitle>
                    <p className="text-sm font-medium opacity-80">{quadrant.subtitle}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleAddTask(quadrant.id)}
                  className="bg-white/80 hover:bg-white/90 dark:bg-black/20 dark:hover:bg-black/30"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-muted-foreground italic">
                  {quadrant.description}
                </p>
                <Badge variant="secondary" className="bg-white/60 dark:bg-black/20">
                  {quadrant.tasks.length} {isToDoNot ? "items" : "tasks"}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="relative pt-0">
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {quadrant.tasks.length === 0 ? (
                  <div className="text-center py-12">
                    <quadrant.icon className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm text-muted-foreground">
                      No {isToDoNot ? "items" : "tasks"} in this quadrant
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Click the + button to add one
                    </p>
                  </div>
                ) : (
                  quadrant.tasks.map((task) => (
                    <Card 
                      key={task.id} 
                      className="cursor-pointer hover:shadow-md transition-all bg-white/80 dark:bg-black/20 backdrop-blur-sm border-white/50 dark:border-gray-700/50"
                      onClick={() => handleEditTask(task)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate">{task.title}</h4>
                            {task.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {task.description}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-1 mt-3">
                              <Badge variant="outline" className="text-xs bg-white/60 dark:bg-black/20">
                                {task.priority}
                              </Badge>
                              <Badge 
                                variant="secondary" 
                                className={cn(
                                  "text-xs",
                                  task.status === "completed" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" :
                                  task.status === "in-progress" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" :
                                  "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                                )}
                              >
                                {task.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {task.goalId && (
                              <div className="w-2 h-2 bg-primary rounded-full" title="Linked to goal" />
                            )}
                            {task.dueDate && new Date(task.dueDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000) && (
                              <div className="w-2 h-2 bg-red-500 rounded-full" title="Due soon" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <TaskDialog
        open={showTaskDialog}
        onOpenChange={setShowTaskDialog}
        task={selectedTask}
        onAddTask={handleSaveTask}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
        isToDoNot={isToDoNot}
      />
    </div>
  );
};

export default EisenhowerMatrix;
