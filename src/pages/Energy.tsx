
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Zap, BarChart2, Dumbbell } from "lucide-react";
import { DashboardTab } from "@/components/energy/DashboardTab";
import { WorkoutsTab } from "@/components/energy/WorkoutsTab";
import { AnalyticsTab } from "@/components/energy/AnalyticsTab";

const Energy = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            Energy Hub
          </h1>
          <p className="text-muted-foreground">Track your workouts, analyze progress, and achieve your fitness goals</p>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="bg-card border rounded-lg overflow-hidden mb-6">
            <TabsList className="w-full justify-start rounded-none border-b bg-muted/50 p-0">
              <TabsTrigger 
                value="dashboard"
                className={cn(
                  "data-[state=active]:bg-background rounded-none border-r px-8 py-3",
                  "flex items-center gap-2"
                )}
              >
                <Zap className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="workouts"
                className={cn(
                  "data-[state=active]:bg-background rounded-none border-r px-8 py-3",
                  "flex items-center gap-2"
                )}
              >
                <Dumbbell className="h-4 w-4" />
                Workouts
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className={cn(
                  "data-[state=active]:bg-background rounded-none px-8 py-3",
                  "flex items-center gap-2"
                )}
              >
                <BarChart2 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="dashboard" className="mt-0">
            <DashboardTab />
          </TabsContent>
          
          <TabsContent value="workouts" className="mt-0">
            <WorkoutsTab />
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-0">
            <AnalyticsTab />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Energy;
