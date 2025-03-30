
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Plus, Target, Filter, ListFilter, LayoutGrid, Calendar, Clock, BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import PlanningBoardView from "@/components/planning/PlanningBoardView";
import PlanningListView from "@/components/planning/PlanningListView";
import GoalCreationDialog from "@/components/planning/GoalCreationDialog";
import ProjectCreationDialog from "@/components/planning/ProjectCreationDialog";

const Planning = () => {
  const [viewType, setViewType] = useState<"list" | "board">("list");
  const [contentType, setContentType] = useState<"goals" | "projects">("goals");
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);

  // Mock data - In a real app, this would come from a backend
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Learn Spanish",
      description: "Become conversationally fluent in Spanish",
      category: "education",
      timeframe: "month",
      progress: 65,
      startDate: new Date(2024, 0, 15),
      endDate: new Date(2024, 6, 15),
      status: "in-progress",
      milestones: [
        {
          id: "m1",
          title: "Complete Beginner Course",
          completed: true,
          dueDate: new Date(2024, 2, 1),
        },
        {
          id: "m2",
          title: "Have first conversation",
          completed: false,
          dueDate: new Date(2024, 3, 1),
        },
      ],
    },
    {
      id: "2",
      title: "Run 5K",
      description: "Train and complete a 5K run",
      category: "health",
      timeframe: "quarter",
      progress: 85,
      startDate: new Date(2024, 1, 1),
      endDate: new Date(2024, 4, 1),
      status: "in-progress",
      milestones: [
        {
          id: "m1",
          title: "Run 1K without stopping",
          completed: true,
          dueDate: new Date(2024, 1, 15),
        },
        {
          id: "m2",
          title: "Run 3K without stopping",
          completed: true,
          dueDate: new Date(2024, 2, 15),
        },
      ],
    },
  ]);

  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "Website Redesign",
      description: "Complete the redesign of the company website",
      category: "career",
      progress: 40,
      startDate: new Date(2024, 2, 10),
      endDate: new Date(2024, 5, 30),
      status: "in-progress"
    },
    {
      id: "2",
      title: "Marketing Campaign",
      description: "Plan and execute Q2 marketing campaign",
      category: "career",
      progress: 25,
      startDate: new Date(2024, 3, 1),
      endDate: new Date(2024, 7, 15),
      status: "in-progress"
    }
  ]);

  const handleNewItem = () => {
    if (contentType === "goals") {
      setShowGoalDialog(true);
    } else {
      setShowProjectDialog(true);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Goals & Planning</h1>
          <p className="text-muted-foreground mt-2">Track your personal and professional goals and projects.</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={contentType === "goals" ? "default" : "ghost"}
              className="rounded-md"
              onClick={() => setContentType("goals")}
            >
              Goals
            </Button>
            <Button
              variant={contentType === "projects" ? "default" : "ghost"}
              className="rounded-md"
              onClick={() => setContentType("projects")}
            >
              Projects
            </Button>
            <Button variant="ghost" className="rounded-md">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
          </div>

          <Button onClick={handleNewItem} className="gap-1">
            <Plus size={18} />
            New {contentType === "goals" ? "Goal" : "Project"}
          </Button>
        </div>

        <div className="flex bg-muted rounded-lg p-1 w-fit">
          <Button
            variant={viewType === "list" ? "default" : "ghost"}
            className="rounded-md"
            onClick={() => setViewType("list")}
          >
            List View
          </Button>
          <Button
            variant={viewType === "board" ? "default" : "ghost"}
            className="rounded-md"
            onClick={() => setViewType("board")}
          >
            Board View
          </Button>
        </div>

        {viewType === "list" ? (
          <PlanningListView 
            goals={contentType === "goals" ? goals : []} 
            projects={contentType === "projects" ? projects : []}
            contentType={contentType}
            onUpdateGoal={(updatedGoal) => {
              setGoals(goals.map(g => g.id === updatedGoal.id ? updatedGoal : g));
            }}
            onUpdateProject={(updatedProject) => {
              setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
            }}
          />
        ) : (
          <PlanningBoardView 
            goals={contentType === "goals" ? goals : []} 
            projects={contentType === "projects" ? projects : []}
            contentType={contentType}
            onUpdateGoal={(updatedGoal) => {
              setGoals(goals.map(g => g.id === updatedGoal.id ? updatedGoal : g));
            }}
            onUpdateProject={(updatedProject) => {
              setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
            }}
          />
        )}

        <GoalCreationDialog 
          open={showGoalDialog} 
          onOpenChange={setShowGoalDialog}
          onGoalCreate={(newGoal) => {
            setGoals([...goals, { ...newGoal, id: String(goals.length + 1) }]);
          }}
        />

        <ProjectCreationDialog 
          open={showProjectDialog} 
          onOpenChange={setShowProjectDialog}
          onProjectCreate={(newProject) => {
            setProjects([...projects, { ...newProject, id: String(projects.length + 1) }]);
          }}
        />
      </div>
    </AppLayout>
  );
};

export default Planning;
