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
  return <ModernAppLayout>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="animate-fade-in p-6 space-y-6 bg-slate-900">
          <WelcomeSection />
          <StatsSection />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <TasksSection />
              <GoalSection />
            </div>
            <div className="space-y-6 bg-slate-900">
              <HabitsSection />
              <JournalSection />
            </div>
          </div>
        </div>
      </DragDropContext>
    </ModernAppLayout>;
};
export default Dashboard;