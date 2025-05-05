
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GTDTask } from "@/types/gtd";
import TaskForm from './TaskForm';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTask?: GTDTask;
  isToDoNot?: boolean;
  onAddTask?: (task: Partial<GTDTask>) => void;
  onUpdateTask?: (id: string, updates: Partial<GTDTask>) => void;
  onDeleteTask?: (id: string) => void;
}

const TaskDialog: React.FC<TaskDialogProps> = ({ 
  open, 
  onOpenChange,
  initialTask,
  isToDoNot = false,
  onAddTask,
  onUpdateTask,
  onDeleteTask
}: TaskDialogProps) => {
  
  const handleSave = (taskData: Partial<GTDTask>) => {
    if (initialTask) {
      if (onUpdateTask) {
        // For updates, we need to clean up any values to ensure they are properly processed
        const cleanData = { ...taskData };
        if (cleanData.goalId === "none") cleanData.goalId = undefined;
        if (cleanData.project === "none") cleanData.project = undefined;
        
        onUpdateTask(initialTask.id, cleanData);
      }
    } else {
      if (onAddTask) {
        // For new tasks, also clean up values
        const cleanData = { ...taskData } as Omit<GTDTask, "id" | "createdAt">;
        if (cleanData.goalId === "none") cleanData.goalId = undefined;
        if (cleanData.project === "none") cleanData.project = undefined;
        
        onAddTask(cleanData);
      }
    }
    
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialTask ? "Edit Task" : isToDoNot ? "Add Not-To-Do" : "Add Task"}
          </DialogTitle>
          <DialogDescription>
            {isToDoNot 
              ? "Add something you want to avoid doing" 
              : "Enter the details for your task"
            }
          </DialogDescription>
        </DialogHeader>
        
        <TaskForm 
          initialTask={initialTask}
          onSubmit={handleSave}
          onCancel={handleCancel}
          isToDoNot={isToDoNot}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
