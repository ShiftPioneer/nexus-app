
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useGoals } from "@/contexts/GoalContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import PlanningBoardView from "@/components/planning/PlanningBoardView";
import GoalsList from "@/components/planning/GoalsList";
import { useProjects } from "@/contexts/ProjectContext";
import Projects from "./Projects";

const Planning = () => {
  const { goals } = useGoals();
  const { projects } = useProjects();
  const [activeTab, setActiveTab] = useState("goals");
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    navigate(-1);
  };

  const handleGoalUpdate = (goal: any) => {
    console.log("Goal updated:", goal);
  };

  return (
    <AppLayout>
      <div className="container px-4 py-6 mx-auto">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goBack} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Planning</h1>
            <p className="text-muted-foreground">Set and track your goals</p>
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
              <Button className="bg-[#FF6500] hover:bg-[#E55A00]">
                <Plus className="mr-2 h-4 w-4" /> New Goal
              </Button>
            </div>

            {goals.length > 0 ? (
              <div>
                <Tabs defaultValue="list">
                  <TabsList>
                    <TabsTrigger value="list">List</TabsTrigger>
                    <TabsTrigger value="board">Board</TabsTrigger>
                  </TabsList>
                  <TabsContent value="list" className="mt-6">
                    <GoalsList goals={goals} onGoalUpdate={handleGoalUpdate} />
                  </TabsContent>
                  <TabsContent value="board" className="mt-6">
                    <PlanningBoardView 
                      goals={goals} 
                      contentType="goals" 
                      onEditItem={handleGoalUpdate} 
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
                <Button className="bg-[#FF6500] hover:bg-[#E55A00]">
                  <Plus className="mr-2 h-4 w-4" /> Create Your First Goal
                </Button>
              </div>
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
