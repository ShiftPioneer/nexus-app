
import React, { useState } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent } from "@/components/ui/modern-tabs";
import { Target, Layout, BarChart3, Lightbulb } from "lucide-react";
import GoalsList from "@/components/planning/GoalsList";
import PlanningBoardView from "@/components/planning/PlanningBoardView";
import PlanningListView from "@/components/planning/PlanningListView";
import PlanningStatsDialog from "@/components/planning/PlanningStatsDialog";

const Planning = () => {
  const [activeTab, setActiveTab] = useState("goals");
  const [showStatsDialog, setShowStatsDialog] = useState(false);

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
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 shadow-lg">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            Planning System
          </h1>
          <p className="text-slate-400 mt-3 text-lg">Set goals, manage projects, and track your progress</p>
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
            <GoalsList />
          </ModernTabsContent>
          
          <ModernTabsContent value="board">
            <PlanningBoardView />
          </ModernTabsContent>
          
          <ModernTabsContent value="list">
            <PlanningListView />
          </ModernTabsContent>
        </ModernTabs>

        <PlanningStatsDialog 
          open={showStatsDialog} 
          onOpenChange={setShowStatsDialog} 
        />
      </div>
    </ModernAppLayout>
  );
};

export default Planning;
