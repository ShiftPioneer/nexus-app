
import React, { useState } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent } from "@/components/ui/modern-tabs";
import { BarChart2, Dumbbell } from "lucide-react";
import { UnifiedPageHeader } from "@/components/ui/unified-page-header";
import { navigationIcons } from "@/lib/navigation-icons";
import { DashboardTab } from "@/components/energy/DashboardTab";
import { WorkoutsTab } from "@/components/energy/WorkoutsTab";
import AnalyticsTab from "@/components/energy/AnalyticsTab";

const Energy = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabItems = [
    { 
      value: "dashboard", 
      label: "Dashboard", 
      icon: navigationIcons.energy,
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
      <div className="animate-fade-in space-y-8 bg-slate-900 min-h-full">
        <UnifiedPageHeader
          title="Energy Hub"
          description="Track your workouts, analyze performance, and achieve your fitness goals"
          icon={navigationIcons.energy}
          gradient="from-red-500 via-orange-500 to-yellow-500"
        />
        
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
