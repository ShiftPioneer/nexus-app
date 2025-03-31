
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Workout, Exercise, ExerciseTemplate, MuscleGroup } from "@/types/energy";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { ExerciseDialog } from "./ExerciseDialog";

interface WorkoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (workout: Workout) => void;
  workout?: Workout | null;
  schedulingMode?: boolean;
}

// Sample exercise templates for demonstration
const exerciseTemplates: ExerciseTemplate[] = [
  { id: "e1", name: "Bench Press", category: "Chest", equipment: "Barbell", description: "Lie on bench, lower bar to chest, press up" },
  { id: "e2", name: "Squats", category: "Legs", equipment: "Barbell", description: "Stand with feet shoulder-width apart, lower body until thighs are parallel to ground" },
  { id: "e3", name: "Pull-ups", category: "Back", equipment: "Pull-up Bar", description: "Hang from bar, pull body up until chin is over bar" },
  { id: "e4", name: "Shoulder Press", category: "Shoulders", equipment: "Dumbbell/Barbell", description: "Press weights from shoulder height overhead" },
  { id: "e5", name: "Deadlift", category: "Back/Legs", equipment: "Barbell", description: "Bend at hips and knees to lower bar against shins, stand up straight" },
  { id: "e6", name: "Tricep Dips", category: "Arms", equipment: "", description: "Press weights from shoulder height overhead" },
  { id: "e7", name: "Burpees", category: "Full Body", equipment: "", description: "Start standing, drop to push-up, return to standing, jump" },
  { id: "e8", name: "Mountain Climbers", category: "Core", equipment: "", description: "Start in plank position, alternate bringing knees to chest" },
  { id: "e9", name: "Jump Squats", category: "Legs", equipment: "", description: "Regular squat with an explosive jump at the top" },
];

export function WorkoutDialog({ open, onOpenChange, onSave, workout = null, schedulingMode = false }: WorkoutDialogProps) {
  const [name, setName] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [duration, setDuration] = useState('30');
  const [calories, setCalories] = useState('0');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [notes, setNotes] = useState('');
  const [markCompleted, setMarkCompleted] = useState(false);
  
  const [exerciseDialogOpen, setExerciseDialogOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  
  useEffect(() => {
    if (workout) {
      setName(workout.name);
      setDate(workout.date);
      setDuration(workout.duration.toString());
      setCalories(workout.caloriesBurned.toString());
      setExercises([...workout.exercises]);
      setNotes(workout.notes || '');
      setMarkCompleted(workout.status === "Completed");
    } else {
      setName(schedulingMode ? '' : 'New Workout');
      setDate(new Date());
      setDuration('30');
      setCalories('0');
      setExercises([]);
      setNotes('');
      setMarkCompleted(!schedulingMode);
    }
  }, [workout, open, schedulingMode]);

  const handleSave = () => {
    const newWorkout: Workout = {
      id: workout?.id || '',
      name,
      date,
      duration: parseInt(duration) || 0,
      caloriesBurned: parseInt(calories) || 0,
      exercises,
      notes,
      status: markCompleted ? "Completed" : "Planned"
    };
    onSave(newWorkout);
  };
  
  const handleAddExercise = () => {
    setSelectedExercise(null);
    setExerciseDialogOpen(true);
  };
  
  const handleEditExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setExerciseDialogOpen(true);
  };
  
  const handleRemoveExercise = (id: string) => {
    setExercises(exercises.filter(e => e.id !== id));
  };
  
  const handleSaveExercise = (exercise: Exercise) => {
    if (selectedExercise) {
      setExercises(exercises.map(e => e.id === exercise.id ? exercise : e));
    } else {
      setExercises([...exercises, { ...exercise, id: Date.now().toString() }]);
    }
    setExerciseDialogOpen(false);
    setSelectedExercise(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{schedulingMode ? 'Schedule Workout' : workout ? 'Edit Workout' : 'New Workout'}</DialogTitle>
            <DialogDescription>
              {schedulingMode 
                ? 'Schedule a new workout plan or log a completed workout' 
                : 'Create a new workout plan or log a completed workout'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">Workout Name</label>
              <Input
                id="name"
                placeholder="e.g., Upper Body Strength"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="duration" className="text-sm font-medium">Duration (minutes)</label>
                <Input
                  id="duration"
                  type="number"
                  min="0"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="calories" className="text-sm font-medium">Calories Burned</label>
              <Input
                id="calories"
                type="number"
                min="0"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Exercises</label>
                <Button variant="outline" size="sm" onClick={handleAddExercise} className="h-8">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Exercise
                </Button>
              </div>
              
              {exercises.length === 0 ? (
                <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center">
                  <p className="text-sm text-muted-foreground mb-2">No exercises added yet</p>
                  <Button size="sm" onClick={handleAddExercise}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Exercise
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {exercises.map((exercise) => (
                    <div key={exercise.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{exercise.name}</p>
                          <span className="text-xs text-muted-foreground">{exercise.category}</span>
                        </div>
                        <div className="space-x-1">
                          <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => handleEditExercise(exercise)}>
                            Edit
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 px-2 text-destructive" onClick={() => handleRemoveExercise(exercise.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm mt-1">
                        {exercise.weight ? (
                          <span>{exercise.sets} × {exercise.reps} @ {exercise.weight}kg</span>
                        ) : (
                          <span>{exercise.sets} × {exercise.reps}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="notes" className="text-sm font-medium">Notes</label>
              <Textarea
                id="notes"
                placeholder="Any additional notes about this workout"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            
            {!schedulingMode && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="completed"
                  checked={markCompleted}
                  onCheckedChange={(checked) => setMarkCompleted(checked as boolean)}
                />
                <label
                  htmlFor="completed"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Mark as completed
                </label>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {schedulingMode ? 'Create Workout' : workout ? 'Update Workout' : 'Create Workout'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <ExerciseDialog
        open={exerciseDialogOpen}
        onOpenChange={setExerciseDialogOpen}
        onSave={handleSaveExercise}
        exercise={selectedExercise}
        exerciseTemplates={exerciseTemplates}
      />
    </>
  );
}
