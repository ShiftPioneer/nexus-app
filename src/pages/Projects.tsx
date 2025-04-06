
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, ListTodo, KanbanSquare } from "lucide-react";
import PlanningBoardView from "@/components/planning/PlanningBoardView";
import PlanningListView from "@/components/planning/PlanningListView";
import { ProjectCreationDialog } from "@/components/planning/ProjectCreationDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type ProjectStatus = "planning" | "active" | "completed" | "abandoned" | "on hold";

interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  startDate: Date;
  endDate: Date;
  progress: number;
  category: string;
  pinned: boolean;
  timeframe: string;
  milestones: any[];
}

// Mock projects data for testing
const mockProjects: Project[] = [
  {
    id: "1",
    title: "Company Website Redesign",
    description: "Redesign the company website with a modern UI/UX",
    status: "active",
    startDate: new Date(2023, 3, 15),
    endDate: new Date(2023, 6, 30),
    progress: 60,
    category: "Work",
    pinned: true,
    timeframe: "Q2 2023",
    milestones: []
  },
  {
    id: "2",
    title: "Learn React Native",
    description: "Complete a comprehensive React Native course and build a mobile app",
    status: "planning",
    startDate: new Date(2023, 5, 1),
    endDate: new Date(2023, 7, 31),
    progress: 0,
    category: "Personal Development",
    pinned: false,
    timeframe: "Q3 2023",
    milestones: []
  },
  {
    id: "3",
    title: "Home Office Setup",
    description: "Set up an ergonomic and productive home office space",
    status: "completed",
    startDate: new Date(2023, 1, 10),
    endDate: new Date(2023, 2, 15),
    progress: 100,
    category: "Personal",
    pinned: false,
    timeframe: "Q1 2023",
    milestones: []
  }
];

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = (project: Project) => {
    setProjects([...projects, { ...project, id: Date.now().toString() }]);
    setCreateDialogOpen(false);
    toast({
      title: "Project created",
      description: `"${project.title}" has been added to your projects`,
    });
  };

  const handleEditProject = (project: Project) => {
    // This function will be implemented in the future
    console.log("Edit project:", project);
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-muted-foreground">Manage and track your ongoing projects</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            New Project
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="w-full sm:w-80">
                <Label htmlFor="search" className="sr-only">Search</Label>
                <Input
                  id="search"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "board" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("board")}
                  className="gap-2"
                >
                  <KanbanSquare className="h-4 w-4" />
                  Board
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="gap-2"
                >
                  <ListTodo className="h-4 w-4" />
                  List
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {viewMode === "board" ? (
          <PlanningBoardView 
            projects={filteredProjects}
            contentType="projects"
            onEditItem={handleEditProject}
          />
        ) : (
          <PlanningListView 
            projects={filteredProjects}
            contentType="projects"
            onEditItem={handleEditProject}
          />
        )}

        <ProjectCreationDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSave={handleCreateProject}
        />
      </div>
    </AppLayout>
  );
};

export default Projects;
