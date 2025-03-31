
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, Dumbbell, LineChart, Scale, Image } from "lucide-react";
import { BodyMeasurement, PersonalBest, ProgressPhoto, WorkoutGoal } from "@/types/energy";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { AnalyticsOverview } from "./analytics-components/AnalyticsOverview";
import { MeasurementsDialog } from "./analytics-components/MeasurementsDialog";
import { GoalDialog } from "./analytics-components/GoalDialog";
import { PersonalBestDialog } from "./analytics-components/PersonalBestDialog";
import { ProgressPhotoDialog } from "./analytics-components/ProgressPhotoDialog";

export function AnalyticsTab() {
  const [activeTab, setActiveTab] = useState("overview");
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [goals, setGoals] = useState<WorkoutGoal[]>([
    {
      id: "1",
      title: "Increase Bench Press",
      description: "Reach 100kg bench press 1RM",
      targetDate: new Date("2023-12-31"),
      progress: 75,
      type: "Strength"
    }
  ]);
  const [personalBests, setPersonalBests] = useState<PersonalBest[]>([
    {
      id: "1",
      exerciseName: "Deadlift",
      value: 150,
      unit: "kg",
      date: new Date("2023-11-15"),
      notes: "New PR with proper form"
    }
  ]);
  const [progressPhotos, setProgressPhotos] = useState<ProgressPhoto[]>([]);
  
  const [measurementsDialogOpen, setMeasurementsDialogOpen] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState<BodyMeasurement | null>(null);
  
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<WorkoutGoal | null>(null);
  
  const [personalBestDialogOpen, setPersonalBestDialogOpen] = useState(false);
  const [selectedPersonalBest, setSelectedPersonalBest] = useState<PersonalBest | null>(null);
  
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<ProgressPhoto | null>(null);
  
  const { toast } = useToast();
  
  const handleSaveMeasurement = (measurement: BodyMeasurement) => {
    if (selectedMeasurement) {
      setMeasurements(measurements.map(m => m.id === measurement.id ? measurement : m));
      toast({
        title: "Measurement Updated",
        description: `Measurement for ${format(measurement.date, "PPP")} has been updated.`,
      });
    } else {
      setMeasurements([...measurements, measurement]);
      toast({
        title: "Measurement Added",
        description: `New measurement for ${format(measurement.date, "PPP")} has been saved.`,
      });
    }
  };
  
  const handleSaveGoal = (goal: WorkoutGoal) => {
    if (selectedGoal) {
      setGoals(goals.map(g => g.id === goal.id ? goal : g));
      toast({
        title: "Goal Updated",
        description: `Goal "${goal.title}" has been updated.`,
      });
    } else {
      setGoals([...goals, goal]);
      toast({
        title: "Goal Added",
        description: `New goal "${goal.title}" has been created.`,
      });
    }
  };
  
  const handleSavePersonalBest = (pb: PersonalBest) => {
    if (selectedPersonalBest) {
      setPersonalBests(personalBests.map(p => p.id === pb.id ? pb : p));
      toast({
        title: "Personal Best Updated",
        description: `Personal best for ${pb.exerciseName} has been updated.`,
      });
    } else {
      setPersonalBests([...personalBests, pb]);
      toast({
        title: "Personal Best Added",
        description: `New personal best for ${pb.exerciseName} has been recorded.`,
      });
    }
  };
  
  const handleSavePhoto = (photo: ProgressPhoto) => {
    if (selectedPhoto) {
      setProgressPhotos(progressPhotos.map(p => p.id === photo.id ? photo : p));
      toast({
        title: "Photo Updated",
        description: `Progress photo for ${format(photo.date, "PPP")} has been updated.`,
      });
    } else {
      setProgressPhotos([...progressPhotos, photo]);
      toast({
        title: "Photo Added",
        description: `New progress photo for ${format(photo.date, "PPP")} has been saved.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Fitness Analytics</h2>
          <p className="text-muted-foreground">Track and analyze your fitness progress</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => {
              setSelectedMeasurement(null);
              setMeasurementsDialogOpen(true);
            }}
            variant="outline" 
            className="gap-1"
          >
            <Scale className="h-4 w-4" />
            Log Measurements
          </Button>
          
          <Button 
            onClick={() => {
              setSelectedPersonalBest(null);
              setPersonalBestDialogOpen(true);
            }}
            variant="outline" 
            className="gap-1"
          >
            <TrendingUp className="h-4 w-4" />
            Log Personal Best
          </Button>
          
          <Button 
            onClick={() => {
              setSelectedGoal(null);
              setGoalDialogOpen(true);
            }}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Goal
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="records">Records</TabsTrigger>
          <TabsTrigger value="measurements">Measurements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <AnalyticsOverview />
        </TabsContent>
        
        <TabsContent value="goals" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map(goal => (
              <Card key={goal.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      <CardDescription>{goal.type}</CardDescription>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                      {goal.progress}%
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm mb-4">{goal.description}</p>
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Progress</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0 flex justify-between">
                  <div className="text-xs text-muted-foreground">
                    Target: {format(goal.targetDate, "PP")}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSelectedGoal(goal);
                      setGoalDialogOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            <Card className="flex items-center justify-center border-dashed h-[250px] cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => {
                setSelectedGoal(null);
                setGoalDialogOpen(true);
              }}
            >
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="font-medium">Add New Goal</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="records" className="mt-6">
          <div className="flex justify-between mb-6">
            <h3 className="text-xl font-bold">Personal Bests</h3>
            <Button 
              onClick={() => {
                setSelectedPersonalBest(null);
                setPersonalBestDialogOpen(true);
              }}
              variant="outline" 
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Personal Best
            </Button>
          </div>
          
          {personalBests.length === 0 ? (
            <Card className="p-6 text-center">
              <CardContent className="pt-6">
                <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                <h3 className="text-lg font-medium">No personal bests yet</h3>
                <p className="text-muted-foreground mb-4">Start tracking your achievements</p>
                <Button 
                  onClick={() => {
                    setSelectedPersonalBest(null);
                    setPersonalBestDialogOpen(true);
                  }}
                >
                  Record Your First Personal Best
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {personalBests.map(record => (
                <Card key={record.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{record.exerciseName}</CardTitle>
                      <div className="flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary font-bold">
                        {record.value} {record.unit}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-3">
                    {record.notes && <p className="text-sm mb-2">{record.notes}</p>}
                    <p className="text-xs text-muted-foreground">
                      Achieved on {format(record.date, "PP")}
                    </p>
                  </CardContent>
                  
                  <CardFooter className="pt-0">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-auto"
                      onClick={() => {
                        setSelectedPersonalBest(record);
                        setPersonalBestDialogOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          
          <div className="mt-10 flex justify-between mb-6">
            <h3 className="text-xl font-bold">Progress Photos</h3>
            <Button 
              onClick={() => {
                setSelectedPhoto(null);
                setPhotoDialogOpen(true);
              }}
              variant="outline" 
              className="gap-1"
            >
              <Image className="h-4 w-4" />
              Add Photo
            </Button>
          </div>
          
          {progressPhotos.length === 0 ? (
            <Card className="p-6 text-center">
              <CardContent className="pt-6">
                <Image className="mx-auto h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                <h3 className="text-lg font-medium">No progress photos yet</h3>
                <p className="text-muted-foreground mb-4">Visual documentation of your journey</p>
                <Button 
                  onClick={() => {
                    setSelectedPhoto(null);
                    setPhotoDialogOpen(true);
                  }}
                >
                  Add Your First Photo
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {progressPhotos.map(photo => (
                <div 
                  key={photo.id} 
                  className="relative aspect-[3/4] cursor-pointer group"
                  onClick={() => {
                    setSelectedPhoto(photo);
                    setPhotoDialogOpen(true);
                  }}
                >
                  <img 
                    src={photo.imageUrl} 
                    alt={`Progress photo from ${format(photo.date, "PP")}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-b-md">
                    <p className="text-sm font-medium">{format(photo.date, "PP")}</p>
                    {photo.notes && <p className="text-xs truncate">{photo.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="measurements" className="mt-6">
          <div className="flex justify-between mb-6">
            <h3 className="text-xl font-bold">Body Measurements</h3>
            <Button 
              onClick={() => {
                setSelectedMeasurement(null);
                setMeasurementsDialogOpen(true);
              }}
              variant="outline" 
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              Log Measurements
            </Button>
          </div>
          
          {measurements.length === 0 ? (
            <Card className="p-6 text-center">
              <CardContent className="pt-6">
                <Scale className="mx-auto h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                <h3 className="text-lg font-medium">No measurements yet</h3>
                <p className="text-muted-foreground mb-4">Start tracking your physical progress</p>
                <Button 
                  onClick={() => {
                    setSelectedMeasurement(null);
                    setMeasurementsDialogOpen(true);
                  }}
                >
                  Log Your First Measurement
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-4 text-left">Date</th>
                        <th className="py-3 px-4 text-right">Weight (kg)</th>
                        <th className="py-3 px-4 text-right">Body Fat (%)</th>
                        <th className="py-3 px-4 text-right">Chest (cm)</th>
                        <th className="py-3 px-4 text-right">Waist (cm)</th>
                        <th className="py-3 px-4 text-right">Hips (cm)</th>
                        <th className="py-3 px-4 text-right">Arms (cm)</th>
                        <th className="py-3 px-4 text-right">Thighs (cm)</th>
                        <th className="py-3 px-4 text-right"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {measurements
                        .sort((a, b) => b.date.getTime() - a.date.getTime())
                        .map((measurement) => (
                        <tr key={measurement.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">{format(measurement.date, "PP")}</td>
                          <td className="py-3 px-4 text-right">{measurement.weight || "-"}</td>
                          <td className="py-3 px-4 text-right">{measurement.bodyFat || "-"}</td>
                          <td className="py-3 px-4 text-right">{measurement.chest || "-"}</td>
                          <td className="py-3 px-4 text-right">{measurement.waist || "-"}</td>
                          <td className="py-3 px-4 text-right">{measurement.hips || "-"}</td>
                          <td className="py-3 px-4 text-right">{measurement.arms || "-"}</td>
                          <td className="py-3 px-4 text-right">{measurement.thighs || "-"}</td>
                          <td className="py-3 px-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedMeasurement(measurement);
                                setMeasurementsDialogOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Dialogs */}
      <MeasurementsDialog
        open={measurementsDialogOpen}
        onOpenChange={setMeasurementsDialogOpen}
        onSave={handleSaveMeasurement}
        measurement={selectedMeasurement}
      />
      
      <GoalDialog
        open={goalDialogOpen}
        onOpenChange={setGoalDialogOpen}
        onSave={handleSaveGoal}
        goal={selectedGoal}
      />
      
      <PersonalBestDialog
        open={personalBestDialogOpen}
        onOpenChange={setPersonalBestDialogOpen}
        onSave={handleSavePersonalBest}
        personalBest={selectedPersonalBest}
      />
      
      <ProgressPhotoDialog
        open={photoDialogOpen}
        onOpenChange={setPhotoDialogOpen}
        onSave={handleSavePhoto}
        photo={selectedPhoto}
      />
    </div>
  );
}
