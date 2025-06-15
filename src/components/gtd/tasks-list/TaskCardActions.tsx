
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Play } from "lucide-react";

interface TaskCardActionsProps {
  task: any;
  isToDoNot: boolean;
  handleEdit: (id: string) => void;
  handleStartFocus: (task: any) => void;
}

const TaskCardActions: React.FC<TaskCardActionsProps> = ({ 
  task, 
  isToDoNot, 
  handleEdit, 
  handleStartFocus 
}) => {
  return (
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
      <Button 
        size="sm" 
        className="text-xs h-7 bg-[#0FA0CE] hover:bg-[#0D8CB4] text-white" 
        onClick={() => handleStartFocus(task)}
      >
        <Play className="h-3 w-3 mr-1" />
        {isToDoNot ? "Focus on Avoiding" : "Start Focus"}
      </Button>
    </div>
  );
};

export default TaskCardActions;
