
import React, { useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { X, Calendar, Tag, Zap, Target } from "lucide-react";
import { format } from "date-fns";

interface TaskFormFieldsProps {
  title: string;
  description: string;

  urgent: boolean;
  important: boolean;

  category: string;
  dueDate?: Date;
  tags: string[];
  tagInput: string;
  taskType: 'todo' | 'not-todo';

  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onUrgentChange: (value: boolean) => void;
  onImportantChange: (value: boolean) => void;
  onCategoryChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
  onTagInputChange: (value: string) => void;
  onAddTag: (e: React.KeyboardEvent) => void;
  onRemoveTag: (tag: string) => void;
}

const TaskFormFields: React.FC<TaskFormFieldsProps> = ({
  title,
  description,
  urgent,
  important,
  category,
  dueDate,
  tags,
  tagInput,
  taskType,
  onTitleChange,
  onDescriptionChange,
  onUrgentChange,
  onImportantChange,
  onCategoryChange,
  onDueDateChange,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
}) => {
  const derivedPriority = useMemo(() => {
    if (urgent && important) return 'urgent';
    if (!urgent && important) return 'high';
    if (urgent && !important) return 'medium';
    return 'low';
  }, [urgent, important]);

  return (
    <>
      <div>
        <Label htmlFor="title" className="text-slate-300">
          {taskType === 'todo' ? 'Task Title' : 'What to Avoid'}
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder={taskType === 'todo' ? 'Enter task title...' : 'Enter what you want to avoid...'}
          className="bg-slate-900 border-slate-700 text-white"
          required
        />
      </div>

      <div>
        <Label htmlFor="description" className="text-slate-300">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Add more details..."
          className="bg-slate-900 border-slate-700 text-white"
          rows={3}
        />
      </div>

      {/* Eisenhower priority */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300">Eisenhower Priority</Label>
          <Badge
            variant="outline"
            className="border-slate-600 text-slate-200 capitalize"
          >
            {derivedPriority}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-slate-300" />
              <div>
                <div className="text-sm font-medium text-white">Urgent</div>
                <div className="text-xs text-slate-400">Time-sensitive</div>
              </div>
            </div>
            <Switch checked={urgent} onCheckedChange={onUrgentChange} />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-slate-300" />
              <div>
                <div className="text-sm font-medium text-white">Important</div>
                <div className="text-xs text-slate-400">Moves goals forward</div>
              </div>
            </div>
            <Switch checked={important} onCheckedChange={onImportantChange} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-slate-300">Category</Label>
          <Input
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            placeholder="Work, Personal, etc."
            className="bg-slate-900 border-slate-700 text-white"
          />
        </div>

        <div>
          <Label className="text-slate-300">Due Date (Optional)</Label>
          <div className="relative">
            <Input
              type="date"
              value={dueDate ? format(dueDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => onDueDateChange(e.target.value)}
              className="bg-slate-900 border-slate-700 text-white"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </div>
      </div>

      <div>
        <Label className="text-slate-300">Tags</Label>
        <div className="space-y-2">
          <Input
            value={tagInput}
            onChange={(e) => onTagInputChange(e.target.value)}
            onKeyDown={onAddTag}
            placeholder="Add tags and press Enter..."
            className="bg-slate-900 border-slate-700 text-white"
          />
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-slate-800 text-slate-300 flex items-center gap-1"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                  <button
                    type="button"
                    onClick={() => onRemoveTag(tag)}
                    className="ml-1 hover:text-slate-100"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TaskFormFields;

