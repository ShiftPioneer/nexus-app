import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TaskFormFields from "./dialog/TaskFormFields";
import { UnifiedTask, TaskPriority } from "@/types/unified-tasks";

interface TaskCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (task: Partial<UnifiedTask>) => void;
  taskType: 'todo' | 'not-todo';
  editingTask?: UnifiedTask | null;
}

const TaskCreationDialog: React.FC<TaskCreationDialogProps> = ({
  open,
  onOpenChange,
  onCreateTask,
  taskType,
  editingTask
}) => {
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
      setUrgent(false);
      setImportant(true);
      setCategory("");
      setDueDate(undefined);
      setTags([]);
    }
    setTagInput("");
  }, [open, editingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateTask({
      title,
      description,
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
      <DialogContent className="bg-slate-950 border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEditMode ? 'Edit' : 'Create New'} {taskType === 'todo' ? 'Task' : 'Avoidance Item'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="border-slate-600 text-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
            >
              {isEditMode ? 'Update' : 'Create'} {taskType === 'todo' ? 'Task' : 'Avoidance Item'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskCreationDialog;
