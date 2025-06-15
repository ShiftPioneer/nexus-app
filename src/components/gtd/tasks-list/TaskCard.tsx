
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import TaskCardHeader from "./TaskCardHeader";
import TaskCardBadges from "./TaskCardBadges";
import TaskCardActions from "./TaskCardActions";

interface TaskCardProps {
  task: any;
  isToDoNot: boolean;
  showActions: boolean;
  getGoalTitle: (goalId: string) => string;
  getProjectTitle: (projectId: string) => string;
  handleMarkComplete: (id: string) => void;
  handleEdit: (id: string) => void;
  handleStartFocus: (task: any) => void;
  handleDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  isToDoNot, 
  showActions, 
  getGoalTitle, 
  getProjectTitle, 
  handleMarkComplete, 
  handleEdit, 
  handleStartFocus, 
  handleDelete 
}) => {
  return (
    <Card className="bg-slate-900 border-slate-700 text-slate-200">
      <CardHeader className="p-4 pb-0">
        <TaskCardHeader
          task={task}
          isToDoNot={isToDoNot}
          handleMarkComplete={handleMarkComplete}
          handleEdit={handleEdit}
          handleStartFocus={handleStartFocus}
          handleDelete={handleDelete}
        />
        
        <TaskCardBadges
          task={task}
          getGoalTitle={getGoalTitle}
          getProjectTitle={getProjectTitle}
        />
      </CardHeader>
      
      {showActions && (
        <CardContent className="pt-0 pb-3 px-4">
          <TaskCardActions
            task={task}
            isToDoNot={isToDoNot}
            handleEdit={handleEdit}
            handleStartFocus={handleStartFocus}
          />
        </CardContent>
      )}
    </Card>
  );
};

export default TaskCard;
