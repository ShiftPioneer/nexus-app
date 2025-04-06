import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useProjects } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProjectCreationDialog } from "@/components/planning/ProjectCreationDialog";
import { Project } from "@/types/planning";
import PlanningBoardView from "@/components/planning/PlanningBoardView";

const Projects = () => {
  const { projects, addProject, updateProject } = useProjects();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectsViewMode, setProjectsViewMode] = useState<"list" | "board">("board");

  const handleOpenDialog = () => {
    setEditingProject(null);
    setIsDialogOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsDialogOpen(true);
  };

  const handleCreateProject = (project: Project) => {
    if (editingProject) {
      updateProject(project.id, project);
    } else {
      addProject(project);
    }
    setIsDialogOpen(false);
  };

  return (
    <div>
      <AppLayout>
        <div className="container px-4 py-6 mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Projects</h1>
              <p className="text-muted-foreground">Manage your projects and track their progress</p>
            </div>
            <Button onClick={handleOpenDialog}>
              <Plus className="mr-2 h-4 w-4" /> New Project
            </Button>
          </div>

          {projects.length > 0 ? (
            <div>
              <PlanningBoardView 
                goals={projects} 
                contentType="projects" 
                onEditItem={handleEditProject} 
              />
            </div>
          ) : (
            <div className="text-center p-12 border-2 border-dashed rounded-lg">
              <h3 className="text-xl font-medium mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first project to get started
              </p>
              <Button onClick={handleOpenDialog}>
                <Plus className="mr-2 h-4 w-4" /> Create Your First Project
              </Button>
            </div>
          )}

          {isDialogOpen && (
            <ProjectCreationDialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              onSave={handleCreateProject}
              project={editingProject}
            />
          )}
        </div>
      </AppLayout>
    </div>
  );
};

export default Projects;
