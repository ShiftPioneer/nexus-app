
import React, { useState } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent } from "@/components/ui/modern-tabs";
import { UnifiedPageHeader } from "@/components/ui/unified-page-header";
import { Calendar, Clock, BarChart3, Settings, Zap } from "lucide-react";
import TimeDesignCalendar from "@/components/timedesign/TimeDesignCalendar";
import TimeDesignActivities from "@/components/timedesign/TimeDesignActivities";
import TimeDesignAnalytics from "@/components/timedesign/TimeDesignAnalytics";
import TimeDesignSettings from "@/components/timedesign/TimeDesignSettings";

const TimeDesign = () => {
  const [activeTab, setActiveTab] = useState("calendar");

  // Placeholder data and handlers
  const [activities] = useState([]);
  const [currentDate] = useState(new Date());
  const [viewType] = useState<"day" | "week">("week");

  const handleEditActivity = (activity: any) => {
    console.log('Edit activity:', activity);
  };

  const handleCreateActivity = (data: any) => {
    console.log('Create activity:', data);
  };

  const handleDeleteActivity = (id: string) => {
    console.log('Delete activity:', id);
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
        <UnifiedPageHeader
          title="Time Design"
          description="Design your perfect day and optimize your time allocation"
          icon={Clock}
          gradient="from-blue-500 via-indigo-500 to-purple-500"
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
          
          <ModernTabsContent value="calendar">
            <TimeDesignCalendar 
              currentDate={currentDate}
              viewType={viewType}
              activities={activities}
              onEditActivity={handleEditActivity}
              onCreateActivity={handleCreateActivity}
            />
          </ModernTabsContent>
          
          <ModernTabsContent value="activities">
            <TimeDesignActivities 
              activities={activities}
              onEditActivity={handleEditActivity}
              onDeleteActivity={handleDeleteActivity}
            />
          </ModernTabsContent>
          
          <ModernTabsContent value="analytics">
            <TimeDesignAnalytics activities={activities} />
          </ModernTabsContent>
          
          <ModernTabsContent value="settings">
            <TimeDesignSettings />
          </ModernTabsContent>
        </ModernTabs>
      </div>
    </ModernAppLayout>
  );
};

export default TimeDesign;
