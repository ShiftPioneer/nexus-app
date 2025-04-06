import React, { createContext, useState, useContext } from 'react';
import { Project, ProjectStatus, Priority } from '@/types/planning';

interface ProjectContextValue {
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => string;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

const ProjectContext = createContext<ProjectContextValue | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "Website Redesign",
      description: "Redesign the company website with new branding and improved UI/UX",
      startDate: new Date(2023, 2, 15),
      endDate: new Date(2023, 6, 30),
      progress: 75,
      status: "in-progress" as ProjectStatus,
      priority: "high" as Priority,
      tasks: ["task1", "task2", "task3"],
      pinned: true,
      category: "Work"
    },
    {
      id: "2",
      title: "Content Marketing Strategy",
      description: "Develop a comprehensive content strategy for Q3 and Q4",
      startDate: new Date(2023, 4, 1),
      endDate: new Date(2023, 8, 30),
      progress: 30,
      status: "in-progress" as ProjectStatus,
      priority: "medium" as Priority,
      tasks: ["task4", "task5"],
      pinned: false,
      category: "Marketing"
    },
    {
      id: "3",
      title: "Onboarding Automation",
      description: "Automate the employee onboarding process with custom software",
      startDate: new Date(2023, 0, 1),
      endDate: new Date(2023, 3, 30),
      progress: 100,
      status: "completed" as ProjectStatus,
      priority: "low" as Priority,
      tasks: ["task6", "task7", "task8", "task9"],
      pinned: false,
      category: "HR"
    }
  ]);

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
    };
    setProjects([...projects, newProject]);
    return newProject.id;
  };

  const updateProject = (id: string, project: Partial<Project>) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...project } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const value: ProjectContextValue = {
    projects,
    addProject,
    updateProject,
    deleteProject,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
};
