import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
interface ProjectCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreate: (project: Project) => void;
  existingProjects: Project[];
  initialProject?: Project | null;
}
const ProjectCreationDialog: React.FC<ProjectCreationDialogProps> = ({
  open,
  onOpenChange,
  onProjectCreate,
  existingProjects,
  initialProject = null
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Project["category"]>("career");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [blockingProjects, setBlockingProjects] = useState<string[]>([]);
  const [blockedByProjects, setBlockedByProjects] = useState<string[]>([]);

  // If an initial project is provided, populate the form with its values
  useEffect(() => {
    if (initialProject) {
      setTitle(initialProject.title);
      setDescription(initialProject.description);
      setCategory(initialProject.category);
      setStartDate(initialProject.startDate);
      setEndDate(initialProject.endDate);
      setBlockingProjects(initialProject.blockingProjects || []);
      setBlockedByProjects(initialProject.blockedByProjects || []);
    } else {
      resetForm();
    }
  }, [initialProject]);
  const handleSubmit = () => {
    const newProject: Project = {
      id: initialProject?.id || "",
      title,
      description,
      category,
      progress: initialProject?.progress || 0,
      startDate,
      endDate,
      status: initialProject?.status || "not-started",
      blockingProjects,
      blockedByProjects
    };
    onProjectCreate(newProject);
    resetForm();
  };
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("career");
    setStartDate(new Date());
    setEndDate(new Date());
    setBlockingProjects([]);
    setBlockedByProjects([]);
  };
  return <Dialog open={open} onOpenChange={isOpen => {
    if (!isOpen) resetForm();
    onOpenChange(isOpen);
  }}>
      <DialogContent className="sm:max-w-[550px] bg-slate-950">
        <DialogHeader>
          <DialogTitle>{initialProject ? 'Edit Project' : 'Create New Project'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter your project title" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your project" rows={3} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={val => setCategory(val as Project["category"])}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="career">Career</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="wealth">Wealth</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="relationships">Relationships</SelectItem>
                <SelectItem value="spirituality">Spirituality</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={startDate} onSelect={date => date && setStartDate(date)} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={endDate} onSelect={date => date && setEndDate(date)} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {existingProjects.length > 0 && <>
              <div className="space-y-2">
                <Label>Blocking</Label>
                <div className="border rounded-md p-3 max-h-32 overflow-y-auto">
                  {existingProjects.filter(project => initialProject ? project.id !== initialProject.id : true).map(project => <div key={`blocking-${project.id}`} className="flex items-center space-x-2 mb-2">
                      <Checkbox id={`blocking-${project.id}`} checked={blockingProjects.includes(project.id)} onCheckedChange={checked => {
                  if (checked) {
                    setBlockingProjects([...blockingProjects, project.id]);
                  } else {
                    setBlockingProjects(blockingProjects.filter(id => id !== project.id));
                  }
                }} />
                      <label htmlFor={`blocking-${project.id}`} className="text-sm">{project.title}</label>
                    </div>)}
                  {existingProjects.filter(project => initialProject ? project.id !== initialProject.id : true).length === 0 && <p className="text-sm text-muted-foreground">No existing projects to select</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Blocked By</Label>
                <div className="border rounded-md p-3 max-h-32 overflow-y-auto">
                  {existingProjects.filter(project => initialProject ? project.id !== initialProject.id : true).map(project => <div key={`blockedby-${project.id}`} className="flex items-center space-x-2 mb-2">
                      <Checkbox id={`blockedby-${project.id}`} checked={blockedByProjects.includes(project.id)} onCheckedChange={checked => {
                  if (checked) {
                    setBlockedByProjects([...blockedByProjects, project.id]);
                  } else {
                    setBlockedByProjects(blockedByProjects.filter(id => id !== project.id));
                  }
                }} />
                      <label htmlFor={`blockedby-${project.id}`} className="text-sm">{project.title}</label>
                    </div>)}
                  {existingProjects.filter(project => initialProject ? project.id !== initialProject.id : true).length === 0 && <p className="text-sm text-muted-foreground">No existing projects to select</p>}
                </div>
              </div>
            </>}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim()}>
            {initialProject ? 'Update Project' : 'Create Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
};
export default ProjectCreationDialog;