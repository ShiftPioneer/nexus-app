
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
  Pause,
  CheckCircle,
  Edit,
  Trash2
} from "lucide-react";
import { motion } from "framer-motion";
import WorkoutDialog from './WorkoutDialog';
import ExerciseLibrary from './ExerciseLibrary';

export const WorkoutsTab = () => {
  const [activeView, setActiveView] = useState("myWorkouts");
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
  const [isWorkoutDialogOpen, setIsWorkoutDialogOpen] = useState(false);

  // Mock workout data
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
      date: "December 22nd, 2023",
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
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-all duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                workout.status === "completed" 
                  ? "bg-green-500/20 text-green-400" 
                  : "bg-blue-500/20 text-blue-400"
              }`}>
                {workout.status === "completed" ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <Dumbbell className="h-5 w-5" />
                )}
              </div>
              <div>
                <CardTitle className="text-white text-lg">{workout.name}</CardTitle>
                <p className="text-sm text-slate-400">{workout.date}</p>
              </div>
            </div>
            <Badge className={`${
              workout.status === "completed"
                ? "bg-green-500/20 text-green-300 border-green-500/30"
                : "bg-blue-500/20 text-blue-300 border-blue-500/30"
            }`}>
              {workout.status === "completed" ? "Completed" : "Planned"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Workout Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-300">{workout.duration} min</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-400" />
              <span className="text-sm text-slate-300">{workout.calories} cal</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Progress</span>
              <span className="text-slate-300">{workout.progress}%</span>
            </div>
            <Progress value={workout.progress} className="h-2" />
          </div>

          {/* Exercises Preview */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-300">Exercises:</h4>
            <div className="space-y-1">
              {workout.exercises.map((exercise, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm text-slate-400">
                    {exercise.name}: {exercise.sets} × {exercise.reps} @ {exercise.weight}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {workout.status === "planned" ? (
              <Button
                size="sm"
                className="flex-1 bg-primary hover:bg-primary/90 text-white"
                onClick={() => setSelectedWorkout(workout.id)}
              >
                <Play className="h-4 w-4 mr-2" />
                Start Workout
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                View Results
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
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
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            Workout Management
          </h2>
          <p className="text-slate-400 mt-1">Create, track, and manage your fitness routines</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
            1 Planned
          </Badge>
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
            1 Completed
          </Badge>
          <Button
            onClick={() => setIsWorkoutDialogOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Workout
          </Button>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="bg-slate-900/50 border border-slate-700">
          <TabsTrigger 
            value="myWorkouts"
            className="data-[state=active]:bg-slate-800 data-[state=active]:text-white"
          >
            <Dumbbell className="h-4 w-4 mr-2" />
            My Workouts
          </TabsTrigger>
          <TabsTrigger 
            value="library"
            className="data-[state=active]:bg-slate-800 data-[state=active]:text-white"
          >
            <Activity className="h-4 w-4 mr-2" />
            Exercise Library
          </TabsTrigger>
        </TabsList>

        <TabsContent value="myWorkouts" className="space-y-6">
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mx-auto mb-2">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="text-xl font-bold text-white">12</div>
                <div className="text-sm text-slate-400">This Month</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mx-auto mb-2">
                  <Clock className="h-5 w-5 text-blue-400" />
                </div>
                <div className="text-xl font-bold text-white">720</div>
                <div className="text-sm text-slate-400">Total Minutes</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center mx-auto mb-2">
                  <Flame className="h-5 w-5 text-orange-400" />
                </div>
                <div className="text-xl font-bold text-white">5.2k</div>
                <div className="text-sm text-slate-400">Calories Burned</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mx-auto mb-2">
                  <Award className="h-5 w-5 text-green-400" />
                </div>
                <div className="text-xl font-bold text-white">8</div>
                <div className="text-sm text-slate-400">Active Days</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Workouts List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {workouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="library">
          <ExerciseLibrary />
        </TabsContent>
      </Tabs>

      {/* Workout Dialog */}
      <WorkoutDialog
        isOpen={isWorkoutDialogOpen}
        onClose={() => setIsWorkoutDialogOpen(false)}
      />
    </div>
  );
};
