
import React from "react";
import { useGTD } from "./GTDContext";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, MoreVertical, Tag, Calendar, Edit, Trash } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TasksListProps {
  tasks: any[];
  showActions?: boolean;
  onTaskComplete?: (id: string) => void;
  isToDoNot?: boolean;
  onEdit?: (id: string) => void;
}

const TasksList: React.FC<TasksListProps> = ({ 
  tasks,
  showActions = false,
  onTaskComplete,
  isToDoNot = false,
  onEdit
}) => {
  const { updateTask, deleteTask } = useGTD();

  if (!tasks.length) {
    return (
      <Card className="text-center p-6 bg-slate-900 border-slate-700 text-slate-200">
        <p className="text-slate-400">No {isToDoNot ? "items" : "tasks"} to display</p>
      </Card>
    );
  }

  const handleMarkComplete = (id: string) => {
    if (onTaskComplete) {
      onTaskComplete(id);
    } else {
      updateTask(id, { status: "completed" });
    }
  };

  const handleEdit = (id: string) => {
    if (onEdit) {
      onEdit(id);
    }
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
  };

  // Format date nicely
  const formatDueDate = (date: any) => {
    if (!date) return null;
    try {
      return format(new Date(date), "MMM d");
    } catch (error) {
      return null;
    }
  };

  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <Card key={task.id} className="bg-slate-900 border-slate-700 text-slate-200">
          <CardHeader className="p-4 pb-0">
            <div className="flex justify-between items-start">
              <div className="flex space-x-3 items-start">
                <div className="mt-0.5">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 rounded-full hover:bg-slate-700"
                    onClick={() => handleMarkComplete(task.id)}
                  >
                    <CheckCircle className={cn(
                      "h-5 w-5", 
                      task.status === "completed" ? "text-green-500" :
                      task.priority === "High" || task.priority === "Very High" 
                        ? "text-red-500"
                        : task.priority === "Medium"
                          ? "text-yellow-500"
                          : "text-slate-500"
                    )} />
                  </Button>
                </div>
                <div>
                  <CardTitle className="text-base font-medium mb-1">{task.title}</CardTitle>
                  {task.description && (
                    <CardDescription className="text-sm text-slate-400 line-clamp-2">
                      {task.description}
                    </CardDescription>
                  )}
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-slate-700">
                    <MoreVertical className="h-4 w-4 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => handleMarkComplete(task.id)}>
                    {task.status === "completed" ? "Mark Incomplete" : (isToDoNot ? "Mark as Avoided" : "Mark Complete")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEdit(task.id)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-500"
                    onClick={() => handleDelete(task.id)}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
              {task.tags?.map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs py-0 bg-slate-800 text-slate-300 border-slate-600">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              {task.context && (
                <Badge className="bg-slate-700 hover:bg-slate-600 text-xs">
                  @ {task.context}
                </Badge>
              )}
              {task.dueDate && formatDueDate(task.dueDate) && (
                <Badge variant="outline" className="text-xs py-0 flex items-center bg-slate-800 text-slate-300 border-slate-600">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDueDate(task.dueDate)}
                </Badge>
              )}
              {task.timeEstimate && (
                <Badge variant="outline" className="text-xs py-0 flex items-center bg-slate-800 text-slate-300 border-slate-600">
                  <Clock className="h-3 w-3 mr-1" />
                  {task.timeEstimate} min
                </Badge>
              )}
              {task.goalId && (
                <Badge variant="default" className="text-xs py-0 bg-blue-700">
                  Linked to Goal
                </Badge>
              )}
            </div>
          </CardHeader>
          {showActions && (
            <CardContent className="pt-0 pb-3 px-4">
              <div className="flex justify-end gap-2 mt-3">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs h-7"
                  onClick={() => handleEdit(task.id)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button size="sm" className="text-xs h-7 bg-[#0FA0CE] hover:bg-[#0D8CB4] text-white">
                  {isToDoNot ? "Focus on Avoiding" : "Start Focus"}
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};

export default TasksList;
