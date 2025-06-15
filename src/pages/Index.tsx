
import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import StatsSection from "@/components/dashboard/StatsSection";
import TasksSection from "@/components/dashboard/TasksSection";
import HabitsSection from "@/components/dashboard/HabitsSection";
import GoalSection from "@/components/dashboard/GoalSection";
import JournalSection from "@/components/dashboard/JournalSection";

const Dashboard = () => {
  const handleDragEnd = (result: any) => {
    console.log("Drag ended:", result);
  };

  return (
    <ModernAppLayout>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="animate-fade-in p-6 space-y-6 bg-slate-900">
          <WelcomeSection />
          <StatsSection />
          
          {/* Optimized Grid Layout - 65/35 split */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            {/* Main Content Area - 3 columns (60%) */}
            <div className="xl:col-span-3 space-y-6">
              <TasksSection />
              <GoalSection />
            </div>
            
            {/* Sidebar Content - 2 columns (40%) */}
            <div className="xl:col-span-2 space-y-6">
              <HabitsSection />
              <JournalSection />
            </div>
          </div>
        </div>
      </DragDropContext>
    </ModernAppLayout>
  );
};

export default Dashboard;
