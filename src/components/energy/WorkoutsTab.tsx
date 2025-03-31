
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Workout, Exercise } from "@/types/energy";
import { Dumbbell, Plus, CheckCircle } from "lucide-react";
import { WorkoutDialog } from "./WorkoutDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExerciseLibrary } from "./ExerciseLibrary";
import { useToast } from "@/hooks/use-toast";
import { WorkoutCard } from "./workout-components/WorkoutCard";
import { WorkoutSessionDialog } from "./workout-components/WorkoutSessionDialog";

interface ExerciseSetDetail {
  reps?: number;
  weight?: number;
  duration?: number;
  distance?: number;
  completed: boolean;
}

interface ExerciseTrackingItem extends Exercise {
  completed: boolean;
  setDetails: ExerciseSetDetail[];
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
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStart={handleStartWorkout}
                />
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
      <WorkoutSessionDialog
        open={sessionDialogOpen}
        onOpenChange={setSessionDialogOpen}
        session={currentSession}
        onComplete={handleCompleteWorkout}
        onToggleExerciseComplete={handleToggleExerciseComplete}
        onUpdateSet={handleUpdateSet}
        onToggleSetComplete={handleToggleSetComplete}
      />
    </div>
  );
}
