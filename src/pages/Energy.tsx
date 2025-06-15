
import React, { useState } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, Dumbbell } from "lucide-react";
import { DashboardTab } from "@/components/energy/DashboardTab";
import { WorkoutsTab } from "@/components/energy/WorkoutsTab";
import { AnalyticsTab } from "@/components/energy/AnalyticsTab";

const Energy = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <ModernAppLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            Energy Hub
          </h1>
          <p className="text-muted-foreground">Track your workouts, analyze progress, and achieve your fitness goals</p>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList>
              <TabsTrigger 
                value="dashboard"
                className="flex items-center gap-2"
              >
                <Dumbbell className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="workouts"
                className="flex items-center gap-2"
              >
                <Dumbbell className="h-4 w-4" />
                Workouts
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className="flex items-center gap-2"
              >
                <BarChart2 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>
          
          <TabsContent value="dashboard" className="mt-6">
            <DashboardTab />
          </TabsContent>
          
          <TabsContent value="workouts" className="mt-6">
            <WorkoutsTab />
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-6">
            <AnalyticsTab />
          </TabsContent>
        </Tabs>
      </div>
    </ModernAppLayout>
  );
};

export default Energy;
