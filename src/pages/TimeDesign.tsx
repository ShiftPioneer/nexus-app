
import React, { useState } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent } from "@/components/ui/modern-tabs";
import { UnifiedPageHeader } from "@/components/ui/unified-page-header";
import { Calendar, Clock, BarChart3, Settings, Zap, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TimeDesignCalendar from "@/components/timedesign/TimeDesignCalendar";
import TimeDesignActivities from "@/components/timedesign/TimeDesignActivities";
import TimeDesignAnalytics from "@/components/timedesign/TimeDesignAnalytics";
import TimeDesignSettings from "@/components/timedesign/TimeDesignSettings";
import ActivityDialog from "@/components/timedesign/ActivityDialog";

const TimeDesign = () => {
  const [activeTab, setActiveTab] = useState("calendar");
  const [showActivityDialog, setShowActivityDialog] = useState(false);

  // Placeholder data and handlers
  const [activities] = useState([]);
  const [currentDate] = useState(new Date());
  const [viewType] = useState<"day" | "week">("week");

  const handleEditActivity = (activity: any) => {
    console.log('Edit activity:', activity);
    setShowActivityDialog(true);
  };

  const handleCreateActivity = (data: any) => {
    console.log('Create activity:', data);
    setShowActivityDialog(false);
  };

  const handleDeleteActivity = (id: string) => {
    console.log('Delete activity:', id);
  };

  const handleAddNewActivity = () => {
    setShowActivityDialog(true);
  };

  const tabItems = [
    { 
      value: "calendar", 
      label: "Calendar", 
      icon: Calendar,
      gradient: "from-blue-500 via-indigo-500 to-purple-500"
    },
    { 
      value: "activities", 
      label: "Activities", 
      icon: Zap,
      gradient: "from-emerald-500 via-teal-500 to-cyan-500"
    },
    { 
      value: "analytics", 
      label: "Analytics", 
      icon: BarChart3,
      gradient: "from-purple-500 via-pink-500 to-rose-500"
    },
    { 
      value: "settings", 
      label: "Settings", 
      icon: Settings,
      gradient: "from-orange-500 via-red-500 to-pink-500"
    }
  ];

  return (
    <ModernAppLayout>
      <div className="animate-fade-in space-y-8">
        <div className="flex items-center justify-between">
          <UnifiedPageHeader
            title="Time Design"
            description="Design your perfect day and optimize your time allocation"
            icon={Clock}
            gradient="from-blue-500 via-indigo-500 to-purple-500"
          />
          
          <Button 
            onClick={handleAddNewActivity}
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Activity
          </Button>
        </div>

        <ModernTabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <ModernTabsList className="grid w-full grid-cols-4 max-w-3xl mx-auto">
            {tabItems.map((tab) => (
              <ModernTabsTrigger 
                key={tab.value}
                value={tab.value}
                gradient={tab.gradient}
                icon={tab.icon}
                className="flex-1"
              >
                {tab.label}
              </ModernTabsTrigger>
            ))}
          </ModernTabsList>
          
          <ModernTabsContent value="calendar" className="mt-8">
            <div className="max-w-7xl mx-auto">
              <TimeDesignCalendar 
                currentDate={currentDate}
                viewType={viewType}
                activities={activities}
                onEditActivity={handleEditActivity}
                onCreateActivity={handleCreateActivity}
              />
            </div>
          </ModernTabsContent>
          
          <ModernTabsContent value="activities" className="mt-8">
            <div className="max-w-6xl mx-auto">
              <TimeDesignActivities 
                activities={activities}
                onEditActivity={handleEditActivity}
                onDeleteActivity={handleDeleteActivity}
              />
            </div>
          </ModernTabsContent>
          
          <ModernTabsContent value="analytics" className="mt-8">
            <div className="max-w-6xl mx-auto">
              <TimeDesignAnalytics activities={activities} />
            </div>
          </ModernTabsContent>
          
          <ModernTabsContent value="settings" className="mt-8">
            <div className="max-w-4xl mx-auto">
              <TimeDesignSettings />
            </div>
          </ModernTabsContent>
        </ModernTabs>

        <ActivityDialog
          open={showActivityDialog}
          onOpenChange={setShowActivityDialog}
          onSave={handleCreateActivity}
        />
      </div>
    </ModernAppLayout>
  );
};

export default TimeDesign;
