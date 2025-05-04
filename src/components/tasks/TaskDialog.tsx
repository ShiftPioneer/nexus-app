
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, X, Check, Trash } from "lucide-react";
import { format } from "date-fns";

export interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: any | null;
  onAddTask: (task: any) => void;
  onUpdateTask: (id: string, updates: any) => void;
  onDeleteTask: (id: string) => void;
}

const TaskDialog: React.FC<TaskDialogProps> = ({
  open,
  onOpenChange,
  task,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<string>("todo");
  const [priority, setPriority] = useState<string>("Medium");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [project, setProject] = useState("");
  const [goalId, setGoalId] = useState<string>("");
  const [goals, setGoals] = useState<any[]>([]);
  
  // Load goals for selection
  useEffect(() => {
    try {
      const savedGoals = localStorage.getItem('planningGoals');
      if (savedGoals) {
        const parsedGoals = JSON.parse(savedGoals);
        // Only show active and in-progress goals
        const activeGoals = parsedGoals.filter((goal: any) => 
          goal.status !== 'completed'
        );
        setGoals(activeGoals);
      }
    } catch (error) {
      console.error("Failed to load goals:", error);
    }
  }, [open]);
  
  // Reset form when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "todo");
      setPriority(task.priority || "Medium");
      setDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
      setTags(task.tags || []);
      setProject(task.project || "");
      setGoalId(task.goalId || "");
    } else {
      // Reset form for new task
      setTitle("");
      setDescription("");
      setStatus("todo");
      setPriority("Medium");
      setDueDate(undefined);
      setTags([]);
      setProject("");
      setGoalId("");
    }
  }, [task]);

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
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    const taskData = {
      title,
      description,
      status,
      priority,
      dueDate,
      tags,
      project: project || undefined,
      goalId: goalId || undefined,
    };

    if (task) {
      onUpdateTask(task.id, taskData);
    } else {
      onAddTask(taskData);
    }

    onOpenChange(false);
  };

  const handleDelete = () => {
    if (task) {
      onDeleteTask(task.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "New Task"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-2"
            />
          </div>
          
          <div>
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
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
          
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Set due date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <Select value={goalId} onValueChange={setGoalId}>
              <SelectTrigger>
                <SelectValue placeholder="Link to Goal (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {goals.map((goal) => (
                  <SelectItem key={goal.id} value={goal.id}>
                    {goal.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Input
              placeholder="Project"
              value={project}
              onChange={(e) => setProject(e.target.value)}
            />
          </div>
          
          <div>
            <Input
              placeholder="Add tags (press Enter)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
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
        </div>
        <DialogFooter className="flex justify-between">
          <div>
            {task && (
              <Button
                variant="outline"
                className="text-destructive"
                onClick={handleDelete}
              >
                <Trash className="h-4 w-4 mr-1" />
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              <Check className="h-4 w-4 mr-1" />
              {task ? "Save Changes" : "Create Task"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
