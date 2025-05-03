
import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import AppLayout from "@/components/layout/AppLayout";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import StatsSection from "@/components/dashboard/StatsSection";
import TasksSection from "@/components/dashboard/TasksSection";
import HabitsSection from "@/components/dashboard/HabitsSection";
import GoalSection from "@/components/dashboard/GoalSection";
import JournalSection from "@/components/dashboard/JournalSection";

const Dashboard = () => {
  const handleDragEnd = (result: any) => {
    // Handle drag end if needed for dashboard items
    console.log("Drag ended:", result);
  };

  return (
    <AppLayout>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="animate-fade-in">
          <WelcomeSection />
          <StatsSection />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TasksSection />
              <GoalSection />
            </div>
            <div className="space-y-6">
              <HabitsSection />
              <JournalSection />
            </div>
          </div>
        </div>
      </DragDropContext>
    </AppLayout>
  );
};

export default Dashboard;
