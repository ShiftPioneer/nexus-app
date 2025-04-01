
import React from "react";
import { GTDTask, useGTD } from "./GTDContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface TasksListProps {
  tasks: GTDTask[];
}

const TasksList: React.FC<TasksListProps> = ({ tasks }) => {
  const { updateTask, deleteTask } = useGTD();
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Very High":
        return "bg-red-600 text-white";
      case "High":
        return "bg-orange-500 text-white";
      case "Medium":
        return "bg-yellow-500 text-black";
      case "Low":
        return "bg-blue-500 text-white";
      case "Very Low":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };
  
  const handleComplete = (id: string) => {
    updateTask(id, { status: "completed" });
  };
  
  if (tasks.length === 0) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-md p-8 text-center">
        <p className="text-slate-400">No tasks match the selected filter. Add a task or change your filter.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {tasks.map(task => (
        <div 
          key={task.id} 
          className="flex items-center gap-4 p-4 bg-slate-800 border border-slate-700 rounded-md hover:border-slate-600 transition-all"
        >
          <Checkbox 
            checked={task.status === "completed"} 
            onCheckedChange={() => handleComplete(task.id)}
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className={`font-medium ${task.status === "completed" ? "line-through text-slate-500" : "text-slate-200"}`}>
                {task.title}
              </h4>
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
              {task.tags?.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            {task.description && (
              <p className="text-sm text-slate-400 line-clamp-2">{task.description}</p>
            )}
            
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
              {task.dueDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{format(task.dueDate, "MMM d, yyyy")}</span>
                </div>
              )}
              
              {task.context && (
                <span className="bg-slate-700 px-2 py-1 rounded text-slate-300">
                  @{task.context}
                </span>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => updateTask(task.id, { priority: "Very High" })}>
                Set as Very High Priority
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateTask(task.id, { priority: "High" })}>
                Set as High Priority
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateTask(task.id, { priority: "Medium" })}>
                Set as Medium Priority
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateTask(task.id, { priority: "Low" })}>
                Set as Low Priority
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateTask(task.id, { priority: "Very Low" })}>
                Set as Very Low Priority
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => updateTask(task.id, { status: "next-action" })}>
                Move to Next Actions
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateTask(task.id, { status: "project" })}>
                Move to Projects
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateTask(task.id, { status: "waiting-for" })}>
                Move to Waiting For
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateTask(task.id, { status: "someday" })}>
                Move to Someday/Maybe
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateTask(task.id, { status: "reference" })}>
                Move to Reference
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => deleteTask(task.id)} className="text-red-500">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
};

export default TasksList;
