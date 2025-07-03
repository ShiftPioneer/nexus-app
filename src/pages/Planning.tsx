
import React, { useState } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent } from "@/components/ui/modern-tabs";
import { Target, Layout, BarChart3, Lightbulb, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import GoalsList from "@/components/planning/GoalsList";
import PlanningBoardView from "@/components/planning/PlanningBoardView";
import PlanningListView from "@/components/planning/PlanningListView";
import PlanningStatsDialog from "@/components/planning/PlanningStatsDialog";
import GoalCreationDialog from "@/components/planning/GoalCreationDialog";
import ProjectCreationDialog from "@/components/planning/ProjectCreationDialog";

const Planning = () => {
  const [activeTab, setActiveTab] = useState("goals");
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Goal | Project | null>(null);
  const [editingItem, setEditingItem] = useState<Goal | Project | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Load data from localStorage on component mount
  React.useEffect(() => {
    const savedGoals = localStorage.getItem('planningGoals');
    const savedProjects = localStorage.getItem('planningProjects');
    
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  const handleCreateGoal = () => {
    setEditingItem(null);
    setShowGoalDialog(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingItem(goal);
    setShowGoalDialog(true);
  };

  const handleDeleteGoal = (id: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== id);
    setGoals(updatedGoals);
    localStorage.setItem('planningGoals', JSON.stringify(updatedGoals));
  };

  const handleCreateProject = () => {
    setEditingItem(null);
    setShowProjectDialog(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingItem(project);
    setShowProjectDialog(true);
  };

  const handleDeleteProject = (id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    setProjects(updatedProjects);
    localStorage.setItem('planningProjects', JSON.stringify(updatedProjects));
  };

  const handleEditItem = (item: Goal | Project) => {
    if (activeTab === 'goals') {
      handleEditGoal(item as Goal);
    } else {
      handleEditProject(item as Project);
    }
  };

  const handleUpdateProgress = (item: Goal | Project, newProgress: number) => {
    if (activeTab === 'goals') {
      const updatedGoals = goals.map(goal => 
        goal.id === item.id ? { ...goal, progress: newProgress } : goal
      );
      setGoals(updatedGoals);
      localStorage.setItem('planningGoals', JSON.stringify(updatedGoals));
    } else {
      const updatedProjects = projects.map(project => 
        project.id === item.id ? { ...project, progress: newProgress } : project
      );
      setProjects(updatedProjects);
      localStorage.setItem('planningProjects', JSON.stringify(updatedProjects));
    }
  };

  const handleStatsClick = (item: Goal | Project) => {
    setSelectedItem(item);
    setShowStatsDialog(true);
  };

  const tabItems = [
    { 
      value: "goals", 
      label: "Goals & Objectives", 
      icon: Target,
      gradient: "from-emerald-500 via-teal-500 to-cyan-500"
    },
    { 
      value: "board", 
      label: "Project Board", 
      icon: Layout,
      gradient: "from-blue-500 via-indigo-500 to-purple-500"
    },
    { 
      value: "list", 
      label: "Task List", 
      icon: BarChart3,
      gradient: "from-purple-500 via-pink-500 to-rose-500"
    }
  ];

  return (
    <ModernAppLayout>
      <div className="animate-fade-in space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 shadow-lg">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              Planning System
            </h1>
            <p className="text-slate-400 mt-3 text-lg">Set goals, manage projects, and track your progress</p>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={handleCreateGoal}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Goal
            </Button>
            <Button
              onClick={handleCreateProject}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        <ModernTabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <ModernTabsList>
            {tabItems.map((tab) => (
              <ModernTabsTrigger 
                key={tab.value}
                value={tab.value}
                gradient={tab.gradient}
                icon={tab.icon}
              >
                {tab.label}
              </ModernTabsTrigger>
            ))}
          </ModernTabsList>
          
          <ModernTabsContent value="goals">
            <GoalsList 
              goals={goals}
              onCreateGoal={handleCreateGoal}
              onEditGoal={handleEditGoal}
              onDeleteGoal={handleDeleteGoal}
            />
          </ModernTabsContent>
          
          <ModernTabsContent value="board">
            <PlanningBoardView 
              goals={goals}
              projects={projects}
              contentType={activeTab === 'goals' ? 'goals' : 'projects'}
              onEditItem={handleEditItem}
            />
          </ModernTabsContent>
          
          <ModernTabsContent value="list">
            <PlanningListView 
              goals={goals}
              projects={projects}
              contentType={activeTab === 'goals' ? 'goals' : 'projects'}
              onEditItem={handleEditItem}
              onUpdateProgress={handleUpdateProgress}
            />
          </ModernTabsContent>
        </ModernTabs>

        <PlanningStatsDialog 
          open={showStatsDialog} 
          onOpenChange={setShowStatsDialog}
          item={selectedItem}
          type={activeTab === 'goals' ? 'goals' : 'projects'}
        />

        <GoalCreationDialog
          open={showGoalDialog}
          onOpenChange={setShowGoalDialog}
          initialGoal={editingItem as Goal}
          existingGoals={goals}
          onGoalCreate={(goal) => {
            if (editingItem) {
              const updatedGoals = goals.map(g => g.id === goal.id ? goal : g);
              setGoals(updatedGoals);
              localStorage.setItem('planningGoals', JSON.stringify(updatedGoals));
            } else {
              const updatedGoals = [...goals, goal];
              setGoals(updatedGoals);
              localStorage.setItem('planningGoals', JSON.stringify(updatedGoals));
            }
            setShowGoalDialog(false);
            setEditingItem(null);
          }}
        />

        <ProjectCreationDialog
          open={showProjectDialog}
          onOpenChange={setShowProjectDialog}
          initialProject={editingItem as Project}
          existingProjects={projects}
          onProjectCreate={(project) => {
            if (editingItem) {
              const updatedProjects = projects.map(p => p.id === project.id ? project : p);
              setProjects(updatedProjects);
              localStorage.setItem('planningProjects', JSON.stringify(updatedProjects));
            } else {
              const updatedProjects = [...projects, project];
              setProjects(updatedProjects);
              localStorage.setItem('planningProjects', JSON.stringify(updatedProjects));
            }
            setShowProjectDialog(false);
            setEditingItem(null);
          }}
        />
      </div>
    </ModernAppLayout>
  );
};

export default Planning;
