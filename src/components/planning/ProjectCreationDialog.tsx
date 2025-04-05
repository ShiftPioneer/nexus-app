import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Project, ProjectStatus, Priority } from "@/types/planning";

interface ProjectCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreate: (project: Project) => void;
  existingProjects: Project[];
  existingProject: Project | null;
}

const ProjectCreationDialog: React.FC<ProjectCreationDialogProps> = ({
  open,
  onOpenChange,
  onProjectCreate,
  existingProjects,
  existingProject
}) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "not-started" as ProjectStatus,
    priority: "medium" as Priority,
    dueDate: undefined as Date | undefined,
    startDate: new Date(),
    category: "work"
  });

  useEffect(() => {
    if (existingProject) {
      setForm({
        title: existingProject.title,
        description: existingProject.description,
        status: existingProject.status,
        priority: existingProject.priority,
        dueDate: existingProject.dueDate,
        startDate: existingProject.startDate,
        category: existingProject.category || "work"
      });
    } else {
      setForm({
        title: "",
        description: "",
        status: "not-started" as ProjectStatus,
        priority: "medium" as Priority,
        dueDate: undefined,
        startDate: new Date(),
        category: "work"
      });
    }
  }, [existingProject, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleDateChange = (date: Date | undefined) => {
    setForm({ ...form, dueDate: date });
  };

  const handleSubmit = () => {
    if (!form.title || !form.description) {
      alert("Please fill in all fields.");
      return;
    }

    const project: Project = {
      id: existingProject?.id || uuidv4(),
      title: form.title,
      description: form.description,
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate,
      startDate: form.startDate || new Date(),
      category: form.category,
      tasks: existingProject?.tasks || [],
      subProjects: existingProject?.subProjects || [],
      progress: existingProject?.progress || 0,
      pinned: existingProject?.pinned || false
    };

    onProjectCreate(project);
    onOpenChange(false);
  };

  const initialData = existingProject
    ? {
        title: existingProject.title,
        description: existingProject.description,
        status: existingProject.status,
        priority: existingProject.priority,
        dueDate: existingProject.dueDate,
        startDate: existingProject.startDate,
        category: existingProject.category || "work"
      }
    : {
        title: "",
        description: "",
        status: "not-started" as ProjectStatus,
        priority: "medium" as Priority,
        dueDate: undefined,
        startDate: new Date(),
        category: "work"
      };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{existingProject ? "Edit Project" : "Create New Project"}</DialogTitle>
          <DialogDescription>
            {existingProject ? "Edit the project details" : "Enter the details for your new project"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={form.title}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right mt-2">
              Description
            </Label>
            <div className="col-span-3">
              <Input
                id="description"
                name="description"
                value={form.description}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={form.status} onValueChange={(value) => handleSelectChange("status", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <Select value={form.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right">
              Due Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 pl-3 text-left font-normal",
                    !form.dueDate && "text-muted-foreground"
                  )}
                >
                  {form.dueDate ? format(form.dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center" side="bottom">
                <Calendar
                  mode="single"
                  selected={form.dueDate}
                  onSelect={handleDateChange}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            {existingProject ? "Update Project" : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCreationDialog;
