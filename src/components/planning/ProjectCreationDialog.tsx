import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Check, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useGTD } from "@/components/gtd/GTDContext";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProjectCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreate: (project: Project) => void;
  initialProject?: Project | null;
  existingProjects?: Project[];
  existingGoals?: Goal[];
}

const ProjectCreationDialog: React.FC<ProjectCreationDialogProps> = ({
  open,
  onOpenChange,
  onProjectCreate,
  initialProject = null,
  existingProjects = [],
  existingGoals = []
}) => {
  // State for project fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<
    "wealth" | "health" | "relationships" | "spirituality" | "education" | "career"
  >("career");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"not-started" | "in-progress" | "completed">("not-started");
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [linkedGoals, setLinkedGoals] = useState<string[]>([]);
  
  // Get GTD tasks for linking
  const { tasks: allTasks } = useGTD();
  const [linkedTasks, setLinkedTasks] = useState<string[]>([]);

  // Load initial data when editing an existing project
  useEffect(() => {
    if (initialProject) {
      setTitle(initialProject.title);
      setDescription(initialProject.description);
      setCategory(initialProject.category);
      setStartDate(new Date(initialProject.startDate));
      setEndDate(new Date(initialProject.endDate));
      setProgress(initialProject.progress);
      setStatus(initialProject.status);
      setLinkedGoals(initialProject.linkedGoals || []);
      setLinkedTasks(initialProject.linkedTasks || []);
    } else {
      // Reset form for new project
      setTitle("");
      setDescription("");
      setCategory("career");
      setStartDate(new Date());
      setEndDate(new Date());
      setProgress(0);
      setStatus("not-started");
      setLinkedGoals([]);
      setLinkedTasks([]);
    }
  }, [initialProject, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const project: Project = {
      id: initialProject?.id || `project-${Date.now()}`,
      title,
      description,
      category,
      startDate,
      endDate,
      progress,
      status,
      linkedGoals,
      linkedTasks,
    };

    onProjectCreate(project);
    onOpenChange(false);
  };
  
  const toggleGoal = (goalId: string) => {
    if (linkedGoals.includes(goalId)) {
      setLinkedGoals(linkedGoals.filter(id => id !== goalId));
    } else {
      setLinkedGoals([...linkedGoals, goalId]);
    }
  };
  
  const toggleTask = (taskId: string) => {
    if (linkedTasks.includes(taskId)) {
      setLinkedTasks(linkedTasks.filter(id => id !== taskId));
    } else {
      setLinkedTasks([...linkedTasks, taskId]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialProject ? "Edit Project" : "Create New Project"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Project title"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe your project..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background"
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                >
                  <option value="career">Career</option>
                  <option value="wealth">Wealth</option>
                  <option value="health">Health</option>
                  <option value="relationships">Relationships</option>
                  <option value="spirituality">Spirituality</option>
                  <option value="education">Education</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background"
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                >
                  <option value="not-started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      type="button"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(startDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        if (date) {
                          setStartDate(date);
                          setStartDateOpen(false);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      type="button"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(endDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        if (date) {
                          setEndDate(date);
                          setEndDateOpen(false);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div>
              <Label htmlFor="progress">Progress ({progress}%)</Label>
              <Input
                id="progress"
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={e => setProgress(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            
            {/* Link to Goals */}
            <div>
              <Label>Link to Goals</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Connect this project to specific goals for better tracking
              </p>
              
              {existingGoals && existingGoals.length > 0 ? (
                <ScrollArea className="h-40 border rounded-md p-2">
                  <div className="space-y-2">
                    {existingGoals.map(goal => (
                      <div key={goal.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                        <div>
                          <p className="font-medium">{goal.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {goal.category} • {goal.timeframe}
                          </p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant={linkedGoals.includes(goal.id) ? "default" : "outline"}
                          onClick={() => toggleGoal(goal.id)}
                        >
                          {linkedGoals.includes(goal.id) ? (
                            <Check className="h-4 w-4 mr-1" />
                          ) : (
                            <Plus className="h-4 w-4 mr-1" />
                          )}
                          {linkedGoals.includes(goal.id) ? "Linked" : "Link"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center p-4 border border-dashed rounded-md">
                  <p className="text-muted-foreground">No goals available for linking</p>
                </div>
              )}
            </div>
            
            {/* Link to Tasks */}
            <div>
              <Label>Link to Actions</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Connect this project to specific actions/tasks
              </p>
              
              {allTasks && allTasks.length > 0 ? (
                <ScrollArea className="h-40 border rounded-md p-2">
                  <div className="space-y-2">
                    {allTasks.filter(task => !task.isToDoNot && task.status !== 'deleted').map(task => (
                      <div key={task.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {task.status === "todo" ? "To Do" :
                               task.status === "today" ? "Today" :
                               task.status === "in-progress" ? "In Progress" :
                               task.status === "completed" ? "Completed" : task.status}
                            </Badge>
                            {task.priority && (
                              <span className="text-xs text-muted-foreground">
                                {task.priority}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant={linkedTasks.includes(task.id) ? "default" : "outline"}
                          onClick={() => toggleTask(task.id)}
                        >
                          {linkedTasks.includes(task.id) ? (
                            <Check className="h-4 w-4 mr-1" />
                          ) : (
                            <Plus className="h-4 w-4 mr-1" />
                          )}
                          {linkedTasks.includes(task.id) ? "Linked" : "Link"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center p-4 border border-dashed rounded-md">
                  <p className="text-muted-foreground">No tasks available for linking</p>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {initialProject ? "Update Project" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCreationDialog;
