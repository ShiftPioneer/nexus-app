
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, AlertCircle, Clock, CheckCircle, Archive } from "lucide-react";
import { useGTD } from "@/components/gtd/GTDContext";
import TaskDialog from "./TaskDialog";
import { Badge } from "@/components/ui/badge";

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
      // Check if task is urgent based on priority being "Very High" or having a soon due date
      const taskUrgent = task.priority === "Very High" || (task.dueDate && new Date(task.dueDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000));
      // Check if task is important based on having a goal link or high priority
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
      color: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800",
      tasks: getQuadrantTasks(true, true)
    },
    {
      id: "not-urgent-important", 
      title: "Schedule",
      subtitle: "Not Urgent & Important",
      icon: Clock,
      color: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800",
      tasks: getQuadrantTasks(false, true)
    },
    {
      id: "urgent-not-important",
      title: "Delegate",
      subtitle: "Urgent & Not Important", 
      icon: CheckCircle,
      color: "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800",
      tasks: getQuadrantTasks(true, false)
    },
    {
      id: "not-urgent-not-important",
      title: "Eliminate",
      subtitle: "Not Urgent & Not Important",
      icon: Archive,
      color: "bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800",
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quadrants.map((quadrant) => (
          <Card key={quadrant.id} className={`${quadrant.color} min-h-[400px]`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <quadrant.icon className="h-5 w-5" />
                  <div>
                    <CardTitle className="text-lg">{quadrant.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{quadrant.subtitle}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddTask(quadrant.id)}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                {quadrant.tasks.length} {isToDoNot ? "items" : "tasks"}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {quadrant.tasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No {isToDoNot ? "items" : "tasks"} in this quadrant</p>
                  </div>
                ) : (
                  quadrant.tasks.map((task) => (
                    <Card 
                      key={task.id} 
                      className="cursor-pointer hover:shadow-md transition-all bg-background/80"
                      onClick={() => handleEditTask(task)}
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{task.title}</h4>
                            {task.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {task.description}
                              </p>
                            )}
                            <div className="flex gap-1 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {task.priority}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {task.status}
                              </Badge>
                            </div>
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
