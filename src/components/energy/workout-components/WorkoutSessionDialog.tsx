
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Dialog, DialogContent, DialogFooter, DialogHeader, 
  DialogTitle, DialogDescription 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { WorkoutSession } from "@/types/energy";

interface WorkoutSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: WorkoutSession | null;
  onComplete: (session: WorkoutSession) => void;
  onToggleExerciseComplete: (exerciseId: string) => void;
  onToggleSetComplete: (exerciseId: string, setIndex: number) => void;
  onUpdateSet: (
    exerciseId: string, 
    setIndex: number, 
    field: 'reps' | 'weight' | 'duration' | 'distance', 
    value: number
  ) => void;
}

export function WorkoutSessionDialog({
  open,
  onOpenChange,
  session,
  onComplete,
  onToggleExerciseComplete,
  onToggleSetComplete,
  onUpdateSet
}: WorkoutSessionDialogProps) {
  if (!session) return null;
  
  return (
    <Dialog open={open} onOpenChange={(open) => !session.inProgress && onOpenChange(open)}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {session.workout.name} - Workout in Progress
          </DialogTitle>
          <DialogDescription>
            Complete your exercises and track your progress
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {session.exercises.map((exercise, idx) => (
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
                      onCheckedChange={() => onToggleExerciseComplete(exercise.id)}
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
                            checked={set.completed}
                            onCheckedChange={() => onToggleSetComplete(exercise.id, setIdx)}
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
                              onChange={(e) => onUpdateSet(
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
                              onChange={(e) => onUpdateSet(
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
                              onChange={(e) => onUpdateSet(
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
                              onChange={(e) => onUpdateSet(
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
            onClick={() => onComplete(session)}
            disabled={!session.exercises.some(e => e.completed)}
          >
            Complete Workout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
