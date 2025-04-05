import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Project } from "@/types/planning";

interface ProjectContextProps {
  projects: Project[];
  addProject: (project: Omit<Project, "id">) => string;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProjectById: (id: string) => Project | undefined;
  addSubProject: (parentId: string, subProject: Omit<Project, "id" | "parentProjectId">) => void;
  toggleProjectPin: (id: string) => void;
  getProjectsProgress: () => number;
}

const ProjectContext = createContext<ProjectContextProps | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
};

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    // Try to get projects from local storage
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      try {
        const parsedProjects = JSON.parse(savedProjects);
        // Ensure dates are Date objects
        return parsedProjects.map((project: any) => ({
          ...project,
          startDate: new Date(project.startDate),
          endDate: project.endDate ? new Date(project.endDate) : undefined
        }));
      } catch (e) {
        console.error("Error parsing projects from local storage:", e);
        return getDefaultProjects();
      }
    }
    return getDefaultProjects();
  });

  // Save projects to local storage when they change
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  function getDefaultProjects(): Project[] {
    return [
      {
        id: "1",
        title: "Website Redesign",
        description: "Redesign the company website with modern UI/UX principles",
        startDate: new Date(2023, 5, 15),
        endDate: new Date(2023, 8, 30),
        progress: 75,
        status: "in-progress",
        priority: "high",
        tasks: ["task1", "task2", "task3"],
        pinned: true
      },
      {
        id: "2",
        title: "Mobile App Development",
        description: "Develop a companion mobile app for our web service",
        startDate: new Date(2023, 7, 1),
        endDate: new Date(2023, 11, 15),
        progress: 30,
        status: "in-progress",
        priority: "medium",
        tasks: ["task4", "task5"],
        pinned: false
      },
      {
        id: "3",
        title: "Content Strategy",
        description: "Create a content strategy for the next quarter",
        startDate: new Date(2023, 6, 10),
        endDate: new Date(2023, 7, 20),
        progress: 100,
        status: "completed",
        priority: "low",
        tasks: ["task6", "task7", "task8"],
        pinned: false
      }
    ];
  }

  // Calculate project progress based on subprojects and tasks
  const calculateProjectProgress = (project: Project): number => {
    // If there are subprojects, calculate based on them
    if (project.subProjects && project.subProjects.length > 0) {
      const subProjectProgress = project.subProjects.reduce((sum, subProject) => {
        return sum + calculateProjectProgress(subProject);
      }, 0);
      return subProjectProgress / project.subProjects.length;
    }
    
    // Otherwise, use the current progress value
    return project.progress;
  };

  // Update all project progress
  const updateAllProjectProgress = () => {
    setProjects(prevProjects => {
      const updateProjectAndSubprojects = (project: Project): Project => {
        // Calculate progress for this project
        const progress = calculateProjectProgress(project);
        
        // Update subprojects recursively if they exist
        const updatedSubProjects = project.subProjects ? 
          project.subProjects.map(subProject => updateProjectAndSubprojects(subProject)) : 
          undefined;
        
        return {
          ...project,
          progress,
          subProjects: updatedSubProjects
        };
      };
      
      return prevProjects.map(project => updateProjectAndSubprojects(project));
    });
  };

  // Recalculate all project progress when subprojects change
  useEffect(() => {
    updateAllProjectProgress();
  }, []);

  const addProject = (project: Omit<Project, "id">): string => {
    const newId = uuidv4();
    const newProject: Project = {
      ...project,
      id: newId
    };
    
    setProjects(prev => [...prev, newProject]);
    return newId;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prevProjects => {
      const updateProjectById = (projects: Project[]): Project[] => {
        return projects.map(project => {
          if (project.id === id) {
            return { ...project, ...updates };
          }
          
          // Check subprojects recursively
          if (project.subProjects) {
            return {
              ...project,
              subProjects: updateProjectById(project.subProjects)
            };
          }
          
          return project;
        });
      };
      
      return updateProjectById(prevProjects);
    });

    // Update progress after updates
    updateAllProjectProgress();
  };

  const deleteProject = (id: string) => {
    setProjects(prevProjects => {
      const removeProjectById = (projects: Project[]): Project[] => {
        return projects.filter(project => {
          if (project.id === id) {
            return false;
          }
          
          // Keep filtering subprojects recursively
          if (project.subProjects) {
            return {
              ...project,
              subProjects: removeProjectById(project.subProjects)
            };
          }
          
          return true;
        });
      };
      
      return removeProjectById(prevProjects);
    });
  };

  const addSubProject = (parentId: string, subProject: Omit<Project, "id" | "parentProjectId">) => {
    const newSubProjectId = uuidv4();
    
    setProjects(prevProjects => {
      const addSubProjectToParent = (projects: Project[]): Project[] => {
        return projects.map(project => {
          if (project.id === parentId) {
            const newSubProject: Project = {
              ...subProject,
              id: newSubProjectId,
              parentProjectId: parentId
            };
            
            const updatedSubProjects = project.subProjects ? [...project.subProjects, newSubProject] : [newSubProject];
            
            return {
              ...project,
              subProjects: updatedSubProjects
            };
          }
          
          // Check subprojects recursively
          if (project.subProjects) {
            return {
              ...project,
              subProjects: addSubProjectToParent(project.subProjects)
            };
          }
          
          return project;
        });
      };
      
      return addSubProjectToParent(prevProjects);
    });

    // Update progress after adding a subproject
    updateAllProjectProgress();
  };

  const getProjectById = (id: string): Project | undefined => {
    const findProjectById = (projects: Project[]): Project | undefined => {
      for (const project of projects) {
        if (project.id === id) {
          return project;
        }
        
        if (project.subProjects) {
          const foundInSubprojects = findProjectById(project.subProjects);
          if (foundInSubprojects) {
            return foundInSubprojects;
          }
        }
      }
      
      return undefined;
    };
    
    return findProjectById(projects);
  };

  const toggleProjectPin = (id: string) => {
    setProjects(prevProjects => {
      const togglePin = (projects: Project[]): Project[] => {
        return projects.map(project => {
          if (project.id === id) {
            return { ...project, pinned: !project.pinned };
          }
          
          // Check subprojects recursively
          if (project.subProjects) {
            return {
              ...project,
              subProjects: togglePin(project.subProjects)
            };
          }
          
          return project;
        });
      };
      
      return togglePin(prevProjects);
    });
  };

  const getProjectsProgress = () => {
    if (projects.length === 0) return 0;
    
    // Only consider active projects
    const activeProjects = projects.filter(p => 
      p.status === "in-progress" || p.status === "active" || p.status === "not-started"
    );
    if (activeProjects.length === 0) return 0;
    
    const totalProgress = activeProjects.reduce((sum, project) => sum + project.progress, 0);
    return totalProgress / activeProjects.length;
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        addProject,
        updateProject,
        deleteProject,
        getProjectById,
        addSubProject,
        toggleProjectPin,
        getProjectsProgress
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
