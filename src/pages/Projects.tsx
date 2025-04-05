
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useProjects } from "@/contexts/ProjectContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PlanningBoardView from "@/components/planning/PlanningBoardView";
import PlanningListView from "@/components/planning/PlanningListView";
import ProjectCreationDialog from "@/components/planning/ProjectCreationDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from "@/types/planning";

const Projects = () => {
  const { projects } = useProjects();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "board">("list");

  const handleOpenDialog = () => {
    setEditingProject(null);
    setIsDialogOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsDialogOpen(true);
  };

  return (
    <AppLayout>
      <div className="container px-4 py-6 mx-auto animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Projects</h1>
            <p className="text-muted-foreground">
              Manage and track your projects
            </p>
          </div>

          <div className="flex items-center mt-4 md:mt-0 gap-4">
            <Tabs 
              value={viewMode} 
              onValueChange={(value) => setViewMode(value as "list" | "board")}
              className="mr-2"
            >
              <TabsList>
                <TabsTrigger value="list">List</TabsTrigger>
                <TabsTrigger value="board">Board</TabsTrigger>
              </TabsList>
            </Tabs>

            <Button onClick={handleOpenDialog} className="bg-[#FF6500] hover:bg-[#E55A00]">
              <Plus className="mr-2 h-4 w-4" /> New Project
            </Button>
          </div>
        </div>

        {projects.length === 0 ? (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>No projects yet</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-6">
              <p className="mb-4 text-muted-foreground">
                Start by creating your first project
              </p>
              <Button onClick={handleOpenDialog} className="bg-[#FF6500] hover:bg-[#E55A00]">
                <Plus className="mr-2 h-4 w-4" /> Create a Project
              </Button>
            </CardContent>
          </Card>
        ) : viewMode === "list" ? (
          <PlanningListView 
            projects={projects} 
            contentType="projects"
            onEditItem={handleEditProject}
          />
        ) : (
          <PlanningBoardView 
            projects={projects} 
            contentType="projects"
            onEditItem={handleEditProject}
          />
        )}

        {isDialogOpen && (
          <ProjectCreationDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            existingProject={editingProject}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default Projects;
