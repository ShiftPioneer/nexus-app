
import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardList } from "lucide-react";

interface ProjectSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  value,
  onValueChange,
  placeholder = "Select a project (optional)"
}) => {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    try {
      const savedProjects = localStorage.getItem('planningProjects');
      if (savedProjects) {
        const parsedProjects = JSON.parse(savedProjects);
        const activeProjects = parsedProjects.filter((project: any) => 
          project.status !== 'completed'
        );
        setProjects(activeProjects);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  }, []);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="pointer-events-auto">
        <SelectItem value="none">None</SelectItem>
        {projects.map((project) => (
          <SelectItem key={project.id} value={project.id}>
            <div className="flex items-center">
              <ClipboardList className="h-4 w-4 mr-2 text-secondary" />
              {project.title}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ProjectSelector;
