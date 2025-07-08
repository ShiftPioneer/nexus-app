import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TaskFormFields from "./dialog/TaskFormFields";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  dueDate?: Date;
  createdAt: Date;
  tags?: string[];
  type: 'todo' | 'not-todo';
}

interface TaskCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (task: Partial<Task>) => void;
  taskType: 'todo' | 'not-todo';
  editingTask?: Task | null;
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
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Reset form when dialog opens/closes or editingTask changes
  useEffect(() => {
    if (open && editingTask) {
      // Populate form with existing task data
      setTitle(editingTask.title || "");
      setDescription(editingTask.description || "");
      setPriority(editingTask.priority || 'medium');
      setCategory(editingTask.category || "");
      setDueDate(editingTask.dueDate ? new Date(editingTask.dueDate) : undefined);
      setTags(editingTask.tags || []);
    } else if (open && !editingTask) {
      // Reset form for new task
      setTitle("");
      setDescription("");
      setPriority('medium');
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
      priority,
      category: category || 'General',
      dueDate,
      tags
    });

    // Reset form
    setTitle("");
    setDescription("");
    setPriority('medium');
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
            priority={priority}
            category={category}
            dueDate={dueDate}
            tags={tags}
            tagInput={tagInput}
            taskType={taskType}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onPriorityChange={setPriority}
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
