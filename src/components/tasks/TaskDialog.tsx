
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import { format } from "date-fns";
import { CalendarIcon, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  dueDate?: Date;
  importance: number;
  relatedGoals?: string[];
  relatedProjects?: string[];
  status: 'todo' | 'in-progress' | 'completed' | 'overdue';
  createdAt: Date;
}

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (task: Task) => void;
  editTask?: Task;
}

const CATEGORIES = [
  "Work", 
  "Personal", 
  "Finance", 
  "Health", 
  "Career",
  "Education",
  "Family",
  "Home"
];

const TaskDialog: React.FC<TaskDialogProps> = ({
  open,
  onOpenChange,
  onCreateTask,
  editTask,
}) => {
  const [title, setTitle] = useState(editTask?.title || "");
  const [description, setDescription] = useState(editTask?.description || "");
  const [priority, setPriority] = useState<Task["priority"]>(editTask?.priority || "medium");
  const [category, setCategory] = useState(editTask?.category || "Work");
  const [dueDate, setDueDate] = useState<Date | undefined>(editTask?.dueDate);
  const [importance, setImportance] = useState(editTask?.importance || 0);
  const [relatedGoal, setRelatedGoal] = useState<string | undefined>(undefined);
  const [relatedProject, setRelatedProject] = useState<string | undefined>(undefined);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setCategory("Work");
    setDueDate(undefined);
    setImportance(0);
    setRelatedGoal(undefined);
    setRelatedProject(undefined);
  };

  const handleSubmit = () => {
    // Create new task object
    const newTask: Task = {
      id: editTask?.id || "",
      title,
      description,
      priority,
      category,
      dueDate,
      importance,
      relatedGoals: relatedGoal ? [relatedGoal] : [],
      relatedProjects: relatedProject ? [relatedProject] : [],
      status: "todo",
      createdAt: new Date(),
    };
    
    onCreateTask(newTask);
    resetForm();
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm();
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about this task..."
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={priority}
                onValueChange={(val) => setPriority(val as Task["priority"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={category}
                onValueChange={setCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="importance">Importance (0-100)</Label>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">{importance}</span>
              </div>
            </div>
            <Slider
              id="importance"
              value={[importance]}
              min={0}
              max={100}
              step={5}
              onValueChange={(value) => setImportance(value[0])}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Related Items (Optional)</Label>
            <div className="grid grid-cols-1 gap-2">
              <Select value={relatedGoal} onValueChange={setRelatedGoal}>
                <SelectTrigger>
                  <SelectValue placeholder="Link to a goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="goal1">Learn Spanish</SelectItem>
                  <SelectItem value="goal2">Run 5K</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={relatedProject} onValueChange={setRelatedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Link to a project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="project1">Website Redesign</SelectItem>
                  <SelectItem value="project2">Marketing Campaign</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim()}>
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
