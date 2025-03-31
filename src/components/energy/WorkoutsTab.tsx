
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Workout, Exercise } from "@/types/energy";
import { Plus, Dumbbell, Calendar, Clock, FlameIcon, CheckCircle, ArrowRight } from "lucide-react";
import { WorkoutDialog } from "./WorkoutDialog";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExerciseLibrary } from "./ExerciseLibrary";
import { format } from "date-fns";

const sampleWorkouts: Workout[] = [
  {
    id: "1",
    name: "Upper Body Strength",
    date: new Date("2023-12-20T10:00:00"),
    duration: 60,
    caloriesBurned: 350,
    exercises: [
      {
        id: "e1",
        name: "Bench Press",
        category: "Chest",
        equipment: "Barbell",
        sets: 4,
        reps: 8,
        weight: 80,
        notes: "Focus on controlled descent"
      },
      {
        id: "e2",
        name: "Pull-ups",
        category: "Back",
        sets: 4,
        reps: 10
      },
      {
        id: "e3",
        name: "Shoulder Press",
        category: "Shoulders",
        equipment: "Dumbbells",
        sets: 3,
        reps: 10,
        weight: 20
      }
    ],
    status: "Completed"
  },
  {
    id: "2",
    name: "Lower Body Focus",
    date: new Date("2023-12-22T11:00:00"),
    duration: 55,
    caloriesBurned: 400,
    exercises: [
      {
        id: "e1",
        name: "Squats",
        category: "Legs",
        equipment: "Barbell",
        sets: 4,
        reps: 10,
        weight: 100
      },
      {
        id: "e2",
        name: "Romanian Deadlift",
        category: "Back/Legs",
        equipment: "Barbell",
        sets: 3,
        reps: 12,
        weight: 80
      }
    ],
    status: "Planned"
  }
];

export function WorkoutsTab() {
  const [workouts, setWorkouts] = useState<Workout[]>(sampleWorkouts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list");
  const [activeTab, setActiveTab] = useState<"workouts" | "exercises">("workouts");
  
  const handleAddWorkout = (workout: Workout) => {
    if (currentWorkout) {
      setWorkouts(workouts.map(w => w.id === workout.id ? workout : w));
    } else {
      setWorkouts([...workouts, { ...workout, id: Date.now().toString() }]);
    }
    setDialogOpen(false);
    setCurrentWorkout(null);
  };
  
  const handleEdit = (workout: Workout) => {
    setCurrentWorkout(workout);
    setDialogOpen(true);
  };
  
  const handleDelete = (id: string) => {
    setWorkouts(workouts.filter(workout => workout.id !== id));
  };

  const handleStartWorkout = (workout: Workout) => {
    // In a real app, this would navigate to a workout session screen
    alert(`Starting workout: ${workout.name}`);
  };

  const handleCompleteWorkout = (workout: Workout) => {
    setWorkouts(workouts.map(w => {
      if (w.id === workout.id) {
        return { ...w, status: "Completed" };
      }
      return w;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as "workouts" | "exercises")}
          className="w-full"
        >
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="workouts" className="gap-2">
                <Dumbbell className="h-4 w-4" />
                Workouts
              </TabsTrigger>
              <TabsTrigger value="exercises" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Exercise Library
              </TabsTrigger>
            </TabsList>
            
            {activeTab === "workouts" && (
              <div className="flex gap-2">
                <Button onClick={() => { setCurrentWorkout(null); setDialogOpen(true); }} className="gap-1">
                  <Plus size={18} />
                  Add Workout
                </Button>
              </div>
            )}
          </div>
          
          <TabsContent value="workouts" className="mt-6">
            <div className="space-y-4">
              {workouts.map(workout => (
                <Card key={workout.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-xl">{workout.name}</h3>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {format(workout.date, "PPP")}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {workout.duration} min
                              </div>
                              <div className="flex items-center gap-1">
                                <FlameIcon className="h-4 w-4" />
                                {workout.caloriesBurned} cal
                              </div>
                            </div>
                          </div>
                          <span className={cn(
                            "text-xs px-2 py-1 rounded-md",
                            workout.status === "Completed" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-blue-100 text-blue-800"
                          )}>
                            {workout.status}
                          </span>
                        </div>
                        
                        <div className="mt-4 space-y-3">
                          <h4 className="font-medium text-sm">Exercises:</h4>
                          <div className="space-y-2">
                            {workout.exercises.map((exercise, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <div className="bg-muted rounded-full p-1.5">
                                  <Dumbbell className="h-3 w-3" />
                                </div>
                                <span className="font-medium">{exercise.name}</span>
                                <span className="text-muted-foreground">
                                  {exercise.sets} x {exercise.reps} {exercise.weight ? `@ ${exercise.weight}kg` : ''}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {workout.status === "Planned" ? (
                          <Button variant="default" onClick={() => handleStartWorkout(workout)} className="gap-1">
                            Start Workout
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="outline" disabled>Completed</Button>
                        )}
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => handleEdit(workout)} className="flex-1">
                            Edit
                          </Button>
                          <Button variant="outline" onClick={() => handleDelete(workout.id)} className="flex-1 text-destructive hover:text-destructive">
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {workouts.length === 0 && (
                <div className="text-center py-10 border rounded-lg">
                  <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                  <h3 className="text-lg font-medium">No workouts yet</h3>
                  <p className="text-muted-foreground mb-4">Start by creating your first workout plan</p>
                  <Button onClick={() => { setCurrentWorkout(null); setDialogOpen(true); }}>
                    Add Your First Workout
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="exercises" className="mt-6">
            <ExerciseLibrary />
          </TabsContent>
        </Tabs>
      </div>
      
      <WorkoutDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleAddWorkout}
        workout={currentWorkout}
      />
    </div>
  );
}
