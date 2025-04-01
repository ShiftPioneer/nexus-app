
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExerciseTemplate } from "@/types/energy";
import { Dumbbell, PlayCircle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExerciseCardProps {
  exercise: ExerciseTemplate;
  getMuscleGroupColor: (muscleGroup: string) => string;
  view: "grid" | "list";
}

export function ExerciseCard({ exercise, getMuscleGroupColor, view }: ExerciseCardProps) {
  if (view === "grid") {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-lg">{exercise.name}</h3>
            <span className={cn("text-xs px-2 py-1 rounded-md", getMuscleGroupColor(exercise.category))}>
              {exercise.category}
            </span>
          </div>
          
          {exercise.equipment && (
            <p className="text-sm text-muted-foreground mb-3">
              <span className="font-medium">Equipment:</span> {exercise.equipment}
            </p>
          )}
          
          <p className="text-sm mb-4">{exercise.description}</p>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <PlayCircle className="h-4 w-4" />
              Watch Demo
            </Button>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Add to Workout
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-muted rounded-full p-2">
              <Dumbbell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">{exercise.name}</h3>
              <p className="text-sm text-muted-foreground">{exercise.equipment}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={cn("text-xs px-2 py-1 rounded-md", getMuscleGroupColor(exercise.category))}>
              {exercise.category}
            </span>
            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="h-3 w-3" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
