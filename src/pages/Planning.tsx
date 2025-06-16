
import React, { useState, useEffect } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Target, ClipboardList } from "lucide-react";
import EnhancedGoalForm from "@/components/planning/EnhancedGoalForm";
import ProjectCreationDialog from "@/components/planning/ProjectCreationDialog";
import PlanningBoardView from "@/components/planning/PlanningBoardView";
import PlanningListView from "@/components/planning/PlanningListView";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";

const Planning = () => {
  const { toast } = useToast();
  const [view, setView] = useState<'list' | 'board'>('list');
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [goals, setGoals] = useLocalStorage<Goal[]>('planningGoals', []);
  const [projects, setProjects] = useLocalStorage<Project[]>('planningProjects', []);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Refresh goals from localStorage on mount and when goals are updated
  useEffect(() => {
    const loadGoals = () => {
      try {
        const data = localStorage.getItem('planningGoals');
        if (data) {
          const parsedGoals = JSON.parse(data);
          console.log("Loading goals:", parsedGoals);
          setGoals(parsedGoals);
        }
      } catch (error) {
        console.error("Error loading goals:", error);
      }
    };
    
    loadGoals();
    
    const handleGoalsUpdate = () => {
      console.log("Goals updated event received");
      loadGoals();
    };
    
    window.addEventListener('goalsUpdated', handleGoalsUpdate);
    return () => {
      window.removeEventListener('goalsUpdated', handleGoalsUpdate);
    };
  }, [setGoals]);

  const handleGoalCreate = (goal: Goal) => {
    console.log("Creating/updating goal:", goal);
    
    try {
      let updatedGoals;
      
      if (selectedGoal) {
        // Update existing goal
        updatedGoals = goals.map(g => g.id === goal.id ? goal : g);
        toast({
          title: "Goal Updated",
          description: "Your goal has been updated successfully."
        });
        setSelectedGoal(null);
      } else {
        // Create new goal
        const newGoal = {
          ...goal,
          id: goal.id || Date.now().toString()
        };
        updatedGoals = [...goals, newGoal];
        toast({
          title: "Goal Created",
          description: "Your new goal has been created successfully."
        });
      }
      
      // Update state and localStorage
      setGoals(updatedGoals);
      localStorage.setItem('planningGoals', JSON.stringify(updatedGoals));
      
      // Dispatch event for other components
      window.dispatchEvent(new CustomEvent('goalsUpdated'));
      
      setShowGoalDialog(false);
    } catch (error) {
      console.error("Error saving goal:", error);
      toast({
        title: "Error",
        description: "Failed to save goal. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleProjectCreate = (project: Project) => {
    console.log("Creating/updating project:", project);
    
    try {
      let updatedProjects;
      
      if (selectedProject) {
        // Update existing project
        updatedProjects = projects.map(p => p.id === project.id ? project : p);
        toast({
          title: "Project Updated",
          description: "Your project has been updated successfully."
        });
        setSelectedProject(null);
      } else {
        // Create new project
        const newProject = {
          ...project,
          id: project.id || Date.now().toString()
        };
        updatedProjects = [...projects, newProject];
        toast({
          title: "Project Created",
          description: "Your new project has been created successfully."
        });
      }
      
      // Update state and localStorage
      setProjects(updatedProjects);
      localStorage.setItem('planningProjects', JSON.stringify(updatedProjects));
      
      setShowProjectDialog(false);
    } catch (error) {
      console.error("Error saving project:", error);
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleProgressUpdate = (itemToUpdate: Goal | Project, newProgress: number) => {
    console.log("Updating progress:", itemToUpdate.title, "to", newProgress + "%");
    
    try {
      if ('milestones' in itemToUpdate) {
        // It's a Goal
        const updatedGoals = goals.map(g => 
          g.id === itemToUpdate.id ? { ...g, progress: newProgress } : g
        );
        setGoals(updatedGoals);
        localStorage.setItem('planningGoals', JSON.stringify(updatedGoals));
        window.dispatchEvent(new CustomEvent('goalsUpdated'));
        
        toast({
          title: "Goal Progress Updated",
          description: `Progress for "${itemToUpdate.title}" updated to ${newProgress}%.`,
        });
      } else {
        // It's a Project
        const updatedProjects = projects.map(p => 
          p.id === itemToUpdate.id ? { ...p, progress: newProgress } : p
        );
        setProjects(updatedProjects);
        localStorage.setItem('planningProjects', JSON.stringify(updatedProjects));
        
        toast({
          title: "Project Progress Updated",
          description: `Progress for "${itemToUpdate.title}" updated to ${newProgress}%.`,
        });
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditGoal = (goal: Goal) => {
    console.log("Editing goal:", goal);
    setSelectedGoal(goal);
    setShowGoalDialog(true);
  };

  const handleEditProject = (project: Project) => {
    console.log("Editing project:", project);
    setSelectedProject(project);
    setShowProjectDialog(true);
  };

  const resetDialogs = () => {
    setSelectedGoal(null);
    setSelectedProject(null);
  };

  return (
    <ModernAppLayout>
      <div className="animate-fade-in p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Planning</h1>
            <p className="text-slate-400 mt-2">Set and manage your goals and projects</p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={() => {
                resetDialogs();
                setShowGoalDialog(true);
              }} 
              className="gap-2 bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20"
            >
              <Plus size={18} />
              New Goal
            </Button>
            <Button 
              onClick={() => {
                resetDialogs();
                setShowProjectDialog(true);
              }} 
              variant="outline" 
              className="gap-2 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <Plus size={18} />
              New Project
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="goals">
          <div className="flex justify-between items-center">
            <TabsList className="bg-slate-900/50 border border-slate-800">
              <TabsTrigger value="goals" className="gap-2 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
                <Target className="h-4 w-4" />
                Goals ({goals.length})
              </TabsTrigger>
              <TabsTrigger value="projects" className="gap-2 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
                <ClipboardList className="h-4 w-4" />
                Projects ({projects.length})
              </TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button 
                variant={view === 'list' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setView('list')}
                className={view === 'list' ? 'bg-orange-500 hover:bg-orange-600' : 'border-slate-700 text-slate-300 hover:bg-slate-800'}
              >
                List
              </Button>
              <Button 
                variant={view === 'board' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setView('board')}
                className={view === 'board' ? 'bg-orange-500 hover:bg-orange-600' : 'border-slate-700 text-slate-300 hover:bg-slate-800'}
              >
                Board
              </Button>
            </div>
          </div>
          
          <TabsContent value="goals" className="mt-6">
            {goals.length === 0 ? (
              <Card className="border-slate-800 bg-slate-950/40">
                <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[300px]">
                  <Target className="h-12 w-12 text-slate-600 mb-4" />
                  <h3 className="mt-4 text-lg font-medium text-slate-200">No goals yet</h3>
                  <p className="mt-2 text-slate-400 text-center max-w-md">
                    Create your first goal to track your progress toward important milestones.
                  </p>
                  <Button 
                    onClick={() => {
                      resetDialogs();
                      setShowGoalDialog(true);
                    }} 
                    className="mt-4 gap-2 bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20"
                  >
                    <Plus size={16} />
                    Create First Goal
                  </Button>
                </CardContent>
              </Card>
            ) : view === 'list' ? (
              <PlanningListView 
                goals={goals} 
                contentType="goals" 
                onEditItem={goal => handleEditGoal(goal as Goal)} 
                onUpdateProgress={handleProgressUpdate}
              />
            ) : (
              <PlanningBoardView 
                goals={goals} 
                contentType="goals" 
                onEditItem={goal => handleEditGoal(goal as Goal)} 
              />
            )}
          </TabsContent>
          
          <TabsContent value="projects" className="mt-6">
            {projects.length === 0 ? (
              <Card className="border-slate-800 bg-slate-950/40">
                <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[300px]">
                  <ClipboardList className="h-12 w-12 text-slate-600 mb-4" />
                  <h3 className="mt-4 text-lg font-medium text-slate-200">No projects yet</h3>
                  <p className="mt-2 text-slate-400 text-center max-w-md">
                    Create your first project to organize your work and track progress.
                  </p>
                  <Button 
                    onClick={() => {
                      resetDialogs();
                      setShowProjectDialog(true);
                    }} 
                    className="mt-4 gap-2 bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  >
                    <Plus size={16} />
                    Create First Project
                  </Button>
                </CardContent>
              </Card>
            ) : view === 'list' ? (
              <PlanningListView 
                projects={projects} 
                contentType="projects" 
                onEditItem={project => handleEditProject(project as Project)} 
                onUpdateProgress={handleProgressUpdate}
              />
            ) : (
              <PlanningBoardView 
                projects={projects} 
                contentType="projects" 
                onEditItem={project => handleEditProject(project as Project)} 
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <EnhancedGoalForm 
        open={showGoalDialog} 
        onOpenChange={(open) => {
          setShowGoalDialog(open);
          if (!open) setSelectedGoal(null);
        }} 
        onGoalCreate={handleGoalCreate} 
        initialGoal={selectedGoal} 
      />
      
      <ProjectCreationDialog 
        open={showProjectDialog} 
        onOpenChange={(open) => {
          setShowProjectDialog(open);
          if (!open) setSelectedProject(null);
        }} 
        onProjectCreate={handleProjectCreate} 
        initialProject={selectedProject} 
        existingProjects={projects} 
      />
    </ModernAppLayout>
  );
};

export default Planning;
