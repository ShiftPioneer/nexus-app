import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GTDTask, TaskStatus } from "@/components/gtd/GTDContext";
import { format } from "date-fns";
import {
  Calendar,
  ClipboardCheck,
  Timer,
  CheckCircle2,
  ArrowRight,
  Clock,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface KanbanBoardProps {
  columns: {
    [key: string]: GTDTask[];
  };
  onTaskClick: (task: GTDTask) => void;
  onTaskMove: (taskId: string, newStatus: string) => void;
  getPriorityColor: (priority: string) => string;
  isToDoNot?: boolean;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  onTaskClick,
  onTaskMove,
  getPriorityColor,
  isToDoNot = false
}) => {
  // Column headers with icons and descriptions
  const columnInfo = {
    todo: {
      title: isToDoNot ? "To Avoid" : "To Do",
      icon: <ClipboardCheck className="h-4 w-4" />,
      description: isToDoNot 
        ? "Actions and habits to avoid" 
        : "Tasks that need to be completed",
    },
    today: {
      title: isToDoNot ? "Avoid Today" : "Today",
      icon: <Calendar className="h-4 w-4" />,
      description: isToDoNot 
        ? "Things to avoid today" 
        : "Tasks scheduled for today",
    },
    "in-progress": {
      title: "In Progress",
      icon: <Timer className="h-4 w-4" />,
      description: "Tasks currently being worked on",
    },
    completed: {
      title: isToDoNot ? "Successfully Avoided" : "Completed",
      icon: <CheckCircle2 className="h-4 w-4" />,
      description: isToDoNot 
        ? "Things you've successfully avoided" 
        : "Tasks that have been completed",
    },
  };

  // Function to get the next status for a task
  const getNextStatus = (currentStatus: string): TaskStatus => {
    switch (currentStatus) {
      case "todo":
        return "today";
      case "next-action":
        return "today";
      case "today":
        return "in-progress";
      case "in-progress":
        return "completed";
      case "completed":
        return "todo";
      default:
        return "todo";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Object.keys(columns).map((columnId) => (
        <Card key={columnId}>
          <CardHeader className="py-2 px-3 flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-1 rounded-md">
                {columnInfo[columnId].icon}
              </div>
              <div>
                <h3 className="text-sm font-medium">{columnInfo[columnId].title}</h3>
                <p className="text-xs text-muted-foreground">
                  {columns[columnId].length} {isToDoNot ? "items" : "tasks"}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2 pb-3 px-3">
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
                    onClick={() => onTaskClick(task)}
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
                              className={`${getPriorityColor(
                                task.priority
                              )} text-white`}
                            >
                              {task.priority}
                            </Badge>
                          </div>
                        </div>

                        {/* Move to next status button */}
                        {columnId !== "completed" && (
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              onTaskMove(task.id, getNextStatus(task.status));
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
  );
};

export default KanbanBoard;
