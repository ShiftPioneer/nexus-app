import React, { useState } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent } from "@/components/ui/modern-tabs";
import { Target, Layout, BarChart3, Plus, Brain } from "lucide-react";
import { UnifiedPageHeader } from "@/components/ui/unified-page-header";
import { UnifiedActionButton } from "@/components/ui/unified-action-button";
import GoalsList from "@/components/planning/GoalsList";
import PlanningBoardView from "@/components/planning/PlanningBoardView";
import PlanningListView from "@/components/planning/PlanningListView";
import PlanningStatsDialog from "@/components/planning/PlanningStatsDialog";
import GoalCreationDialog from "@/components/planning/GoalCreationDialog";
import ProjectCreationDialog from "@/components/planning/ProjectCreationDialog";
import ReviewTab from "@/components/planning/ReviewTab";
import { useGTDProjectsSync } from "@/hooks/use-gtd-projects-sync";
import { navigationIcons } from "@/lib/navigation-icons";

const Planning = () => {
  const [activeTab, setActiveTab] = useState("goals");
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Goal | Project | null>(null);
  const [editingItem, setEditingItem] = useState<Goal | Project | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Enable GTD-Planning sync
  useGTDProjectsSync();

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
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      count: goals.length
    },
    { 
      value: "board", 
      label: "Project Board", 
      icon: Layout,
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
      count: projects.length
    },
    { 
      value: "list", 
      label: "Task List", 
      icon: BarChart3,
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      count: goals.length + projects.length
    },
    { 
      value: "review", 
      label: "Weekly Review", 
      icon: Brain,
      gradient: "from-cyan-500 via-blue-500 to-indigo-500"
    }
  ];

  return (
    <ModernAppLayout>
      <div className="page-container">
        <div className="page-content">
          <UnifiedPageHeader
            title="Planning System"
            description="Set goals, manage projects, and track your progress toward success"
            icon={navigationIcons.planning}
            gradient="from-emerald-500 via-teal-500 to-cyan-500"
          />
        <div className="flex justify-end gap-3">
          <UnifiedActionButton
            onClick={handleCreateGoal}
            icon={Plus}
            variant="primary"
          >
            New Goal
          </UnifiedActionButton>
          <UnifiedActionButton
            onClick={handleCreateProject}
            icon={Plus}
            variant="secondary"
          >
            New Project
          </UnifiedActionButton>
        </div>

        <ModernTabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <ModernTabsList className="grid w-full grid-cols-4 max-w-4xl mx-auto">
            {tabItems.map((tab) => (
              <ModernTabsTrigger 
                key={tab.value}
                value={tab.value}
                gradient={tab.gradient}
                icon={tab.icon}
                count={tab.count}
                className="flex-1"
              >
                {tab.label}
              </ModernTabsTrigger>
            ))}
          </ModernTabsList>
          
          <ModernTabsContent value="goals" className="mt-8 max-w-6xl mx-auto">
              <GoalsList
                onCreateGoal={handleCreateGoal}
                onEditGoal={handleEditGoal}
                onDeleteGoal={handleDeleteGoal}
              />
          </ModernTabsContent>
          
          <ModernTabsContent value="board" className="mt-8 max-w-7xl mx-auto">
              <PlanningBoardView
                goals={goals}
                projects={projects}
                contentType="projects"
                onEditItem={handleEditItem}
              />
          </ModernTabsContent>
          
          <ModernTabsContent value="list" className="mt-8 max-w-6xl mx-auto">
              <PlanningListView
                goals={goals}
                projects={projects}
                contentType="projects"
                onEditItem={handleEditItem}
                onUpdateProgress={handleUpdateProgress}
              />
          </ModernTabsContent>
          
          <ModernTabsContent value="review" className="mt-8 max-w-6xl mx-auto">
              <ReviewTab goals={goals} projects={projects} />
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
      </div>
    </ModernAppLayout>
  );
};

export default Planning;
