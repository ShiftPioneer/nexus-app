
import React from "react";
import { useGTD } from "./GTDContext";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, MoreVertical, Tag, Calendar } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TasksListProps {
  tasks: any[]; // Using any type to match the existing prop type
  showActions?: boolean;
  onTaskComplete?: (id: string) => void;
}

const TasksList: React.FC<TasksListProps> = ({ 
  tasks,
  showActions = false,
  onTaskComplete
}) => {
  const { updateTask } = useGTD();

  if (!tasks.length) {
    return (
      <Card className="text-center p-6 bg-slate-900 border-slate-700 text-slate-200">
        <p className="text-slate-400">No tasks to display</p>
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
                    Mark Complete
                  </DropdownMenuItem>
                  <DropdownMenuItem>Edit Task</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
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
              {task.dueDate && (
                <Badge variant="outline" className="text-xs py-0 flex items-center bg-slate-800 text-slate-300 border-slate-600">
                  <Calendar className="h-3 w-3 mr-1" />
                  {task.dueDate.toLocaleDateString()}
                </Badge>
              )}
              {task.timeEstimate && (
                <Badge variant="outline" className="text-xs py-0 flex items-center bg-slate-800 text-slate-300 border-slate-600">
                  <Clock className="h-3 w-3 mr-1" />
                  {task.timeEstimate} min
                </Badge>
              )}
            </div>
          </CardHeader>
          {showActions && (
            <CardContent className="pt-0 pb-3 px-4">
              <div className="flex justify-end gap-2 mt-3">
                <Button size="sm" variant="outline" className="text-xs h-7">
                  Edit
                </Button>
                <Button size="sm" className="text-xs h-7 bg-[#0FA0CE] hover:bg-[#0D8CB4] text-white">
                  Start Focus
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
