
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/datepicker";
import { Label } from "@/components/ui/label";
import { Project, Priority, ProjectStatus } from "@/types/planning";
import { v4 as uuidv4 } from "uuid";

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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [status, setStatus] = useState<ProjectStatus>("not-started");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [category, setCategory] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [parentProject, setParentProject] = useState<string>("");
  const [isSubproject, setIsSubproject] = useState(false);
  const [availableParentProjects, setAvailableParentProjects] = useState<Project[]>([]);
  
  useEffect(() => {
    // If we have an existing project, populate the form
    if (existingProject) {
      setTitle(existingProject.title);
      setDescription(existingProject.description);
      setPriority(existingProject.priority);
      setStatus(existingProject.status);
      setDueDate(existingProject.dueDate);
      setCategory(existingProject.category || "");
      setStartDate(existingProject.startDate);
      
      if (existingProject.parentProjectId) {
        setIsSubproject(true);
        setParentProject(existingProject.parentProjectId);
      } else {
        setIsSubproject(false);
        setParentProject("");
      }
    } else {
      // Reset form for new project
      setTitle("");
      setDescription("");
      setPriority("medium");
      setStatus("not-started");
      setDueDate(undefined);
      setCategory("");
      setStartDate(new Date());
      setIsSubproject(false);
      setParentProject("");
    }
    
    // Filter out potential parent projects
    // We don't want to allow a project to be its own parent or to create circular references
    const filtered = existingProject
      ? existingProjects.filter(p => p.id !== existingProject.id && !isDescendant(p, existingProject.id))
      : existingProjects;
    
    setAvailableParentProjects(filtered);
  }, [existingProject, existingProjects, open]);
  
  // Helper function to check if a project is a descendant of another project
  const isDescendant = (project: Project, targetId: string): boolean => {
    if (!project.subProjects) return false;
    
    return project.subProjects.some(
      subProject => subProject.id === targetId || isDescendant(subProject, targetId)
    );
  };
  
  const handleSubmit = () => {
    const newProject: Project = {
      id: existingProject?.id || uuidv4(),
      title,
      description,
      priority,
      status,
      dueDate,
      startDate,
      category,
      tasks: existingProject?.tasks || [],
      subProjects: existingProject?.subProjects || [],
      progress: existingProject?.progress || 0,
      parentProjectId: isSubproject ? parentProject : undefined
    };
    
    onProjectCreate(newProject);
    onOpenChange(false);
  };
  
  const projectsByCategory: Record<string, Project[]> = {};
  availableParentProjects.forEach(project => {
    const category = project.category || "Uncategorized";
    if (!projectsByCategory[category]) {
      projectsByCategory[category] = [];
    }
    projectsByCategory[category].push(project);
  });
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{existingProject ? "Edit Project" : "Create New Project"}</DialogTitle>
          <DialogDescription>
            {existingProject 
              ? "Edit your project details below" 
              : "Enter the details for your new project"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project"
              className="mt-1 h-32"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Enter category"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as ProjectStatus)}>
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
            
            <div>
              <Label htmlFor="subproject">Is this a sub-project?</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Button 
                  type="button" 
                  variant={isSubproject ? "default" : "outline"} 
                  className="w-1/2"
                  onClick={() => setIsSubproject(true)}
                >
                  Yes
                </Button>
                <Button 
                  type="button" 
                  variant={!isSubproject ? "default" : "outline"} 
                  className="w-1/2"
                  onClick={() => setIsSubproject(false)}
                >
                  No
                </Button>
              </div>
            </div>
          </div>
          
          {isSubproject && (
            <div>
              <Label htmlFor="parentProject">Parent Project</Label>
              <Select 
                value={parentProject} 
                onValueChange={setParentProject}
                disabled={availableParentProjects.length === 0}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select parent project" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(projectsByCategory).map(([category, projects]) => (
                    <React.Fragment key={category}>
                      <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                        {category}
                      </div>
                      {projects.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.title}
                        </SelectItem>
                      ))}
                    </React.Fragment>
                  ))}
                </SelectContent>
              </Select>
              {availableParentProjects.length === 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  No available parent projects.
                </p>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <DatePicker
                id="startDate"
                date={startDate}
                setDate={setStartDate}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="dueDate">Due Date (optional)</Label>
              <DatePicker
                id="dueDate"
                date={dueDate}
                setDate={setDueDate}
                className="mt-1"
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="bg-[#FF6500] hover:bg-[#E55A00]"
          >
            {existingProject ? "Update Project" : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCreationDialog;
