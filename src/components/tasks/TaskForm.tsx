
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Check, X, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { GTDTask, TaskPriority, TaskStatus } from "@/components/gtd/GTDContext";

interface TaskFormProps {
  task: GTDTask | null;
  onSubmit: (taskData: Partial<GTDTask>) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [context, setContext] = useState("");
  const [project, setProject] = useState("");
  const [timeEstimate, setTimeEstimate] = useState<number | undefined>(undefined);

  // Initialize form with task data if editing
  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setPriority(task.priority || "Medium");
      setStatus(task.status || "todo");
      setDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
      setTags(task.tags || []);
      setContext(task.context || "");
      setProject(task.project || "");
      setTimeEstimate(task.timeEstimate);
    } else {
      // Reset form for new task
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setStatus("todo");
      setDueDate(undefined);
      setTags([]);
      setContext("");
      setProject("");
      setTimeEstimate(undefined);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData: Partial<GTDTask> = {
      title,
      description,
      priority,
      status,
      dueDate,
      tags: tags.length > 0 ? tags : undefined,
      context: context || undefined,
      project: project || undefined,
      timeEstimate: timeEstimate || undefined,
    };
    
    onSubmit(taskData);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-4">
          {task ? "Edit Task" : "Create New Task"}
        </h2>
      </div>
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details about this task"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Status
          </label>
          <Select value={status} onValueChange={(val) => setStatus(val as TaskStatus)}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inbox">Inbox</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="next-action">Next Action</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="project">Project</SelectItem>
              <SelectItem value="waiting-for">Waiting For</SelectItem>
              <SelectItem value="someday">Someday</SelectItem>
              <SelectItem value="reference">Reference</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label htmlFor="priority" className="block text-sm font-medium mb-1">
            Priority
          </label>
          <Select value={priority} onValueChange={(val) => setPriority(val as TaskPriority)}>
            <SelectTrigger id="priority">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Very Low">Very Low</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Very High">Very High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
            Due Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="dueDate"
                variant="outline"
                className="w-full justify-start text-left"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : "Set due date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <label htmlFor="timeEstimate" className="block text-sm font-medium mb-1">
            Time Estimate (minutes)
          </label>
          <Input
            id="timeEstimate"
            type="number"
            min="0"
            value={timeEstimate || ""}
            onChange={(e) => setTimeEstimate(
              e.target.value ? parseInt(e.target.value) : undefined
            )}
            placeholder="How long will it take?"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="context" className="block text-sm font-medium mb-1">
          Context
        </label>
        <Input
          id="context"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Where or when will you do this? (e.g., home, work, phone)"
        />
      </div>
      
      <div>
        <label htmlFor="project" className="block text-sm font-medium mb-1">
          Project
        </label>
        <Input
          id="project"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          placeholder="Related project"
        />
      </div>
      
      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-1">
          Tags (press Enter to add)
        </label>
        <Input
          id="tags"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Add tags"
        />
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleRemoveTag(tag)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Check className="mr-2 h-4 w-4" />
          {task ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
