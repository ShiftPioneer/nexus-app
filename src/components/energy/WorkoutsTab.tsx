
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Dumbbell, CheckCircle, TrendingUp, Calendar, Clock, Target } from "lucide-react";
import { WorkoutDialog } from "./WorkoutDialog";
import { ExerciseLibrary } from "./ExerciseLibrary";
import { WorkoutSessionDialog } from "./workout-components/WorkoutSessionDialog";
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

  // Calculate stats
  const totalWorkouts = workouts.length;
  const completedWorkouts = workouts.filter(w => w.status === 'Completed').length;
  const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
  const totalCalories = workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/80 border-slate-700/50">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalWorkouts}</p>
              <p className="text-sm text-slate-400">Total Workouts</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-700/50">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 shadow-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{completedWorkouts}</p>
              <p className="text-sm text-slate-400">Completed</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-700/50">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{Math.round(totalDuration / 60)}h</p>
              <p className="text-sm text-slate-400">Total Time</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-700/50">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 shadow-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalCalories}</p>
              <p className="text-sm text-slate-400">Calories Burned</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="glass rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Workout Management</h2>
              <p className="text-slate-300">Create, track, and manage your fitness routines</p>
            </div>
            
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-300">
                {workouts.filter(w => w.status === 'Planned').length} Planned
              </Badge>
              <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-300">
                {completedWorkouts} Completed
              </Badge>
            </div>
          </div>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as "workouts" | "exercises")}
          className="w-full"
        >
          <div className="px-6 py-4 border-b border-slate-700/50">
            <div className="flex justify-between items-center">
              <TabsList className="bg-slate-800/50 border border-slate-700/50">
                <TabsTrigger
                  value="workouts"
                  className="gap-2 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300"
                >
                  <Dumbbell className="h-4 w-4" />
                  My Workouts
                </TabsTrigger>
                <TabsTrigger
                  value="exercises"
                  className="gap-2 data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300"
                >
                  <CheckCircle className="h-4 w-4" />
                  Exercise Library
                </TabsTrigger>
              </TabsList>

              {activeTab === "workouts" && (
                <Button 
                  onClick={() => { setCurrentWorkout(null); setDialogOpen(true); }}
                  className="bg-primary hover:bg-primary/80 text-white gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Workout
                </Button>
              )}
            </div>
          </div>
          
          <div className="p-6">
            <TabsContent value="workouts" className="mt-0">
              <WorkoutList 
                workouts={workouts}
                onAddWorkout={() => { setCurrentWorkout(null); setDialogOpen(true); }}
                onEditWorkout={handleEdit}
                onDeleteWorkout={handleDelete}
                onStartWorkout={handleStartWorkout}
              />
            </TabsContent>
            
            <TabsContent value="exercises" className="mt-0">
              <ExerciseLibrary />
            </TabsContent>
          </div>
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
