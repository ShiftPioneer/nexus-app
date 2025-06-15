
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tag, Calendar, Clock, Target, ClipboardList } from "lucide-react";
import { format } from "date-fns";

interface TaskCardBadgesProps {
  task: any;
  getGoalTitle: (goalId: string) => string;
  getProjectTitle: (projectId: string) => string;
}

const TaskCardBadges: React.FC<TaskCardBadgesProps> = ({ 
  task, 
  getGoalTitle, 
  getProjectTitle 
}) => {
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
    <div className="flex flex-wrap gap-2 mt-3">
      {task.tags?.map((tag: string) => (
        <Badge 
          key={tag} 
          variant="outline" 
          className="text-xs py-0 bg-slate-800 text-slate-300 border-slate-600"
        >
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
        <Badge 
          variant="outline" 
          className="text-xs py-0 flex items-center bg-slate-800 text-slate-300 border-slate-600"
        >
          <Calendar className="h-3 w-3 mr-1" />
          {formatDueDate(task.dueDate)}
        </Badge>
      )}
      
      {task.timeEstimate && (
        <Badge 
          variant="outline" 
          className="text-xs py-0 flex items-center bg-slate-800 text-slate-300 border-slate-600"
        >
          <Clock className="h-3 w-3 mr-1" />
          {task.timeEstimate} min
        </Badge>
      )}
      
      {task.goalId && (
        <Badge variant="default" className="text-xs py-0 bg-blue-700 flex items-center">
          <Target className="h-3 w-3 mr-1" />
          {getGoalTitle(task.goalId)}
        </Badge>
      )}
      
      {task.project && (
        <Badge variant="default" className="text-xs py-0 bg-orange-700 flex items-center">
          <ClipboardList className="h-3 w-3 mr-1" />
          {getProjectTitle(task.project)}
        </Badge>
      )}
    </div>
  );
};

export default TaskCardBadges;
