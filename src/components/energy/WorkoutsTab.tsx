
import React, { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { WorkoutDialog } from "./WorkoutDialog";
import { ExerciseLibrary } from "./ExerciseLibrary";
import { WorkoutSessionDialog } from "./workout-components/WorkoutSessionDialog";
import { WorkoutTabHeader } from "./workout-components/WorkoutTabHeader";
import { WorkoutList } from "./workout-components/WorkoutList";
import { useWorkoutSessionState } from "./workout-components/WorkoutSessionState";
import { sampleWorkouts } from "./workout-components/sampleWorkouts";

export function WorkoutsTab() {
  const [activeTab, setActiveTab] = useState<"workouts" | "exercises">("workouts");
  const {
    workouts,
    setWorkouts,
    dialogOpen,
    setDialogOpen,
    currentWorkout,
    setCurrentWorkout,
    sessionDialogOpen,
    setSessionDialogOpen,
    currentSession,
    handleAddWorkout,
    handleEdit,
    handleDelete,
    handleStartWorkout,
    handleCompleteWorkout,
    handleToggleExerciseComplete,
    handleUpdateSet,
    handleToggleSetComplete
  } = useWorkoutSessionState();
  
  // Initialize with sample workouts if none exist
  React.useEffect(() => {
    if (workouts.length === 0) {
      setWorkouts(sampleWorkouts);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as "workouts" | "exercises")}
          className="w-full"
        >
          <WorkoutTabHeader 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onAddWorkout={() => { setCurrentWorkout(null); setDialogOpen(true); }}
          />
          
          <TabsContent value="workouts" className="mt-6">
            <WorkoutList 
              workouts={workouts}
              onAddWorkout={() => { setCurrentWorkout(null); setDialogOpen(true); }}
              onEditWorkout={handleEdit}
              onDeleteWorkout={handleDelete}
              onStartWorkout={handleStartWorkout}
            />
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
