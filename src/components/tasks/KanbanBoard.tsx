
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Calendar, ClipboardCheck, Timer, CheckCircle2, ArrowRight, Clock, Tag } from "lucide-react";
import { useGTD } from "@/components/gtd/GTDContext";
import TaskDialog from "./TaskDialog";
import { format } from "date-fns";

interface KanbanBoardProps {
  isToDoNot?: boolean;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ isToDoNot = false }) => {
  const { tasks, addTask, updateTask, deleteTask } = useGTD();
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<string>("");

  const filteredTasks = tasks.filter(task => {
    if (isToDoNot !== !!task.isToDoNot) return false;
    if (task.status === "deleted") return false;
    return true;
  });

  const columns = {
    todo: filteredTasks.filter(task => task.status === "todo"),
    today: filteredTasks.filter(task => task.status === "today"),
    "in-progress": filteredTasks.filter(task => task.status === "in-progress"),
    completed: filteredTasks.filter(task => task.status === "completed")
  };

  const columnInfo = {
    todo: {
      title: isToDoNot ? "To Avoid" : "To Do",
      icon: <ClipboardCheck className="h-4 w-4" />,
      description: isToDoNot ? "Actions and habits to avoid" : "Tasks that need to be completed",
    },
    today: {
      title: isToDoNot ? "Avoid Today" : "Today",
      icon: <Calendar className="h-4 w-4" />,
      description: isToDoNot ? "Things to avoid today" : "Tasks scheduled for today",
    },
    "in-progress": {
      title: "In Progress",
      icon: <Timer className="h-4 w-4" />,
      description: "Tasks currently being worked on",
    },
    completed: {
      title: isToDoNot ? "Successfully Avoided" : "Completed",
      icon: <CheckCircle2 className="h-4 w-4" />,
      description: isToDoNot ? "Things you've successfully avoided" : "Tasks that have been completed",
    },
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case "todo": return "today";
      case "today": return "in-progress";
      case "in-progress": return "completed";
      case "completed": return "todo";
      default: return "todo";
    }
  };

  const handleAddTask = (column: string) => {
    setSelectedColumn(column);
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
      addTask({
        ...task,
        isToDoNot,
        status: selectedColumn || "todo"
      });
    }
  };

  const handleTaskMove = (taskId: string, newStatus: string) => {
    updateTask(taskId, { status: newStatus });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.keys(columns).map((columnId) => (
          <Card key={columnId} className="flex flex-col">
            <CardHeader className="py-2 px-3 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2">
                <div className="bg-primary p-1 rounded-md text-primary-foreground">
                  {columnInfo[columnId].icon}
                </div>
                <div>
                  <CardTitle className="text-sm font-medium">{columnInfo[columnId].title}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {columns[columnId].length} {isToDoNot ? "items" : "tasks"}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAddTask(columnId)}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </CardHeader>
            
            <CardContent className="pt-2 pb-3 px-3 flex-1">
              <div className="text-xs text-muted-foreground mb-3">
                {columnInfo[columnId].description}
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {columns[columnId].length === 0 ? (
                  <div className="border border-dashed rounded-md p-3 text-center text-sm text-muted-foreground">
                    No {isToDoNot ? "items" : "tasks"}
                  </div>
                ) : (
                  columns[columnId].map((task) => (
                    <Card
                      key={task.id}
                      className="cursor-pointer hover:shadow-md transition-all"
                      onClick={() => handleEditTask(task)}
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{task.title}</div>
                            {task.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {task.description}
                              </p>
                            )}

                            <div className="mt-2 flex flex-wrap gap-1">
                              {task.dueDate && (
                                <Badge
                                  variant="outline"
                                  className="flex items-center gap-1 text-xs"
                                >
                                  <Clock className="h-3 w-3" />
                                  {format(new Date(task.dueDate), "MMM d")}
                                </Badge>
                              )}

                              {task.tags && task.tags.length > 0 && (
                                <Badge
                                  variant="outline"
                                  className="flex items-center gap-1 text-xs"
                                >
                                  <Tag className="h-3 w-3" />
                                  {task.tags[0]}
                                  {task.tags.length > 1 && `+${task.tags.length - 1}`}
                                </Badge>
                              )}

                              <Badge
                                className={`${getPriorityColor(task.priority)} text-white text-xs`}
                              >
                                {task.priority}
                              </Badge>
                            </div>
                          </div>

                          {columnId !== "completed" && (
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-6 w-6 rounded-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTaskMove(task.id, getNextStatus(task.status));
                              }}
                              title={`Move to ${getNextStatus(task.status)}`}
                            >
                              <ArrowRight className="h-3 w-3" />
                            </Button>
                          )}
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

export default KanbanBoard;
