
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon, FolderKanban } from "lucide-react";
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

const categories = [
  { value: 'career' as const, label: 'Career & Business', icon: '💼' },
  { value: 'education' as const, label: 'Education & Learning', icon: '📚' },
  { value: 'wealth' as const, label: 'Wealth & Finance', icon: '💰' },
  { value: 'health' as const, label: 'Health & Fitness', icon: '🏃' },
  { value: 'relationships' as const, label: 'Relationships', icon: '❤️' },
  { value: 'spirituality' as const, label: 'Spirituality', icon: '🧘' }
];

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
      id: initialProject?.id || Date.now().toString(),
      title,
      description,
      category,
      progress: initialProject?.progress || 0,
      startDate,
      endDate,
      status: initialProject?.status || "not-started",
      blockingProjects,
      blockedByProjects,
      createdAt: initialProject?.createdAt || new Date()
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

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl text-white">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-lg">
              <FolderKanban className="h-5 w-5 text-white" />
            </div>
            {initialProject ? 'Edit Project' : 'Create New Project'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">Project Title *</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="Enter your project title" 
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-white">Category *</Label>
              <Select value={category} onValueChange={(val) => setCategory(val as Project["category"])}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-slate-700">
                      <div className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Describe your project in detail" 
              rows={3} 
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 min-h-[100px]"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-slate-800 border-slate-600 text-white hover:bg-slate-700",
                      !startDate && "text-slate-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    initialFocus
                    className="bg-slate-800"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label className="text-white">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-slate-800 border-slate-600 text-white hover:bg-slate-700",
                      !endDate && "text-slate-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                    initialFocus
                    className="bg-slate-800"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {existingProjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-white">Blocking Projects</Label>
                <div className="border border-slate-600 rounded-md p-3 max-h-32 overflow-y-auto bg-slate-800/50">
                  {existingProjects.filter(project => initialProject ? project.id !== initialProject.id : true).map(project => (
                    <div key={`blocking-${project.id}`} className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id={`blocking-${project.id}`}
                        checked={blockingProjects.includes(project.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setBlockingProjects([...blockingProjects, project.id]);
                          } else {
                            setBlockingProjects(blockingProjects.filter(id => id !== project.id));
                          }
                        }}
                      />
                      <label htmlFor={`blocking-${project.id}`} className="text-sm text-slate-300">
                        {project.title}
                      </label>
                    </div>
                  ))}
                  {existingProjects.filter(project => initialProject ? project.id !== initialProject.id : true).length === 0 && (
                    <p className="text-sm text-slate-400">No existing projects to select</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-white">Blocked By Projects</Label>
                <div className="border border-slate-600 rounded-md p-3 max-h-32 overflow-y-auto bg-slate-800/50">
                  {existingProjects.filter(project => initialProject ? project.id !== initialProject.id : true).map(project => (
                    <div key={`blockedby-${project.id}`} className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id={`blockedby-${project.id}`}
                        checked={blockedByProjects.includes(project.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setBlockedByProjects([...blockedByProjects, project.id]);
                          } else {
                            setBlockedByProjects(blockedByProjects.filter(id => id !== project.id));
                          }
                        }}
                      />
                      <label htmlFor={`blockedby-${project.id}`} className="text-sm text-slate-300">
                        {project.title}
                      </label>
                    </div>
                  ))}
                  {existingProjects.filter(project => initialProject ? project.id !== initialProject.id : true).length === 0 && (
                    <p className="text-sm text-slate-400">No existing projects to select</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white shadow-lg"
          >
            {initialProject ? 'Update Project' : 'Create Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCreationDialog;
