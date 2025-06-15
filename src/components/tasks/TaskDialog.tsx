import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, X, Check, Trash, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import GoalSelector from "./GoalSelector";
import ProjectSelector from "./ProjectSelector";
export interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: any | null;
  onAddTask: (task: any) => void;
  onUpdateTask: (id: string, updates: any) => void;
  onDeleteTask: (id: string) => void;
  isToDoNot?: boolean;
}
const TaskDialog: React.FC<TaskDialogProps> = ({
  open,
  onOpenChange,
  task,
  onAddTask,
  onUpdateTask,
  onDeleteTask
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<string>("todo");
  const [priority, setPriority] = useState<string>("Medium");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [project, setProject] = useState("");
  const [goalId, setGoalId] = useState<string>("none");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const {
    toast
  } = useToast();

  // Reset form when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "todo");
      setPriority(task.priority || "Medium");
      setDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
      setTags(task.tags || []);
      setProject(task.project || "none");
      setGoalId(task.goalId || "none");
    } else {
      // Reset form for new task
      setTitle("");
      setDescription("");
      setStatus("todo");
      setPriority("Medium");
      setDueDate(undefined);
      setTags([]);
      setProject("none");
      setGoalId("none");
    }

    // Always reset the delete confirmation when dialog opens/closes
    setConfirmDelete(false);
  }, [task, open]);
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
  const handleSubmit = () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive"
      });
      return;
    }
    const taskData = {
      title,
      description,
      status,
      priority,
      dueDate,
      tags,
      project: project === "none" ? undefined : project,
      goalId: goalId === "none" ? undefined : goalId
    };
    if (task) {
      onUpdateTask(task.id, taskData);
      toast({
        title: "Task Updated",
        description: "Your task has been updated successfully"
      });
    } else {
      onAddTask(taskData);
      toast({
        title: "Task Created",
        description: "Your task has been created successfully"
      });
    }
    onOpenChange(false);
  };
  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    if (task) {
      onDeleteTask(task.id);
      toast({
        title: "Task Deleted",
        description: "Task has been deleted successfully"
      });
      onOpenChange(false);
    }
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-900">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "New Task"}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Tabs defaultValue="details">
            <TabsList className="grid grid-cols-2 justify-center items-center ">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="planning">Planning</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 pt-4 bg-slate-900">
              <div>
                <Input placeholder="Task title" value={title} onChange={e => setTitle(e.target.value)} className="mb-2 bg-slate-900" />
              </div>
              
              <div>
                <Textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="bg-slate-900" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 bg-slate-900">
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
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP") : "Set due date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus className="p-3 pointer-events-auto bg-slate-950 rounded-lg" />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Input placeholder="Add tags (press Enter)" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={handleAddTag} className="bg-slate-900" />
                {tags.length > 0 && <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map(tag => <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                      </Badge>)}
                  </div>}
              </div>
            </TabsContent>
            
            <TabsContent value="planning" className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium mb-1 block bg-slate-900 text-primary">Link to Goal</label>
                <GoalSelector value={goalId} onValueChange={setGoalId} />
                
                {goalId && goalId !== "none" && <div className="mt-2 text-xs text-muted-foreground">
                    This task will contribute to your selected goal's progress.
                  </div>}
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block text-primary">Link to Project</label>
                <ProjectSelector value={project} onValueChange={setProject} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter className="flex justify-between">
          <div>
            {task && <Button variant={confirmDelete ? "destructive" : "outline"} className={`${confirmDelete ? "bg-red-600 text-white" : "text-destructive"}`} onClick={handleDelete}>
                {confirmDelete ? <>
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Confirm Delete
                  </> : <>
                    <Trash className="h-4 w-4 mr-1" />
                    Delete
                  </>}
              </Button>}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="text-lime-600">
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              <Check className="h-4 w-4 mr-1" />
              {task ? "Save Changes" : "Create Task"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
};
export default TaskDialog;