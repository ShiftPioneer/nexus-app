
import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { UnifiedPageHeader } from "@/components/ui/unified-page-header";
import { navigationIcons } from "@/lib/navigation-icons";
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
        <div className="animate-fade-in space-y-6 bg-slate-900 min-h-full">
          <UnifiedPageHeader
            title="Dashboard"
            description="Your life operating system command center"
            icon={navigationIcons.dashboard}
            gradient="from-blue-500 via-indigo-500 to-purple-500"
          />
          
          <WelcomeSection />
          <StatsSection />
          
          {/* Responsive Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Main Content Area - Responsive columns */}
            <div className="lg:col-span-3 space-y-6">
              <TasksSection />
              <GoalSection />
            </div>
            
            {/* Sidebar Content - Full width on mobile, 2 columns on desktop */}
            <div className="lg:col-span-2 space-y-6">
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
