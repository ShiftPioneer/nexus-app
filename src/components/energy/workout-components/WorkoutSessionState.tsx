
import { useState } from "react";
import { Workout, WorkoutSession, Exercise, ExerciseTrackingItem } from "@/types/energy";
import { useToast } from "@/hooks/use-toast";

export function useWorkoutSessionState() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
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

  return {
    workouts,
    setWorkouts,
    dialogOpen,
    setDialogOpen,
    currentWorkout,
    setCurrentWorkout,
    sessionDialogOpen,
    setSessionDialogOpen,
    currentSession,
    setCurrentSession,
    handleAddWorkout,
    handleEdit,
    handleDelete,
    handleStartWorkout,
    handleCompleteWorkout,
    handleToggleExerciseComplete,
    handleUpdateSet,
    handleToggleSetComplete
  };
}
