
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Workout, Exercise, ExerciseType } from "@/types/energy";
import { Plus, Dumbbell, Calendar, Clock, FlameIcon, CheckCircle, ArrowRight } from "lucide-react";
import { WorkoutDialog } from "./WorkoutDialog";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExerciseLibrary } from "./ExerciseLibrary";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ExerciseTrackingItem extends Exercise {
  completed: boolean;
  setDetails: ExerciseSetDetail[];
}

interface ExerciseSetDetail {
  reps?: number;
  weight?: number;
  duration?: number;
  distance?: number;
  completed: boolean;
}

interface WorkoutSession {
  workout: Workout;
  exercises: ExerciseTrackingItem[];
  inProgress: boolean;
  startTime?: Date;
  endTime?: Date;
}

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
        exerciseType: "Weight Reps",
        notes: "Focus on controlled descent"
      },
      {
        id: "e2",
        name: "Pull-ups",
        category: "Back",
        exerciseType: "Reps Only",
        sets: 4,
        reps: 10
      },
      {
        id: "e3",
        name: "Shoulder Press",
        category: "Shoulders",
        equipment: "Dumbbells",
        exerciseType: "Weight Reps",
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
        exerciseType: "Weight Reps",
        sets: 4,
        reps: 10,
        weight: 100
      },
      {
        id: "e2",
        name: "Romanian Deadlift",
        category: "Back/Legs",
        equipment: "Barbell",
        exerciseType: "Weight Reps",
        sets: 3,
        reps: 12,
        weight: 80
      },
      {
        id: "e3",
        name: "Plank",
        category: "Core",
        exerciseType: "Duration",
        sets: 3,
        reps: 1,
        duration: 60 // seconds
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
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState<WorkoutSession | null>(null);
  const [completedWorkouts, setCompletedWorkouts] = useState<WorkoutSession[]>([]);
  
  const { toast } = useToast();
  
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
    const exercises = workout.exercises.map(exercise => ({
      ...exercise,
      completed: false,
      setDetails: Array(exercise.sets).fill(null).map(() => ({
        reps: exercise.reps || 0,
        weight: exercise.weight || 0,
        duration: exercise.duration || 0,
        distance: exercise.distance || 0,
        completed: false
      }))
    }));
    
    setCurrentSession({
      workout,
      exercises,
      inProgress: true,
      startTime: new Date()
    });
    
    setSessionDialogOpen(true);
  };

  const handleCompleteWorkout = (session: WorkoutSession) => {
    // Calculate stats
    const duration = ((session.endTime || new Date()).getTime() - (session.startTime || new Date()).getTime()) / 60000; // in minutes
    const completedSets = session.exercises.reduce((count, exercise) => count + (exercise.completed ? exercise.sets : 0), 0);
    
    // Update the original workout
    const updatedWorkouts = workouts.map(w => {
      if (w.id === session.workout.id) {
        return {
          ...w,
          status: "Completed" as const,
          duration: Math.round(duration),
          caloriesBurned: Math.round(duration * 5) // Simple placeholder calculation
        };
      }
      return w;
    });
    
    setWorkouts(updatedWorkouts);
    setCompletedWorkouts([...completedWorkouts, {
      ...session,
      inProgress: false,
      endTime: new Date()
    }]);
    
    toast({
      title: "Workout Completed",
      description: `You've completed ${session.workout.name}! Great job!`,
    });
    
    setSessionDialogOpen(false);
    setCurrentSession(null);
  };
  
  const handleToggleExerciseComplete = (exerciseId: string) => {
    if (!currentSession) return;
    
    setCurrentSession({
      ...currentSession,
      exercises: currentSession.exercises.map(ex => 
        ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
      )
    });
  };
  
  const handleUpdateSet = (exerciseId: string, setIndex: number, field: 'reps' | 'weight' | 'duration' | 'distance', value: number) => {
    if (!currentSession) return;
    
    setCurrentSession({
      ...currentSession,
      exercises: currentSession.exercises.map(ex => {
        if (ex.id === exerciseId) {
          const newSetDetails = [...ex.setDetails];
          newSetDetails[setIndex] = {
            ...newSetDetails[setIndex],
            [field]: value
          };
          return { ...ex, setDetails: newSetDetails };
        }
        return ex;
      })
    });
  };
  
  const handleToggleSetComplete = (exerciseId: string, setIndex: number) => {
    if (!currentSession) return;
    
    setCurrentSession({
      ...currentSession,
      exercises: currentSession.exercises.map(ex => {
        if (ex.id === exerciseId) {
          const newSetDetails = [...ex.setDetails];
          newSetDetails[setIndex] = {
            ...newSetDetails[setIndex],
            completed: !newSetDetails[setIndex].completed
          };
          return { ...ex, setDetails: newSetDetails };
        }
        return ex;
      })
    });
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
                                  {exercise.sets} x {exercise.reps} 
                                  {exercise.exerciseType === 'Weight Reps' && exercise.weight ? ` @ ${exercise.weight}kg` : ''}
                                  {exercise.exerciseType === 'Duration' && exercise.duration ? ` for ${exercise.duration}s` : ''}
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
      
      {/* Workout Dialog */}
      <WorkoutDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleAddWorkout}
        workout={currentWorkout}
      />
      
      {/* Workout Session Dialog */}
      <Dialog open={sessionDialogOpen} onOpenChange={(open) => !currentSession?.inProgress && setSessionDialogOpen(open)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentSession?.workout.name} - Workout in Progress
            </DialogTitle>
            <DialogDescription>
              Complete your exercises and track your progress
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {currentSession?.exercises.map((exercise, idx) => (
              <Card key={idx} className={cn(
                "overflow-hidden transition-colors",
                exercise.completed ? "border-green-500 bg-green-50" : ""
              )}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{exercise.name}</h3>
                      <p className="text-sm text-muted-foreground">{exercise.category}</p>
                      {exercise.exerciseType && (
                        <p className="text-xs text-muted-foreground">Type: {exercise.exerciseType}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={exercise.completed}
                        onCheckedChange={() => handleToggleExerciseComplete(exercise.id)}
                      />
                      <span className="text-sm">
                        {exercise.completed ? "Completed" : "Mark as complete"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium text-sm mb-2">Track Your Sets:</h4>
                    
                    <div className="space-y-2">
                      {exercise.setDetails?.map((set, setIdx) => (
                        <div key={setIdx} className="grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-2 text-sm font-medium flex items-center gap-2">
                            <Switch
                              size="sm"
                              checked={set.completed}
                              onCheckedChange={() => handleToggleSetComplete(exercise.id, setIdx)}
                            />
                            <span>Set {setIdx + 1}</span>
                          </div>
                          
                          {(exercise.exerciseType === 'Weight Reps' || exercise.exerciseType === 'Reps Only' || 
                            exercise.exerciseType === 'Weighted Bodyweight' || exercise.exerciseType === 'Assisted Bodyweight') && (
                            <div className="col-span-3">
                              <Label className="text-xs">Reps</Label>
                              <Input 
                                type="number"
                                value={set.reps}
                                onChange={(e) => handleUpdateSet(
                                  exercise.id, 
                                  setIdx, 
                                  'reps', 
                                  parseInt(e.target.value) || 0
                                )}
                                min={0}
                                className="h-8"
                              />
                            </div>
                          )}
                          
                          {(exercise.exerciseType === 'Weight Reps' || exercise.exerciseType === 'Weighted Bodyweight' || 
                            exercise.exerciseType === 'Weight & Duration') && (
                            <div className="col-span-3">
                              <Label className="text-xs">Weight (kg)</Label>
                              <Input 
                                type="number"
                                value={set.weight}
                                onChange={(e) => handleUpdateSet(
                                  exercise.id, 
                                  setIdx, 
                                  'weight', 
                                  parseFloat(e.target.value) || 0
                                )}
                                min={0}
                                step={1}
                                className="h-8"
                              />
                            </div>
                          )}
                          
                          {(exercise.exerciseType === 'Duration' || exercise.exerciseType === 'Weight & Duration' || 
                            exercise.exerciseType === 'Distance & Duration') && (
                            <div className="col-span-3">
                              <Label className="text-xs">Duration (sec)</Label>
                              <Input 
                                type="number"
                                value={set.duration}
                                onChange={(e) => handleUpdateSet(
                                  exercise.id, 
                                  setIdx, 
                                  'duration', 
                                  parseInt(e.target.value) || 0
                                )}
                                min={0}
                                className="h-8"
                              />
                            </div>
                          )}
                          
                          {exercise.exerciseType === 'Distance & Duration' && (
                            <div className="col-span-3">
                              <Label className="text-xs">Distance (m)</Label>
                              <Input 
                                type="number"
                                value={set.distance}
                                onChange={(e) => handleUpdateSet(
                                  exercise.id, 
                                  setIdx, 
                                  'distance', 
                                  parseInt(e.target.value) || 0
                                )}
                                min={0}
                                className="h-8"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {exercise.notes && (
                      <div className="mt-2 text-sm bg-muted p-2 rounded">
                        <span className="font-medium">Notes:</span> {exercise.notes}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <DialogFooter>
            <Button 
              variant="default" 
              onClick={() => currentSession && handleCompleteWorkout(currentSession)}
              disabled={!currentSession?.exercises.some(e => e.completed)}
            >
              Complete Workout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
