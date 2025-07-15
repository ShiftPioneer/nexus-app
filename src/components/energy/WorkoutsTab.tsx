
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Dumbbell, 
  Clock, 
  Flame, 
  Target, 
  Calendar,
  TrendingUp,
  Award,
  Activity,
  Play,
  CheckCircle,
  Edit,
  Trash2,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { WorkoutDialog } from './WorkoutDialog';
import { ExerciseLibrary } from './ExerciseLibrary';

export const WorkoutsTab = () => {
  const [activeView, setActiveView] = useState("myWorkouts");
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
  const [isWorkoutDialogOpen, setIsWorkoutDialogOpen] = useState(false);

  const workouts = [
    {
      id: "1",
      name: "Upper Body Strength",
      date: "December 20th, 2023",
      duration: 60,
      calories: 350,
      exercises: [
        { name: "Bench Press", sets: 4, reps: "8-10", weight: "80kg" },
        { name: "Pull-ups", sets: 4, reps: "10", weight: "bodyweight" },
        { name: "Shoulder Press", sets: 3, reps: "10", weight: "20kg" }
      ],
      status: "completed",
      progress: 100
    },
    {
      id: "2", 
      name: "Lower Body Focus",
      date: "December 22nd, 2025",
      duration: 55,
      calories: 400,
      exercises: [
        { name: "Squats", sets: 4, reps: "10", weight: "100kg" },
        { name: "Romanian Deadlift", sets: 3, reps: "12", weight: "80kg" },
        { name: "Plank", sets: 3, reps: "1", weight: "60s" }
      ],
      status: "planned",
      progress: 0
    }
  ];

  const WorkoutCard = ({ workout }: { workout: typeof workouts[0] }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50 hover:border-primary/50 transition-all duration-300 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                workout.status === "completed" 
                  ? "bg-gradient-to-r from-green-500 to-emerald-600" 
                  : "bg-gradient-to-r from-blue-500 to-indigo-600"
              }`}>
                {workout.status === "completed" ? (
                  <CheckCircle className="h-6 w-6 text-white" />
                ) : (
                  <Dumbbell className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <CardTitle className="text-white text-xl font-bold">{workout.name}</CardTitle>
                <p className="text-sm text-slate-400">{workout.date}</p>
              </div>
            </div>
            <Badge className={`px-3 py-1 font-medium ${
              workout.status === "completed"
                ? "bg-green-500/20 text-green-300 border-green-500/30"
                : "bg-blue-500/20 text-blue-300 border-blue-500/30"
            }`}>
              {workout.status === "completed" ? "Completed" : "Planned"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Workout Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Clock className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <span className="text-lg font-semibold text-white">{workout.duration}</span>
                <p className="text-xs text-slate-400">minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Flame className="h-4 w-4 text-orange-400" />
              </div>
              <div>
                <span className="text-lg font-semibold text-white">{workout.calories}</span>
                <p className="text-xs text-slate-400">calories</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400 font-medium">Progress</span>
              <span className="text-white font-semibold">{workout.progress}%</span>
            </div>
            <Progress value={workout.progress} className="h-3 bg-slate-700">
              <div className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-300" />
            </Progress>
          </div>

          {/* Exercises Preview */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Exercises ({workout.exercises.length})
            </h4>
            <div className="space-y-2">
              {workout.exercises.map((exercise, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-slate-800/30 rounded-md">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm text-slate-300 flex-1">
                    <span className="font-medium">{exercise.name}</span>
                    <span className="text-slate-400 ml-2">
                      {exercise.sets} × {exercise.reps} @ {exercise.weight}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            {workout.status === "planned" ? (
              <Button
                size="sm"
                className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg"
                onClick={() => setSelectedWorkout(workout.id)}
              >
                <Play className="h-4 w-4 mr-2" />
                Start Workout
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-primary/50"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                View Results
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-primary/50"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-red-500/50 hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between"
      >
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 shadow-lg flex items-center justify-center">
              <Dumbbell className="h-5 w-5 text-white" />
            </div>
            Workout Management
          </h2>
          <p className="text-slate-400 text-lg">Create, track, and manage your fitness routines</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-3 py-1">
              1 Planned
            </Badge>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-3 py-1">
              1 Completed
            </Badge>
          </div>
          <Button
            onClick={() => setIsWorkoutDialogOpen(true)}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg px-6"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Workout
          </Button>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="bg-slate-900/80 border border-slate-700 p-1 rounded-xl">
          <TabsTrigger 
            value="myWorkouts"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white px-6 py-2 rounded-lg font-medium transition-all"
          >
            <Dumbbell className="h-4 w-4 mr-2" />
            My Workouts
          </TabsTrigger>
          <TabsTrigger 
            value="library"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-white px-6 py-2 rounded-lg font-medium transition-all"
          >
            <Activity className="h-4 w-4 mr-2" />
            Exercise Library
          </TabsTrigger>
        </TabsList>

        <TabsContent value="myWorkouts" className="space-y-8 mt-8">
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            <Card className="bg-slate-900/80 border-slate-700/50 shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">12</div>
                <div className="text-sm text-slate-400">This Month</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/80 border-slate-700/50 shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">720</div>
                <div className="text-sm text-slate-400">Total Minutes</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/80 border-slate-700/50 shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Flame className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">5.2k</div>
                <div className="text-sm text-slate-400">Calories Burned</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/80 border-slate-700/50 shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">8</div>
                <div className="text-sm text-slate-400">Active Days</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Workouts List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {workouts.length === 0 ? (
              <Card className="bg-slate-900/80 border-slate-700/50 shadow-xl">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Dumbbell className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No workouts yet</h3>
                  <p className="text-slate-400 mb-6">Start by creating your first workout plan</p>
                  <Button 
                    onClick={() => setIsWorkoutDialogOpen(true)}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg px-8"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Workout
                  </Button>
                </CardContent>
              </Card>
            ) : (
              workouts.map((workout) => (
                <WorkoutCard key={workout.id} workout={workout} />
              ))
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="library" className="mt-8">
          <ExerciseLibrary />
        </TabsContent>
      </Tabs>

      {/* Workout Dialog */}
      <WorkoutDialog
        open={isWorkoutDialogOpen}
        onOpenChange={setIsWorkoutDialogOpen}
        onSave={(workout) => {
          console.log('Saving workout:', workout);
          setIsWorkoutDialogOpen(false);
        }}
      />
    </div>
  );
};
