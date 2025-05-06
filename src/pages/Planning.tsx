
import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Target, ClipboardList } from "lucide-react";
import GoalCreationDialog from "@/components/planning/GoalCreationDialog";
import ProjectCreationDialog from "@/components/planning/ProjectCreationDialog";
import PlanningBoardView from "@/components/planning/PlanningBoardView";
import PlanningListView from "@/components/planning/PlanningListView";
import { useToast } from "@/hooks/use-toast";

const Planning = () => {
  const { toast } = useToast();
  const [view, setView] = useState<'list' | 'board'>('list');
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Load goals and projects from localStorage
  useEffect(() => {
    try {
      const savedGoals = localStorage.getItem('planningGoals');
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      }
      
      const savedProjects = localStorage.getItem('planningProjects');
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects));
      }
    } catch (error) {
      console.error("Failed to load planning data:", error);
    }
  }, []);

  // Save goals and projects to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('planningGoals', JSON.stringify(goals));
    } catch (error) {
      console.error("Failed to save goals:", error);
    }
  }, [goals]);

  useEffect(() => {
    try {
      localStorage.setItem('planningProjects', JSON.stringify(projects));
    } catch (error) {
      console.error("Failed to save projects:", error);
    }
  }, [projects]);

  const handleGoalCreate = (goal: Goal) => {
    if (selectedGoal) {
      // Update existing goal
      setGoals(goals.map(g => g.id === goal.id ? goal : g));
      toast({
        title: "Plan Updated",
        description: "Your plan has been updated successfully."
      });
      setSelectedGoal(null);
    } else {
      // Add new goal
      setGoals([...goals, goal]);
      toast({
        title: "Plan Created",
        description: "Your new plan has been created successfully."
      });
    }
    setShowGoalDialog(false);
  };

  const handleProjectCreate = (project: Project) => {
    if (selectedProject) {
      // Update existing project
      setProjects(projects.map(p => p.id === project.id ? project : p));
      toast({
        title: "Project Updated",
        description: "Your project has been updated successfully."
      });
      setSelectedProject(null);
    } else {
      // Add new project
      setProjects([...projects, project]);
      toast({
        title: "Project Created",
        description: "Your new project has been created successfully."
      });
    }
    setShowProjectDialog(false);
  };

  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setShowGoalDialog(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setShowProjectDialog(true);
  };

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Plans</h1>
            <p className="text-muted-foreground mt-2">Set and manage your plans and projects</p>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={() => setShowGoalDialog(true)} className="gap-2">
              <Plus size={18} />
              New Plan
            </Button>
            <Button onClick={() => setShowProjectDialog(true)} variant="outline" className="gap-2">
              <Plus size={18} />
              New Project
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="goals">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="goals" className="gap-2">
                <Target className="h-4 w-4" />
                Plans
              </TabsTrigger>
              <TabsTrigger value="projects" className="gap-2">
                <ClipboardList className="h-4 w-4" />
                Projects
              </TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button variant={view === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setView('list')}>
                List
              </Button>
              <Button variant={view === 'board' ? 'default' : 'outline'} size="sm" onClick={() => setView('board')}>
                Board
              </Button>
            </div>
          </div>
          
          <TabsContent value="goals" className="mt-6">
            {goals.length === 0 ? (
              <Card>
                <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[300px]">
                  <Target className="h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No plans yet</h3>
                  <p className="mt-2 text-muted-foreground text-center max-w-md">
                    Create your first plan to track your progress toward important milestones.
                  </p>
                  <Button onClick={() => setShowGoalDialog(true)} className="mt-4 gap-2">
                    <Plus size={16} />
                    Create First Plan
                  </Button>
                </CardContent>
              </Card>
            ) : view === 'list' ? (
              <PlanningListView goals={goals} contentType="goals" onEditItem={goal => handleEditGoal(goal as Goal)} />
            ) : (
              <PlanningBoardView goals={goals} contentType="goals" onEditItem={goal => handleEditGoal(goal as Goal)} />
            )}
          </TabsContent>
          
          <TabsContent value="projects" className="mt-6">
            {projects.length === 0 ? (
              <Card>
                <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[300px]">
                  <ClipboardList className="h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No projects yet</h3>
                  <p className="mt-2 text-muted-foreground text-center max-w-md">
                    Create your first project to organize your work and track progress.
                  </p>
                  <Button onClick={() => setShowProjectDialog(true)} className="mt-4 gap-2">
                    <Plus size={16} />
                    Create First Project
                  </Button>
                </CardContent>
              </Card>
            ) : view === 'list' ? (
              <PlanningListView projects={projects} contentType="projects" onEditItem={project => handleEditProject(project as Project)} />
            ) : (
              <PlanningBoardView projects={projects} contentType="projects" onEditItem={project => handleEditProject(project as Project)} />
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <GoalCreationDialog 
        open={showGoalDialog} 
        onOpenChange={setShowGoalDialog} 
        onGoalCreate={handleGoalCreate} 
        initialGoal={selectedGoal} 
        existingGoals={goals} 
      />
      
      <ProjectCreationDialog 
        open={showProjectDialog} 
        onOpenChange={setShowProjectDialog} 
        onProjectCreate={handleProjectCreate} 
        initialProject={selectedProject} 
        existingProjects={projects} 
      />
    </AppLayout>
  );
};

export default Planning;
