
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Edit, Trash2, PlusCircle } from "lucide-react";
import { Workout, Exercise } from "@/types/energy";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { WorkoutDialog } from "./WorkoutDialog";

const sampleWorkouts: Workout[] = [
  {
    id: "1",
    name: "HIIT Cardio",
    date: new Date("2023-12-17"),
    duration: 30,
    caloriesBurned: 380,
    exercises: [
      { id: "11", name: "Burpees", category: "Full Body", sets: 3, reps: 15, notes: "" },
      { id: "12", name: "Mountain Climbers", category: "Core", sets: 3, reps: 30, notes: "" },
      { id: "13", name: "Jump Squats", category: "Legs", sets: 3, reps: 20, notes: "" }
    ],
    status: "Completed"
  },
  {
    id: "2",
    name: "Full Body Strength",
    date: new Date("2023-12-15"),
    duration: 60,
    caloriesBurned: 450,
    exercises: [
      { id: "21", name: "Bench Press", category: "Chest", sets: 3, reps: 10, weight: 65, notes: "" },
      { id: "22", name: "Squats", category: "Legs", sets: 4, reps: 12, weight: 95, notes: "" },
      { id: "23", name: "Pull-ups", category: "Back", sets: 3, reps: 8, notes: "" }
    ],
    status: "Completed"
  },
  {
    id: "3",
    name: "Upper Body Focus",
    date: new Date("2023-12-20"),
    duration: 45,
    caloriesBurned: 320,
    exercises: [
      { id: "31", name: "Shoulder Press", category: "Shoulders", sets: 3, reps: 12, weight: 40, notes: "" },
      { id: "32", name: "Tricep Dips", category: "Arms", sets: 3, reps: 15, notes: "" },
      { id: "33", name: "Lat Pulldown", category: "Back", sets: 3, reps: 10, weight: 55, notes: "" }
    ],
    status: "Planned"
  }
];

export function WorkoutsTab() {
  const [workouts, setWorkouts] = useState<Workout[]>(sampleWorkouts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  
  const plannedWorkouts = workouts.filter(w => w.status === "Planned").sort((a, b) => 
    a.date.getTime() - b.date.getTime()
  );
  
  const completedWorkouts = workouts.filter(w => w.status === "Completed").sort((a, b) => 
    b.date.getTime() - a.date.getTime()
  );
  
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
    setWorkouts(workouts.filter(w => w.id !== id));
  };

  const handleComplete = (id: string) => {
    setWorkouts(workouts.map(w => 
      w.id === id ? { ...w, status: "Completed" } : w
    ));
  };

  const renderExercisesList = (exercises: Exercise[]) => {
    return (
      <div className="mt-4">
        <p className="text-xs text-muted-foreground uppercase font-medium">Exercises</p>
        {exercises.map((exercise) => (
          <div key={exercise.id} className="mt-2 border-t pt-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">{exercise.name}</span>
              {exercise.weight ? (
                <span className="text-sm text-muted-foreground">
                  {exercise.sets} × {exercise.reps} @ {exercise.weight}kg
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">
                  {exercise.sets} × {exercise.reps}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Workouts</h2>
        <Button onClick={() => { setCurrentWorkout(null); setDialogOpen(true); }} className="gap-1">
          <PlusCircle size={18} />
          New Workout
        </Button>
      </div>
      
      {/* Planned Workouts */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Planned Workouts</h3>
        {plannedWorkouts.length > 0 ? (
          <div className="space-y-4">
            {plannedWorkouts.map((workout) => (
              <Card key={workout.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-bold">{workout.name}</h4>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">Planned</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(workout.date, "MMMM d, yyyy")}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm">{workout.duration} min</span>
                        <span className="text-sm">{workout.exercises.length} exercises</span>
                        <span className="text-sm">{workout.caloriesBurned} cal</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleComplete(workout.id)}>
                        <Check className="h-4 w-4 mr-1" />
                        Complete
                      </Button>
                      <Button size="icon" variant="outline" onClick={() => handleEdit(workout)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" className="text-destructive" onClick={() => handleDelete(workout.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {renderExercisesList(workout.exercises)}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-muted/50">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">No planned workouts</p>
              <Button variant="outline" size="sm" onClick={() => { setCurrentWorkout(null); setDialogOpen(true); }}>
                <PlusCircle className="h-4 w-4 mr-1" />
                Schedule a workout
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Completed Workouts */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Completed Workouts</h3>
        {completedWorkouts.length > 0 ? (
          <div className="space-y-4">
            {completedWorkouts.map((workout) => (
              <Card key={workout.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-bold">{workout.name}</h4>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">Completed</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(workout.date, "MMMM d, yyyy")}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm">{workout.duration} min</span>
                        <span className="text-sm">{workout.exercises.length} exercises</span>
                        <span className="text-sm">{workout.caloriesBurned} cal</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline" onClick={() => handleEdit(workout)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" className="text-destructive" onClick={() => handleDelete(workout.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {renderExercisesList(workout.exercises)}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-muted/50">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">No completed workouts yet</p>
              <Button variant="outline" size="sm" onClick={() => { setCurrentWorkout(null); setDialogOpen(true); }}>
                <PlusCircle className="h-4 w-4 mr-1" />
                Log a new workout
              </Button>
            </CardContent>
          </Card>
        )}
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
