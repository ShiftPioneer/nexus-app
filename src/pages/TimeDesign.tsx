import React, { useState, useEffect } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent } from "@/components/ui/modern-tabs";
import { Calendar, Activity, BarChart3, Settings } from "lucide-react";
import { UnifiedPageHeader } from "@/components/ui/unified-page-header";
import { navigationIcons } from "@/lib/navigation-icons";
import TimeDesignCalendar from "@/components/timedesign/TimeDesignCalendar";
import TimeDesignActivities from "@/components/timedesign/TimeDesignActivities";
import TimeDesignAnalytics from "@/components/timedesign/TimeDesignAnalytics";
import TimeDesignSettings from "@/components/timedesign/TimeDesignSettings";
import ActivityDialog from "@/components/timedesign/ActivityDialog";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseTimeDesignStorage } from "@/hooks/use-supabase-timedesign-storage";
import { useIsMobile } from "@/hooks/use-mobile";

const TimeDesign = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("calendar");
  const [showActivityDialog, setShowActivityDialog] = useState(false);

  // Time Design state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<"day" | "two-day" | "week" | "month">(isMobile ? "day" : "week");
  
  // Update view type when mobile status changes
  useEffect(() => {
    if (isMobile) {
      setViewType("day");
    }
  }, [isMobile]);
  const {
    activities,
    loading,
    saveActivity,
    deleteActivity,
    refetch
  } = useSupabaseTimeDesignStorage();
  const [editingActivity, setEditingActivity] = useState<TimeActivity | null>(null);
  const {
    toast
  } = useToast();
  const handleActivitySave = async (activity: TimeActivity) => {
    console.log('Activity saved:', activity);
    try {
      const savedActivity = await saveActivity(activity);
      if (savedActivity) {
        toast({
          title: editingActivity?.id ? "Activity Updated" : "Activity Created",
          description: `Your activity has been successfully ${editingActivity?.id ? 'updated' : 'created'}.`
        });
        setShowActivityDialog(false);
        setEditingActivity(null);
      }
    } catch (error) {
      console.error('Error saving activity:', error);
    }
  };
  const handleEditActivity = (activity: TimeActivity) => {
    setEditingActivity(activity);
    setShowActivityDialog(true);
  };
  const handleDeleteActivity = async (id: string) => {
    try {
      const success = await deleteActivity(id);
      if (success) {
        toast({
          title: "Activity Deleted",
          description: "Your activity has been successfully deleted."
        });
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };
  const handleCreateActivity = (data: {
    startDate: Date;
    endDate: Date;
    startTime: string;
    endTime: string;
  }) => {
    const newActivity: TimeActivity = {
      id: "",
      title: "",
      description: "",
      category: "work",
      color: "purple",
      ...data,
      syncWithGoogleCalendar: false
    };
    setEditingActivity(newActivity);
    setShowActivityDialog(true);
  };
  const tabItems = [{
    value: "calendar",
    label: "Calendar",
    icon: Calendar,
    gradient: "from-blue-500 via-indigo-500 to-purple-500"
  }, {
    value: "activities",
    label: "Activities",
    icon: Activity,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500"
  }, {
    value: "analytics",
    label: "Analytics",
    icon: BarChart3,
    gradient: "from-orange-500 via-red-500 to-pink-500"
  }, {
    value: "settings",
    label: "Settings",
    icon: Settings,
    gradient: "from-purple-500 via-pink-500 to-rose-500"
  }];
  return <ModernAppLayout>
      <div className="page-container">
        <div className="page-content px-[20px]">
          <UnifiedPageHeader title="Time Design" description="Design your perfect day and optimize your time allocation" icon={navigationIcons.timeDesign} gradient="from-blue-500 via-indigo-500 to-purple-500" />

        <ModernTabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <ModernTabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            {tabItems.map(tab => <ModernTabsTrigger key={tab.value} value={tab.value} gradient={tab.gradient} icon={tab.icon} className="flex-1">
                {tab.label}
              </ModernTabsTrigger>)}
          </ModernTabsList>
          
          <ModernTabsContent value="calendar" className="mt-8">
            <TimeDesignCalendar currentDate={currentDate} viewType={viewType} onViewTypeChange={setViewType} activities={activities} onEditActivity={handleEditActivity} onCreateActivity={handleCreateActivity} />
          </ModernTabsContent>
          
          <ModernTabsContent value="activities" className="mt-8">
            <TimeDesignActivities activities={activities} onEditActivity={handleEditActivity} onDeleteActivity={handleDeleteActivity} />
          </ModernTabsContent>
          
          <ModernTabsContent value="analytics" className="mt-8">
            <TimeDesignAnalytics activities={activities} />
          </ModernTabsContent>
          
          <ModernTabsContent value="settings" className="mt-8">
            <TimeDesignSettings onImportEvents={() => {
              // Refetch activities after importing from Google Calendar
              refetch();
            }} />
          </ModernTabsContent>
        </ModernTabs>

        {/* Activity Dialog */}
        <ActivityDialog open={showActivityDialog} onOpenChange={setShowActivityDialog} activity={editingActivity} onSave={handleActivitySave} onDelete={handleDeleteActivity} />
        </div>
      </div>
    </ModernAppLayout>;
};
export default TimeDesign;