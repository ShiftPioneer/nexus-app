
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, CheckCircle, ChevronDown, Clock, Info, Layers, Target } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Project, Priority, ProjectStatus } from "@/types/planning";

interface ProjectCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreate: (project: Project) => void;
  existingProjects: Project[];
  existingProject?: Project | null;
}

const ProjectCreationDialog: React.FC<ProjectCreationDialogProps> = ({
  open,
  onOpenChange,
  onProjectCreate,
  existingProjects,
  existingProject
}) => {
  const initialProject = existingProject || {
    id: "",
    title: "",
    description: "",
    status: "not-started" as ProjectStatus,
    startDate: new Date(),
    priority: "medium" as Priority,
    progress: 0,
    subProjects: [],
    category: "",
  };

  const [project, setProject] = useState<Project>(initialProject);
  const [parentProject, setParentProject] = useState<string | null>(null);

  useEffect(() => {
    if (existingProject) {
      setProject(existingProject);
      // Check if this is a sub-project
      const parent = existingProjects.find(p => 
        p.subProjects?.some(sp => sp.id === existingProject.id)
      );
      setParentProject(parent?.id || null);
    } else {
      setProject(initialProject);
      setParentProject(null);
    }
  }, [existingProject, existingProjects]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProject = {
      ...project,
      id: project.id || Date.now().toString(),
    };
    
    onProjectCreate(newProject);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Layers className="h-5 w-5 mr-2 text-primary" />
            {existingProject ? "Edit Project" : "Create New Project"}
          </DialogTitle>
          <DialogDescription>
            {existingProject 
              ? "Update your project details and track your progress."
              : "Add a new project to organize and manage your tasks."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Project Title</Label>
                <Input 
                  id="title"
                  required
                  value={project.title}
                  onChange={(e) => setProject({...project, title: e.target.value})}
                  placeholder="Enter project title"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  value={project.description}
                  onChange={(e) => setProject({...project, description: e.target.value})}
                  placeholder="Describe your project"
                  className="mt-1 h-24 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input 
                    id="category"
                    value={project.category || ""}
                    onChange={(e) => setProject({...project, category: e.target.value})}
                    placeholder="e.g. Work, Personal, Study"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={project.status}
                    onValueChange={(value: ProjectStatus) => setProject({...project, status: value})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not-started">Not Started</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="on-hold">On Hold</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full mt-1 justify-start text-left font-normal",
                          !project.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {project.startDate ? format(new Date(project.startDate), "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={new Date(project.startDate)}
                        onSelect={(date) => date && setProject({...project, startDate: date})}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full mt-1 justify-start text-left font-normal",
                          !project.dueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {project.dueDate ? format(new Date(project.dueDate), "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={project.dueDate ? new Date(project.dueDate) : undefined}
                        onSelect={(date) => setProject({...project, dueDate: date || undefined})}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={project.priority}
                    onValueChange={(value: Priority) => setProject({...project, priority: value})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="progress">Progress</Label>
                  <div className="flex items-center mt-1">
                    <Input 
                      id="progress"
                      type="number"
                      min="0"
                      max="100"
                      value={project.progress || 0}
                      onChange={(e) => setProject({...project, progress: Number(e.target.value)})}
                      className="mr-2"
                    />
                    <span className="text-sm">%</span>
                  </div>
                </div>
              </div>

              {existingProjects.length > 0 && (
                <div>
                  <Label htmlFor="parentProject">Parent Project (Optional)</Label>
                  <Select 
                    value={parentProject || ""}
                    onValueChange={(value) => setParentProject(value || null)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select parent project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Parent Project</SelectItem>
                      {existingProjects
                        .filter(p => p.id !== project.id && !p.subProjects?.find(sp => sp.id === project.id))
                        .map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    <Info className="inline h-3 w-3 mr-1" />
                    Sub-projects automatically contribute to the parent project's progress.
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-[#FF6500] hover:bg-[#E55A00]"
            >
              {existingProject ? "Update Project" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCreationDialog;
