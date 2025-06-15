
import React from "react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CheckCircle, MoreVertical, Edit, Play, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardHeaderProps {
  task: any;
  isToDoNot: boolean;
  handleMarkComplete: (id: string) => void;
  handleEdit: (id: string) => void;
  handleStartFocus: (task: any) => void;
  handleDelete: (id: string) => void;
}

const TaskCardHeader: React.FC<TaskCardHeaderProps> = ({ 
  task, 
  isToDoNot, 
  handleMarkComplete, 
  handleEdit, 
  handleStartFocus, 
  handleDelete 
}) => {
  return (
    <div className="flex justify-between items-start">
      <div className="flex space-x-3 items-start">
        <div className="mt-0.5">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 rounded-full hover:bg-slate-700" 
            onClick={() => handleMarkComplete(task.id)}
          >
            <CheckCircle 
              className={cn(
                "h-5 w-5", 
                task.status === "completed" 
                  ? "text-green-500" 
                  : task.priority === "High" || task.priority === "Very High" 
                    ? "text-red-500" 
                    : task.priority === "Medium" 
                      ? "text-lime-600" 
                      : "text-slate-500"
              )} 
            />
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
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full hover:bg-slate-700"
          >
            <MoreVertical className="h-4 w-4 text-slate-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 pointer-events-auto">
          <DropdownMenuItem onClick={() => handleMarkComplete(task.id)}>
            {task.status === "completed" 
              ? "Mark Incomplete" 
              : isToDoNot 
                ? "Mark as Avoided" 
                : "Mark Complete"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleEdit(task.id)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStartFocus(task)}>
            <Play className="h-4 w-4 mr-2" />
            Start Focus
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
  );
};

export default TaskCardHeader;
