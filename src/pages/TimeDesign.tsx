
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
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

const TimeDesign = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<"day" | "week">("week");
  const [activeTab, setActiveTab] = useState("calendar");
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [editingActivity, setEditingActivity] = useState<TimeActivity | null>(null);
  
  // Mock data - In a real app, this would come from a backend
  const [activities, setActivities] = useState<TimeActivity[]>([
    {
      id: "1",
      title: "Team Meeting",
      description: "Weekly team sync",
      category: "work",
      color: "purple",
      startDate: new Date(),
      endDate: new Date(),
      startTime: "10:00",
      endTime: "11:00",
      syncWithGoogleCalendar: true
    },
    {
      id: "2",
      title: "Lunch with Alex",
      description: "Discuss new project ideas",
      category: "social",
      color: "orange",
      startDate: new Date(),
      endDate: new Date(),
      startTime: "12:30",
      endTime: "13:30"
    },
    {
      id: "3",
      title: "Gym Workout",
      description: "Cardio and strength training",
      category: "health",
      color: "green",
      startDate: new Date(),
      endDate: new Date(),
      startTime: "15:00",
      endTime: "16:00"
    }
  ]);

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
    if (activity.id) {
      // Update existing activity
      setActivities(activities.map(a => a.id === activity.id ? activity : a));
    } else {
      // Add new activity
      const newActivity = {
        ...activity,
        id: `activity-${Date.now()}`
      };
      setActivities([...activities, newActivity]);
    }
    setShowActivityDialog(false);
  };

  const handleEditActivity = (activity: TimeActivity) => {
    setEditingActivity(activity);
    setShowActivityDialog(true);
  };

  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter(a => a.id !== id));
  };
  
  const handleDragEnd = (result: any) => {
    // Handle drag end for activities if needed
    console.log("Drag ended:", result);
    // Implement drag and drop functionality here if required
  };
  
  return (
    <AppLayout>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="space-y-4 max-w-full overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Time Design</h1>
              <p className="text-muted-foreground mt-1">
                Plan your day and visualize how you spend your time
              </p>
            </div>
            <Button onClick={handleAddActivity} className="w-full md:w-auto gap-1">
              <Plus size={18} />
              New Activity
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-background rounded-lg w-full">
            <div className="overflow-x-auto">
              <TabsList className="bg-muted">
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="calendar" className="mt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  <h2 className="text-xl font-semibold">
                    {viewType === "day" 
                      ? format(currentDate, "MMMM d, yyyy") 
                      : `${format(startOfWeek(currentDate), "MMMM d")} - ${format(endOfWeek(currentDate), "MMMM d, yyyy")}`}
                  </h2>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <Button variant="outline" size="sm" onClick={handlePrevious}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleToday}>
                    Today
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleNext}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  
                  <div className="bg-muted rounded-lg p-1 ml-2">
                    <Button
                      variant={viewType === "day" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewType("day")}
                      className="rounded-md"
                    >
                      Day
                    </Button>
                    <Button
                      variant={viewType === "week" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewType("week")}
                      className="rounded-md"
                    >
                      Week
                    </Button>
                  </div>
                </div>
              </div>
              
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <TimeDesignCalendar 
                    currentDate={currentDate} 
                    viewType={viewType} 
                    activities={activities}
                    onEditActivity={handleEditActivity}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-6">
              <TimeDesignAnalytics activities={activities} />
            </TabsContent>
            
            <TabsContent value="activities" className="mt-6">
              <TimeDesignActivities 
                activities={activities} 
                onEditActivity={handleEditActivity}
                onDeleteActivity={handleDeleteActivity}
              />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-6">
              <TimeDesignSettings />
            </TabsContent>
          </Tabs>
        </div>
        
        <ActivityDialog 
          open={showActivityDialog}
          onOpenChange={setShowActivityDialog}
          activity={editingActivity}
          onSave={handleSaveActivity}
        />
      </DragDropContext>
    </AppLayout>
  );
};

export default TimeDesign;
