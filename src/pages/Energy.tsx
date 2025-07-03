
import React, { useState } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent } from "@/components/ui/modern-tabs";
import { Zap, BarChart2, Dumbbell } from "lucide-react";
import { DashboardTab } from "@/components/energy/DashboardTab";
import { WorkoutsTab } from "@/components/energy/WorkoutsTab";
import { AnalyticsTab } from "@/components/energy/AnalyticsTab";

const Energy = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabItems = [
    { 
      value: "dashboard", 
      label: "Dashboard", 
      icon: Zap,
      gradient: "from-red-500 via-orange-500 to-yellow-500"
    },
    { 
      value: "workouts", 
      label: "Workouts", 
      icon: Dumbbell,
      gradient: "from-emerald-500 via-teal-500 to-cyan-500"
    },
    { 
      value: "analytics", 
      label: "Analytics", 
      icon: BarChart2,
      gradient: "from-blue-500 via-indigo-500 to-purple-500"
    }
  ];

  return (
    <ModernAppLayout>
      <div className="animate-fade-in space-y-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 shadow-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            Energy Hub
          </h1>
          <p className="text-slate-400 mt-3 text-lg">Track your workouts, analyze progress, and achieve your fitness goals</p>
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
          
          <ModernTabsContent value="dashboard">
            <DashboardTab />
          </ModernTabsContent>
          
          <ModernTabsContent value="workouts">
            <WorkoutsTab />
          </ModernTabsContent>
          
          <ModernTabsContent value="analytics">
            <AnalyticsTab />
          </ModernTabsContent>
        </ModernTabs>
      </div>
    </ModernAppLayout>
  );
};

export default Energy;
