
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, set } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { GTDTask } from "@/components/gtd/GTDContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface TaskFormProps {
  task?: GTDTask | null;
  onSubmit: (taskData: any) => void;
  onCancel: () => void;
  isToDoNot?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSubmit,
  onCancel,
  isToDoNot: initialIsToDoNot = false
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"Very Low" | "Low" | "Medium" | "High" | "Very High">("Medium");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState("todo");
  const [tags, setTags] = useState<string[]>([]);
  const [context, setContext] = useState("");
  const [isToDoNot, setIsToDoNot] = useState(initialIsToDoNot);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setPriority(task.priority || "Medium");
      setDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
      setStatus(task.status || "todo");
      setTags(task.tags || []);
      setContext(task.context || "");
      setIsToDoNot(task.isToDoNot || false);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      title,
      description,
      priority,
      dueDate,
      status,
      tags,
      context,
      isToDoNot
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add task details..."
            rows={3}
          />
        </div>

        <div>
          <Label className="mb-2 block">Task Type</Label>
          <RadioGroup 
            value={isToDoNot ? "not-to-do" : "to-do"}
            onValueChange={(val) => setIsToDoNot(val === "not-to-do")}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="to-do" id="to-do" />
              <Label htmlFor="to-do">To Do</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="not-to-do" id="not-to-do" />
              <Label htmlFor="not-to-do">Not To Do</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={priority}
              onValueChange={(value) => setPriority(value as any)}
            >
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
          
          <div>
            <Label>Due Date</Label>
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
                  {dueDate ? format(dueDate, "PPP") : "No date"}
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
        </div>
        
        {task && (
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={setStatus}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inbox">Inbox</SelectItem>
                <SelectItem value="next-action">Next Action</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="waiting-for">Waiting For</SelectItem>
                <SelectItem value="someday">Someday</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Button type="submit" className="flex-1">
            {task ? "Update" : "Create"} {isToDoNot ? "Not To Do" : "Task"}
          </Button>
          <Button type="button" onClick={onCancel} variant="outline">
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
};

export default TaskForm;
