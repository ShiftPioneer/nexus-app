
// Create TaskDialog enhancement with date picker and goal linking
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGTD } from "@/components/gtd/GTDContext";
import { GTDTask } from "@/types/gtd";
import { loadFromStorage } from "@/hooks/use-persistence";

// Define TaskForm props interface here to avoid type errors
interface TaskFormProps {
  onSubmit: (taskData: Partial<GTDTask>) => void;
  isToDoNot?: boolean;
  extraFields?: React.ReactNode;
  initialTask?: GTDTask;
}

// Import TaskForm after defining its props
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
  const { addTask, updateTask } = useGTD();
  const [dueDate, setDueDate] = useState<Date | undefined>(initialTask?.dueDate);
  const [goals, setGoals] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [linkedGoalId, setLinkedGoalId] = useState<string | undefined>(initialTask?.goalId);
  const [linkedProjectId, setLinkedProjectId] = useState<string | undefined>(initialTask?.project);
  
  useEffect(() => {
    // Load goals and projects from localStorage
    try {
      const savedGoals = loadFromStorage('planningGoals', []);
      const savedProjects = loadFromStorage('planningProjects', []);
      setGoals(savedGoals);
      setProjects(savedProjects);
    } catch (error) {
      console.error("Failed to load goals/projects:", error);
    }
    
    // Reset form when initialTask changes
    if (initialTask) {
      setDueDate(initialTask.dueDate);
      setLinkedGoalId(initialTask.goalId);
      setLinkedProjectId(initialTask.project);
    } else {
      setDueDate(undefined);
      setLinkedGoalId(undefined);
      setLinkedProjectId(undefined);
    }
  }, [initialTask, open]);

  const handleSave = (taskData: Partial<GTDTask>) => {
    const task = {
      ...taskData,
      dueDate,
      goalId: linkedGoalId,
      project: linkedProjectId,
      isToDoNot
    };

    if (initialTask) {
      if (onUpdateTask) {
        onUpdateTask(initialTask.id, task);
      } else {
        updateTask(initialTask.id, task);
      }
    } else {
      if (onAddTask) {
        onAddTask(task as Omit<GTDTask, "id" | "createdAt">);
      } else {
        addTask(task as Omit<GTDTask, "id" | "createdAt">);
      }
    }
    
    onOpenChange(false);
  };

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
          isToDoNot={isToDoNot}
          extraFields={
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* Goal Selection */}
              <div>
                <label className="block text-sm font-medium mb-1">Linked Goal</label>
                <select 
                  className="w-full px-3 py-2 border rounded-md"
                  value={linkedGoalId || ""}
                  onChange={(e) => setLinkedGoalId(e.target.value || undefined)}
                >
                  <option value="">None</option>
                  {goals.map((goal) => (
                    <option key={goal.id} value={goal.id}>
                      {goal.title}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Project Selection */}
              <div>
                <label className="block text-sm font-medium mb-1">Linked Project</label>
                <select 
                  className="w-full px-3 py-2 border rounded-md"
                  value={linkedProjectId || ""}
                  onChange={(e) => setLinkedProjectId(e.target.value || undefined)}
                >
                  <option value="">None</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          }
        />
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
