import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import TaskFormFields from "./dialog/TaskFormFields";
import { UnifiedTask, TaskType } from "@/types/unified-tasks";
import { cn } from "@/lib/utils";

interface TaskCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (task: Partial<UnifiedTask>) => void;
  taskType?: 'todo' | 'not-todo';
  editingTask?: UnifiedTask | null;
}

const TaskCreationDialog: React.FC<TaskCreationDialogProps> = ({
  open,
  onOpenChange,
  onCreateTask,
  taskType: initialTaskType = 'todo',
  editingTask
}) => {
  const [taskType, setTaskType] = useState<'todo' | 'not-todo'>(initialTaskType);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [important, setImportant] = useState(true);
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Reset form when dialog opens/closes or editingTask changes
  useEffect(() => {
    if (open && editingTask) {
      setTitle(editingTask.title || "");
      setDescription(editingTask.description || "");
      setTaskType(editingTask.type === 'not-todo' ? 'not-todo' : 'todo');

      // Prefer Eisenhower fields; fall back to legacy priority mapping.
      const derivedUrgent =
        typeof editingTask.urgent === "boolean"
          ? editingTask.urgent
          : editingTask.priority === "urgent" || editingTask.priority === "medium";
      const derivedImportant =
        typeof editingTask.important === "boolean"
          ? editingTask.important
          : editingTask.priority === "urgent" || editingTask.priority === "high";

      setUrgent(derivedUrgent);
      setImportant(derivedImportant);

      setCategory(editingTask.category || "");
      setDueDate(editingTask.dueDate ? new Date(editingTask.dueDate) : undefined);
      setTags(editingTask.tags || []);
    } else if (open && !editingTask) {
      setTitle("");
      setDescription("");
      setTaskType(initialTaskType);
      setUrgent(false);
      setImportant(true);
      setCategory("");
      setDueDate(undefined);
      setTags([]);
    }
    setTagInput("");
  }, [open, editingTask, initialTaskType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateTask({
      title,
      description,
      type: taskType,
      urgent,
      important,
      category: category || 'General',
      dueDate,
      tags
    });

    // Reset form
    setTitle("");
    setDescription("");
    setUrgent(false);
    setImportant(true);
    setCategory("");
    setDueDate(undefined);
    setTags([]);
    setTagInput("");
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const isEditMode = !!editingTask;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit' : 'Create New'} {taskType === 'todo' ? 'Task' : 'Avoidance Item'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Type Toggle */}
          {!isEditMode && (
            <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-xl">
              <button
                type="button"
                onClick={() => setTaskType("todo")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all font-medium text-sm",
                  taskType === "todo" 
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <CheckCircle className="h-4 w-4" />
                To Do
              </button>
              <button
                type="button"
                onClick={() => setTaskType("not-todo")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all font-medium text-sm",
                  taskType === "not-todo" 
                    ? "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <XCircle className="h-4 w-4" />
                Not To Do
              </button>
            </div>
          )}

          <TaskFormFields
            title={title}
            description={description}
            urgent={urgent}
            important={important}
            category={category}
            dueDate={dueDate}
            tags={tags}
            tagInput={tagInput}
            taskType={taskType}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onUrgentChange={setUrgent}
            onImportantChange={setImportant}
            onCategoryChange={setCategory}
            onDueDateChange={(value) => setDueDate(value ? new Date(value) : undefined)}
            onTagInputChange={setTagInput}
            onAddTag={handleAddTag}
            onRemoveTag={removeTag}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={cn(
                "text-white",
                taskType === "todo" 
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600" 
                  : "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600"
              )}
            >
              {isEditMode ? 'Update' : 'Create'} {taskType === 'todo' ? 'Task' : 'Avoidance'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskCreationDialog;
