
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useGoals } from "@/contexts/GoalContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PlanningBoardView from "@/components/planning/PlanningBoardView";
import GoalsList from "@/components/planning/GoalsList";
import { useProjects } from "@/contexts/ProjectContext";
import Projects from "./Projects";
import GoalCreationDialog from "@/components/planning/GoalCreationDialog";
import { Goal } from "@/types/planning";

const Planning = () => {
  const { goals, addGoal, updateGoal } = useGoals();
  const [activeTab, setActiveTab] = useState("goals");
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [goalsViewMode, setGoalsViewMode] = useState<"list" | "board">("list");

  const handleOpenGoalDialog = () => {
    setEditingGoal(null);
    setIsGoalDialogOpen(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setIsGoalDialogOpen(true);
  };

  const handleCreateGoal = (goal: Goal) => {
    if (editingGoal) {
      updateGoal(goal.id, goal);
    } else {
      addGoal(goal);
    }
    setIsGoalDialogOpen(false);
  };

  return (
    <AppLayout>
      <div className="container px-4 py-6 mx-auto">
        <div className="flex items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Planning</h1>
            <p className="text-muted-foreground">Set and track your goals and projects</p>
          </div>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="mb-8"
        >
          <TabsList>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="goals" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Your Goals</h2>
              <Button className="bg-[#FF6500] hover:bg-[#E55A00]" onClick={handleOpenGoalDialog}>
                <Plus className="mr-2 h-4 w-4" /> New Goal
              </Button>
            </div>

            {goals.length > 0 ? (
              <div>
                <Tabs value={goalsViewMode} onValueChange={(value) => setGoalsViewMode(value as "list" | "board")}>
                  <TabsList>
                    <TabsTrigger value="list">List</TabsTrigger>
                    <TabsTrigger value="board">Board</TabsTrigger>
                  </TabsList>
                  <TabsContent value="list" className="mt-6">
                    <GoalsList goals={goals} onGoalUpdate={handleEditGoal} />
                  </TabsContent>
                  <TabsContent value="board" className="mt-6">
                    <PlanningBoardView 
                      goals={goals} 
                      contentType="goals" 
                      onEditItem={handleEditGoal} 
                    />
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="text-center p-12 border-2 border-dashed rounded-lg">
                <h3 className="text-xl font-medium mb-2">No goals yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first goal to get started on your journey
                </p>
                <Button className="bg-[#FF6500] hover:bg-[#E55A00]" onClick={handleOpenGoalDialog}>
                  <Plus className="mr-2 h-4 w-4" /> Create Your First Goal
                </Button>
              </div>
            )}
            
            {isGoalDialogOpen && (
              <GoalCreationDialog
                open={isGoalDialogOpen}
                onOpenChange={setIsGoalDialogOpen}
                onGoalCreate={handleCreateGoal}
                existingGoals={goals}
                existingGoal={editingGoal}
              />
            )}
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <Projects />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Planning;
