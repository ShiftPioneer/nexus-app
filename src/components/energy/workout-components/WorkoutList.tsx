
import React from "react";
import { Button } from "@/components/ui/button";
import { Workout } from "@/types/energy";
import { Dumbbell, Plus } from "lucide-react";
import { WorkoutCard } from "./WorkoutCard";

interface WorkoutListProps {
  workouts: Workout[];
  onAddWorkout: () => void;
  onEditWorkout: (workout: Workout) => void;
  onDeleteWorkout: (id: string) => void;
  onStartWorkout: (workout: Workout) => void;
}

export function WorkoutList({
  workouts,
  onAddWorkout,
  onEditWorkout,
  onDeleteWorkout,
  onStartWorkout,
}: WorkoutListProps) {
  return (
    <div className="space-y-4">
      {workouts.map((workout) => (
        <WorkoutCard
          key={workout.id}
          workout={workout}
          onEdit={onEditWorkout}
          onDelete={onDeleteWorkout}
          onStart={onStartWorkout}
        />
      ))}

      {workouts.length === 0 && (
        <div className="text-center py-10 border rounded-lg">
          <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground mb-3 opacity-50" />
          <h3 className="text-lg font-medium">No workouts yet</h3>
          <p className="text-muted-foreground mb-4">
            Start by creating your first workout plan
          </p>
          <Button onClick={onAddWorkout}>Add Your First Workout</Button>
        </div>
      )}
    </div>
  );
}
