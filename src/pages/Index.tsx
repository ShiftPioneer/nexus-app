
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext } from "react-beautiful-dnd";
import { useAuth } from "@/contexts/AuthContext";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { Button } from "@/components/ui/button";
import { UnifiedPageHeader } from "@/components/ui/unified-page-header";
import { navigationIcons } from "@/lib/navigation-icons";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import StatsSection from "@/components/dashboard/StatsSection";
import TasksSection from "@/components/dashboard/TasksSection";
import HabitsSection from "@/components/dashboard/HabitsSection";
import GoalSection from "@/components/dashboard/GoalSection";
import JournalSection from "@/components/dashboard/JournalSection";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const handleDragEnd = (result: any) => {
    console.log("Drag ended:", result);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Authentication Required</h2>
          <p className="text-muted-foreground">Please sign in to access your dashboard</p>
          <Button onClick={() => navigate("/auth")}>Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <ModernAppLayout>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="animate-fade-in space-y-6 bg-slate-900 min-h-full">
          
          
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
