import React, { useState } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ChevronLeft, ChevronRight, Plus } from "lucide-react";
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
  const {
    toast
  } = useToast();

  // Store activities in localStorage for persistence
  const [activities, setActivities] = useLocalStorage<TimeActivity[]>("timeDesignActivities", []);
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
  const handleSaveActivity = (activity: TimeActivity) => {
    if (activity.id && activities.find(a => a.id === activity.id)) {
      // Update existing activity
      setActivities(activities.map(a => a.id === activity.id ? activity : a));
      toast({
        title: "Activity Updated",
        description: "Your activity has been updated successfully!"
      });
    } else {
      // Add new activity
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
    // Handle drag end for activities if needed
    console.log("Drag ended:", result);
    // Implement drag and drop functionality here if required
  };
  return <ModernAppLayout>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="space-y-6 max-w-full overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Time Design</h1>
              <p className="text-slate-300 mt-1">
                Plan your day and visualize how you spend your time
              </p>
            </div>
            <Button onClick={handleAddActivity} className="w-full md:w-auto gap-2 bg-primary hover:bg-primary/90">
              <Plus size={18} />
              New Activity
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="overflow-x-auto">
              <TabsList className="border border-slate-700 bg-slate-950">
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="calendar" className="mt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-primary" />
                  <h2 className="text-xl font-semibold text-white">
                    {viewType === "day" ? format(currentDate, "MMMM d, yyyy") : `${format(startOfWeek(currentDate), "MMMM d")} - ${format(endOfWeek(currentDate), "MMMM d, yyyy")}`}
                  </h2>
                </div>
                
                <div className="flex items-center gap-3 flex-wrap justify-end">
                  <Button variant="navigation" size="sm" onClick={handlePrevious}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="navigation" size="sm" onClick={handleToday}>
                    Today
                  </Button>
                  <Button variant="navigation" size="sm" onClick={handleNext}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  
                  <div className="bg-slate-900 rounded-xl p-1.5 ml-2 border border-slate-700">
                    <Button variant={viewType === "day" ? "tab-active" : "ghost"} size="sm" onClick={() => setViewType("day")} className="rounded-lg">
                      Day
                    </Button>
                    <Button variant={viewType === "week" ? "tab-active" : "ghost"} size="sm" onClick={() => setViewType("week")} className="rounded-lg">
                      Week
                    </Button>
                  </div>
                </div>
              </div>
              
              <Card className="overflow-hidden bg-slate-950 border-slate-700">
                <CardContent className="p-0">
                  <TimeDesignCalendar currentDate={currentDate} viewType={viewType} activities={activities} onEditActivity={handleEditActivity} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-6">
              <TimeDesignAnalytics activities={activities} />
            </TabsContent>
            
            <TabsContent value="activities" className="mt-6">
              <TimeDesignActivities activities={activities} onEditActivity={handleEditActivity} onDeleteActivity={handleDeleteActivity} />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-6">
              <TimeDesignSettings />
            </TabsContent>
          </Tabs>
        </div>
        
        <ActivityDialog open={showActivityDialog} onOpenChange={setShowActivityDialog} activity={editingActivity} onSave={handleSaveActivity} />
      </DragDropContext>
    </ModernAppLayout>;
};
export default TimeDesign;