
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import GoalsList from "@/components/planning/GoalsList";
import GoalCreationDialog from "@/components/planning/GoalCreationDialog";
import { Button } from "@/components/ui/button";
import { Plus, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Planning = () => {
  const [showGoalDialog, setShowGoalDialog] = useState(false);

  // Mock data - In a real app, this would come from a backend
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Save for Down Payment",
      description: "Save $50,000 for house down payment",
      category: "wealth",
      timeframe: "long-term",
      progress: 65,
      startDate: new Date(2024, 0, 1),
      endDate: new Date(2024, 11, 31),
      status: "in-progress",
      milestones: [
        {
          id: "m1",
          title: "Save first $10,000",
          completed: true,
          dueDate: new Date(2024, 2, 1),
        },
        {
          id: "m2",
          title: "Research investment options",
          completed: false,
          dueDate: new Date(2024, 3, 1),
        },
      ],
    },
  ]);

  return (
    <AppLayout>
      <div className="space-y-6 p-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              Goals & Planning
            </h1>
            <p className="text-muted-foreground">
              Set, track, and achieve your personal and professional goals
            </p>
          </div>
          <Button onClick={() => setShowGoalDialog(true)} className="gap-2">
            <Plus size={18} />
            New Goal
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Goals</TabsTrigger>
            <TabsTrigger value="wealth">Wealth</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="relationships">Relationships</TabsTrigger>
            <TabsTrigger value="spirituality">Spirituality</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <GoalsList goals={goals} onGoalUpdate={(updatedGoal) => {
              setGoals(goals.map(g => g.id === updatedGoal.id ? updatedGoal : g));
            }} />
          </TabsContent>

          {["wealth", "health", "relationships", "spirituality"].map((category) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <GoalsList 
                goals={goals.filter(g => g.category === category)}
                onGoalUpdate={(updatedGoal) => {
                  setGoals(goals.map(g => g.id === updatedGoal.id ? updatedGoal : g));
                }}
              />
            </TabsContent>
          ))}
        </Tabs>

        <GoalCreationDialog 
          open={showGoalDialog} 
          onOpenChange={setShowGoalDialog}
          onGoalCreate={(newGoal) => {
            setGoals([...goals, { ...newGoal, id: String(goals.length + 1) }]);
          }}
        />
      </div>
    </AppLayout>
  );
};

export default Planning;
