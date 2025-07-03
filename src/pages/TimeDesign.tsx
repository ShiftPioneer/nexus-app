import React, { useState } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent } from "@/components/ui/modern-tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, BarChart3, Settings } from "lucide-react";
import { format, addDays, addWeeks, startOfWeek, endOfWeek } from "date-fns";
import TimeDesignCalendar from "@/components/timedesign/TimeDesignCalendar";
import TimeDesignAnalytics from "@/components/timedesign/TimeDesignAnalytics";
import TimeDesignActivities from "@/components/timedesign/TimeDesignActivities";
import TimeDesignSettings from "@/components/timedesign/TimeDesignSettings";
import ActivityDialog from "@/components/timedesign/ActivityDialog";
import { DragDropContext } from "react-beautiful-dnd";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/hooks/use-toast";

const TimeDesign = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<"day" | "week">("week");
  const [activeTab, setActiveTab] = useState("calendar");
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [editingActivity, setEditingActivity] = useState<TimeActivity | null>(null);
  const { toast } = useToast();

  const [activities, setActivities] = useLocalStorage<TimeActivity[]>("timeDesignActivities", []);

  const tabItems = [
    { 
      value: "calendar", 
      label: "Calendar", 
      icon: Calendar,
      gradient: "from-blue-500 via-indigo-500 to-purple-500"
    },
    { 
      value: "analytics", 
      label: "Analytics", 
      icon: BarChart3,
      gradient: "from-emerald-500 via-teal-500 to-cyan-500"
    },
    { 
      value: "activities", 
      label: "Activities", 
      icon: Clock,
      gradient: "from-orange-500 via-red-500 to-pink-500"
    },
    { 
      value: "settings", 
      label: "Settings", 
      icon: Settings,
      gradient: "from-purple-500 via-pink-500 to-rose-500"
    }
  ];

  const handlePrevious = () => {
    if (viewType === "day") {
      setCurrentDate(addDays(currentDate, -1));
    } else {
      setCurrentDate(addWeeks(currentDate, -1));
    }
  };

  const handleNext = () => {
    if (viewType === "day") {
      setCurrentDate(addDays(currentDate, 1));
    } else {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleAddActivity = () => {
    setEditingActivity(null);
    setShowActivityDialog(true);
  };

  const handleCreateActivityFromCalendar = (data: { startDate: Date; endDate: Date; startTime: string; endTime: string; }) => {
    setEditingActivity({
        id: '',
        title: '',
        description: '',
        category: 'work',
        color: 'purple',
        syncWithGoogleCalendar: false,
        ...data,
    });
    setShowActivityDialog(true);
  };

  const handleSaveActivity = (activity: TimeActivity) => {
    if (activity.id && activities.find(a => a.id === activity.id)) {
      setActivities(activities.map(a => a.id === activity.id ? activity : a));
      toast({
        title: "Activity Updated",
        description: "Your activity has been updated successfully!"
      });
    } else {
      const newActivity = {
        ...activity,
        id: activity.id || `activity-${Date.now()}`
      };
      setActivities([...activities, newActivity]);
      toast({
        title: "Activity Created",
        description: "Your new activity has been added to the calendar!"
      });
    }
    setShowActivityDialog(false);
    setEditingActivity(null);
  };

  const handleEditActivity = (activity: TimeActivity) => {
    setEditingActivity(activity);
    setShowActivityDialog(true);
  };

  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter(a => a.id !== id));
    toast({
      title: "Activity Deleted",
      description: "The activity has been removed from your calendar."
    });
  };

  const handleDragEnd = (result: any) => {
    console.log("Drag ended:", result);
  };

  return (
    <ModernAppLayout>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="space-y-6 max-w-full overflow-hidden animate-fade-in">
          {/* Unified Page Header and Button */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                Time Design
              </h1>
              <p className="text-slate-400 mt-3 text-lg">Plan your day and visualize how you spend your time effectively</p>
            </div>
            <Button 
              onClick={handleAddActivity} 
              className="w-full md:w-auto gap-2 bg-gradient-to-r from-primary via-orange-500 to-red-500 hover:from-primary/90 hover:via-orange-500/90 hover:to-red-500/90 text-white shadow-xl shadow-primary/25 border-none rounded-xl px-6 py-3 font-semibold transition-all duration-300 hover:scale-105"
            >
              <Plus size={20} />
              New Activity
            </Button>
          </div>
          
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
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-primary" />
                  <h2 className="text-xl font-semibold text-white">
                    {viewType === "day" ? format(currentDate, "MMMM d, yyyy") : `${format(startOfWeek(currentDate), "MMMM d")} - ${format(endOfWeek(currentDate), "MMMM d, yyyy")}`}
                  </h2>
                </div>
                
                <div className="flex items-center gap-3 flex-wrap justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handlePrevious} 
                    className="border-slate-600/50 hover:bg-slate-700/30 hover:border-slate-500/50 text-slate-300 hover:text-white rounded-xl"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleToday} 
                    className="border-slate-600/50 hover:bg-slate-700/30 hover:border-slate-500/50 text-slate-300 hover:text-white rounded-xl"
                  >
                    Today
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleNext} 
                    className="border-slate-600/50 hover:bg-slate-700/30 hover:border-slate-500/50 text-slate-300 hover:text-white rounded-xl"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  
                  <div className="bg-slate-900/50 rounded-xl p-1.5 ml-2 border border-slate-700/30 backdrop-blur-sm">
                    <Button 
                      variant={viewType === "day" ? "default" : "ghost"} 
                      size="sm" 
                      onClick={() => setViewType("day")} 
                      className={viewType === "day" ? "bg-primary hover:bg-primary/90 text-white rounded-lg" : "hover:bg-slate-700/30 text-slate-300 hover:text-white rounded-lg"}
                    >
                      Day
                    </Button>
                    <Button 
                      variant={viewType === "week" ? "default" : "ghost"} 
                      size="sm" 
                      onClick={() => setViewType("week")} 
                      className={viewType === "week" ? "bg-primary hover:bg-primary/90 text-white rounded-lg" : "hover:bg-slate-700/30 text-slate-300 hover:text-white rounded-lg"}
                    >
                      Week
                    </Button>
                  </div>
                </div>
              </div>
              
              <Card className="overflow-hidden bg-slate-950/90 border-slate-700/30 shadow-2xl backdrop-blur-sm">
                <CardContent className="p-0">
                  <TimeDesignCalendar 
                    currentDate={currentDate} 
                    viewType={viewType} 
                    activities={activities} 
                    onEditActivity={handleEditActivity} 
                    onCreateActivity={handleCreateActivityFromCalendar}
                  />
                </CardContent>
              </Card>
            </ModernTabsContent>
            
            <ModernTabsContent value="analytics">
              <TimeDesignAnalytics activities={activities} />
            </ModernTabsContent>
            
            <ModernTabsContent value="activities">
              <TimeDesignActivities 
                activities={activities} 
                onEditActivity={handleEditActivity} 
                onDeleteActivity={handleDeleteActivity} 
              />
            </ModernTabsContent>
            
            <ModernTabsContent value="settings">
              <TimeDesignSettings />
            </ModernTabsContent>
          </ModernTabs>
        </div>
        
        <ActivityDialog 
          open={showActivityDialog} 
          onOpenChange={setShowActivityDialog} 
          activity={editingActivity} 
          onSave={handleSaveActivity} 
        />
      </DragDropContext>
    </ModernAppLayout>
  );
};

export default TimeDesign;
