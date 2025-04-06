
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import StatsSection from "@/components/dashboard/StatsSection";
import TasksSection from "@/components/dashboard/TasksSection";
import HabitsSection from "@/components/dashboard/HabitsSection";
import GoalSection from "@/components/dashboard/GoalSection";
import JournalSection from "@/components/dashboard/JournalSection";
import GoalsProgressCard from "@/components/dashboard/GoalsProgressCard";
import { Card, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <AppLayout>
      <div className="animate-fade-in w-full max-w-[1400px] mx-auto"> {/* Increased width by 1.3x */}
        <WelcomeSection />
        <StatsSection />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="space-y-6 lg:col-span-1"> {/* Swapped positions */}
            <GoalsProgressCard />
            <HabitsSection />
            <JournalSection />
          </div>
          <div className="lg:col-span-2"> {/* Swapped positions */}
            <TasksSection />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GoalSection />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
