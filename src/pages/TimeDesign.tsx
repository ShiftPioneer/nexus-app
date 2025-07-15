
import React, { useState } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent } from "@/components/ui/modern-tabs";
import { Calendar, Activity, BarChart3, Settings, Plus, Play, Clock } from "lucide-react";
import { UnifiedPageHeader } from "@/components/ui/unified-page-header";
import { UnifiedActionButton } from "@/components/ui/unified-action-button";
import TimeDesignCalendar from "@/components/timedesign/TimeDesignCalendar";
import TimeDesignActivities from "@/components/timedesign/TimeDesignActivities";
import TimeDesignAnalytics from "@/components/timedesign/TimeDesignAnalytics";
import TimeDesignSettings from "@/components/timedesign/TimeDesignSettings";
import { WorkoutDialog } from "@/components/energy/WorkoutDialog";
import ActivityDialog from "@/components/timedesign/ActivityDialog";
import { useToast } from "@/hooks/use-toast";

const TimeDesign = () => {
  const [activeTab, setActiveTab] = useState("calendar");
  const [showWorkoutDialog, setShowWorkoutDialog] = useState(false);
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  
  // Time Design state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<"day" | "week">("week");
  const [activities, setActivities] = useState<TimeActivity[]>([]);
  const [editingActivity, setEditingActivity] = useState<TimeActivity | null>(null);
  
  const { toast } = useToast();

  const handleStartWorkout = () => {
    setShowWorkoutDialog(true);
  };

  const handleLogActivity = () => {
    setEditingActivity(null);
    setShowActivityDialog(true);
  };

  const handleScheduleSession = () => {
    setEditingActivity(null);
    setShowScheduleDialog(true);
  };

  const handleWorkoutSave = (workout: any) => {
    console.log('Workout saved:', workout);
    toast({
      title: "Workout Created",
      description: "Your workout has been successfully created and scheduled.",
    });
    setShowWorkoutDialog(false);
  };

  const handleActivitySave = (activity: TimeActivity) => {
    console.log('Activity saved:', activity);
    
    if (editingActivity) {
      // Update existing activity
      setActivities(prev => prev.map(a => a.id === activity.id ? activity : a));
      toast({
        title: "Activity Updated",
        description: "Your activity has been successfully updated.",
      });
    } else {
      // Create new activity
      const newActivity = {
        ...activity,
        id: activity.id || Date.now().toString()
      };
      setActivities(prev => [...prev, newActivity]);
      toast({
        title: "Activity Created",
        description: "Your activity has been successfully created.",
      });
    }
    
    setShowActivityDialog(false);
    setShowScheduleDialog(false);
    setEditingActivity(null);
  };

  const handleEditActivity = (activity: TimeActivity) => {
    setEditingActivity(activity);
    setShowActivityDialog(true);
  };

  const handleDeleteActivity = (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
    toast({
      title: "Activity Deleted",
      description: "Your activity has been successfully deleted.",
    });
  };

  const handleCreateActivity = (data: { startDate: Date; endDate: Date; startTime: string; endTime: string; }) => {
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
      icon: Activity,
      gradient: "from-emerald-500 via-teal-500 to-cyan-500"
    },
    { 
      value: "analytics", 
      label: "Analytics", 
      icon: BarChart3,
      gradient: "from-orange-500 via-red-500 to-pink-500"
    },
    { 
      value: "settings", 
      label: "Settings", 
      icon: Settings,
      gradient: "from-purple-500 via-pink-500 to-rose-500"
    }
  ];

  return (
    <ModernAppLayout>
      <div className="animate-fade-in space-y-8">
        <div className="flex items-center justify-between">
          <UnifiedPageHeader
            title="Time Design"
            description="Design your perfect day and optimize your time allocation"
            icon={Calendar}
            gradient="from-blue-500 via-indigo-500 to-purple-500"
          />
          
          <div className="flex gap-3">
            <UnifiedActionButton
              onClick={handleStartWorkout}
              icon={Play}
              variant="primary"
            >
              Start Workout
            </UnifiedActionButton>
            <UnifiedActionButton
              onClick={handleLogActivity}
              icon={Plus}
              variant="secondary"
            >
              Log Activity
            </UnifiedActionButton>
            <UnifiedActionButton
              onClick={handleScheduleSession}
              icon={Clock}
              variant="secondary"
            >
              Schedule Session
            </UnifiedActionButton>
          </div>
        </div>

        <ModernTabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <ModernTabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
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
            <TimeDesignCalendar 
              currentDate={currentDate}
              viewType={viewType}
              activities={activities}
              onEditActivity={handleEditActivity}
              onCreateActivity={handleCreateActivity}
            />
          </ModernTabsContent>
          
          <ModernTabsContent value="activities" className="mt-8">
            <TimeDesignActivities 
              activities={activities}
              onEditActivity={handleEditActivity}
              onDeleteActivity={handleDeleteActivity}
            />
          </ModernTabsContent>
          
          <ModernTabsContent value="analytics" className="mt-8">
            <TimeDesignAnalytics activities={activities} />
          </ModernTabsContent>
          
          <ModernTabsContent value="settings" className="mt-8">
            <TimeDesignSettings />
          </ModernTabsContent>
        </ModernTabs>

        {/* Workout Dialog */}
        <WorkoutDialog
          open={showWorkoutDialog}
          onOpenChange={setShowWorkoutDialog}
          onSave={handleWorkoutSave}
          schedulingMode={true}
        />

        {/* Activity Dialog */}
        <ActivityDialog
          open={showActivityDialog}
          onOpenChange={setShowActivityDialog}
          activity={editingActivity}
          onSave={handleActivitySave}
        />

        {/* Schedule Session Dialog */}
        <ActivityDialog
          open={showScheduleDialog}
          onOpenChange={setShowScheduleDialog}
          activity={editingActivity}
          onSave={handleActivitySave}
        />
      </div>
    </ModernAppLayout>
  );
};

export default TimeDesign;
