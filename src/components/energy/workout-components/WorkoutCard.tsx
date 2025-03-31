
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Clock, FlameIcon, Calendar, ArrowRight } from "lucide-react";
import { Workout } from "@/types/energy";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface WorkoutCardProps {
  workout: Workout;
  onEdit: (workout: Workout) => void;
  onDelete: (id: string) => void;
  onStart: (workout: Workout) => void;
}

export function WorkoutCard({ workout, onEdit, onDelete, onStart }: WorkoutCardProps) {
  return (
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
              <Button variant="default" onClick={() => onStart(workout)} className="gap-1">
                Start Workout
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="outline" disabled>Completed</Button>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onEdit(workout)} className="flex-1">
                Edit
              </Button>
              <Button variant="outline" onClick={() => onDelete(workout.id)} className="flex-1 text-destructive hover:text-destructive">
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
