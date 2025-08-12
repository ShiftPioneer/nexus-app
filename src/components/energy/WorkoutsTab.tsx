import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { UnifiedActionButton } from "@/components/ui/unified-action-button";
import { Plus, Dumbbell, Clock, Flame, Target, Calendar, TrendingUp, Award, Activity, Play, CheckCircle, Edit, Trash2, Star, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { WorkoutDialog } from './WorkoutDialog';
import { ExerciseLibrary } from './ExerciseLibrary';
import { useToast } from "@/hooks/use-toast";
export const WorkoutsTab = () => {
  const [activeView, setActiveView] = useState("myWorkouts");
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
  const [isWorkoutDialogOpen, setIsWorkoutDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "planned" | "completed">("all");
  const {
    toast
  } = useToast();
  const workouts = [{
    id: "1",
    name: "Upper Body Strength",
    date: "2024-12-20",
    duration: 60,
    calories: 350,
    exercises: [{
      name: "Bench Press",
      sets: 4,
      reps: "8-10",
      weight: "80kg"
    }, {
      name: "Pull-ups",
      sets: 4,
      reps: "10",
      weight: "bodyweight"
    }, {
      name: "Shoulder Press",
      sets: 3,
      reps: "10",
      weight: "20kg"
    }],
    status: "completed",
    progress: 100,
    difficulty: "intermediate",
    rating: 4
  }, {
    id: "2",
    name: "Lower Body Focus",
    date: "2024-12-22",
    duration: 55,
    calories: 400,
    exercises: [{
      name: "Squats",
      sets: 4,
      reps: "10",
      weight: "100kg"
    }, {
      name: "Romanian Deadlift",
      sets: 3,
      reps: "12",
      weight: "80kg"
    }, {
      name: "Plank",
      sets: 3,
      reps: "1",
      weight: "60s"
    }],
    status: "planned",
    progress: 0,
    difficulty: "advanced",
    rating: 0
  }, {
    id: "3",
    name: "Cardio HIIT",
    date: "2024-12-21",
    duration: 30,
    calories: 280,
    exercises: [{
      name: "Burpees",
      sets: 4,
      reps: "15",
      weight: "bodyweight"
    }, {
      name: "Mountain Climbers",
      sets: 4,
      reps: "30",
      weight: "bodyweight"
    }, {
      name: "Jump Squats",
      sets: 4,
      reps: "20",
      weight: "bodyweight"
    }],
    status: "completed",
    progress: 100,
    difficulty: "beginner",
    rating: 5
  }];
  const handleStartWorkout = (workoutId: string) => {
    toast({
      title: "Workout Started",
      description: "Your workout session has begun. Good luck!"
    });
    console.log('Starting workout:', workoutId);
  };
  const handleEditWorkout = (workoutId: string) => {
    setIsWorkoutDialogOpen(true);
    console.log('Editing workout:', workoutId);
  };
  const handleDeleteWorkout = (workoutId: string) => {
    toast({
      title: "Workout Deleted",
      description: "The workout has been removed from your plan."
    });
    console.log('Deleting workout:', workoutId);
  };
  const handleCreateWorkout = () => {
    setIsWorkoutDialogOpen(true);
  };
  const WorkoutCard = ({
    workout
  }: {
    workout: typeof workouts[0];
  }) => <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} whileHover={{
    scale: 1.02
  }} transition={{
    duration: 0.2
  }}>
      <Card className="bg-slate-950/90 backdrop-blur-sm border-slate-700/50 hover:border-primary/50 transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${workout.status === "completed" ? "bg-gradient-to-br from-emerald-500 to-green-600" : "bg-gradient-to-br from-primary via-orange-500 to-red-500"}`}>
                {workout.status === "completed" ? <CheckCircle className="h-8 w-8 text-white" /> : <Dumbbell className="h-8 w-8 text-white" />}
              </div>
              <div className="space-y-2">
                <CardTitle className="text-white text-xl font-bold">{workout.name}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {workout.date}
                  </div>
                  {workout.status === "completed" && workout.rating > 0 && <div className="flex items-center gap-1">
                      {Array.from({
                    length: workout.rating
                  }).map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                    </div>}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className={`px-3 py-1 font-medium ${workout.status === "completed" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-primary/20 text-orange-300 border-primary/30"}`}>
                {workout.status === "completed" ? "Completed" : "Planned"}
              </Badge>
              <Badge variant="outline" className="text-slate-400 border-slate-600 capitalize">
                {workout.difficulty}
              </Badge>
            </div>
            
            <div className="flex items-center gap-1">
              <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-800" onClick={() => handleEditWorkout(workout.id)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-slate-400 hover:text-red-400 hover:bg-red-500/10" onClick={() => handleDeleteWorkout(workout.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Workout Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-xl border border-slate-700/30">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">{workout.duration}</span>
                <p className="text-xs text-slate-400">minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-xl border border-slate-700/30">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 flex items-center justify-center">
                <Flame className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">{workout.calories}</span>
                <p className="text-xs text-slate-400">calories</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-xl border border-slate-700/30">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">{workout.exercises.length}</span>
                <p className="text-xs text-slate-400">exercises</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {workout.progress > 0 && <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-medium">Progress</span>
                <span className="text-white font-semibold">{workout.progress}%</span>
              </div>
              <Progress value={workout.progress} className="h-3 bg-slate-800 rounded-full">
                <div className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full transition-all duration-500" style={{
              width: `${workout.progress}%`
            }} />
              </Progress>
            </div>}

          {/* Exercises Preview */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Exercises ({workout.exercises.length})
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600">
              {workout.exercises.map((exercise, index) => <div key={index} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/20">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-orange-500" />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-white">{exercise.name}</span>
                    <div className="text-xs text-slate-400">
                      {exercise.sets} sets × {exercise.reps} reps @ {exercise.weight}
                    </div>
                  </div>
                </div>)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            {workout.status === "planned" ? <UnifiedActionButton onClick={() => handleStartWorkout(workout.id)} icon={Play} variant="primary" className="flex-1">
                Start Workout
              </UnifiedActionButton> : <UnifiedActionButton onClick={() => console.log('View results')} icon={TrendingUp} variant="secondary" className="flex-1">
                View Results
              </UnifiedActionButton>}
          </div>
        </CardContent>
      </Card>
    </motion.div>;
  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = workout.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || workout.status === filterStatus;
    return matchesSearch && matchesFilter;
  });
  const EmptyState = () => <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} className="text-center py-16">
      <Card className="bg-slate-950/90 border-slate-700/50 shadow-xl max-w-lg mx-auto">
        <CardContent className="p-12">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary via-orange-500 to-red-500 flex items-center justify-center mx-auto mb-8 shadow-lg">
            <Dumbbell className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Start Your Fitness Journey</h3>
          <p className="text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
            Create your first workout plan and begin tracking your progress towards your fitness goals.
          </p>
          <UnifiedActionButton onClick={handleCreateWorkout} icon={Plus} variant="primary">
            Create Your First Workout
          </UnifiedActionButton>
        </CardContent>
      </Card>
    </motion.div>;
  return <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-white flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 shadow-lg flex items-center justify-center">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            Workout Management
          </h2>
          <p className="text-slate-400 text-lg">Create, track, and manage your fitness routines</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Badge className="bg-primary/20 text-orange-300 border-primary/30 px-3 py-1">
              {workouts.filter(w => w.status === 'planned').length} Planned
            </Badge>
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-3 py-1">
              {workouts.filter(w => w.status === 'completed').length} Completed
            </Badge>
          </div>
          <UnifiedActionButton onClick={handleCreateWorkout} icon={Plus} variant="primary">
            Create Workout
          </UnifiedActionButton>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="bg-slate-950/80 border border-slate-700/50 p-1 rounded-xl w-fit">
          <TabsTrigger value="myWorkouts" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-orange-500 data-[state=active]:text-white px-8 py-3 rounded-lg font-semibold transition-all mx-[10px]">
            <Dumbbell className="h-5 w-5 mr-2" />
            My Workouts
          </TabsTrigger>
          <TabsTrigger value="library" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-orange-500 data-[state=active]:text-white px-8 py-3 rounded-lg font-semibold transition-all">
            <Activity className="h-5 w-5 mr-2" />
            Exercise Library
          </TabsTrigger>
        </TabsList>

        <TabsContent value="myWorkouts" className="space-y-8 mt-8">
          {/* Search and Filter */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }} className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-950/50 rounded-2xl p-6 border border-slate-700/50">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input placeholder="Search workouts..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400" />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="bg-slate-800/50 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm">
                  <option value="all">All Status</option>
                  <option value="planned">Planned</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-slate-900/60 border-slate-700/50 shadow-lg">
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-orange-500 flex items-center justify-center mx-auto mb-2 shadow-lg">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-xl font-bold text-white mb-1">{workouts.length}</div>
                    <div className="text-xs text-slate-400">Total</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-900/60 border-slate-700/50 shadow-lg">
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-2 shadow-lg">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-xl font-bold text-white mb-1">
                      {workouts.reduce((sum, w) => sum + w.duration, 0)}
                    </div>
                    <div className="text-xs text-slate-400">Minutes</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-900/60 border-slate-700/50 shadow-lg">
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center mx-auto mb-2 shadow-lg">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-xl font-bold text-white mb-1">
                      {workouts.filter(w => w.status === 'completed').length}
                    </div>
                    <div className="text-xs text-slate-400">Completed</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>

          {/* Workouts List */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2
        }} className="space-y-6">
            {filteredWorkouts.length === 0 && searchQuery ? <Card className="bg-slate-950/90 border-slate-700/50 shadow-xl">
                <CardContent className="p-12 text-center">
                  <Search className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No workouts found</h3>
                  <p className="text-slate-400 mb-6">Try adjusting your search terms or filters</p>
                </CardContent>
              </Card> : filteredWorkouts.length === 0 ? <EmptyState /> : filteredWorkouts.map(workout => <WorkoutCard key={workout.id} workout={workout} />)}
          </motion.div>
        </TabsContent>

        <TabsContent value="library" className="mt-8">
          <ExerciseLibrary />
        </TabsContent>
      </Tabs>

      {/* Workout Dialog */}
      <WorkoutDialog open={isWorkoutDialogOpen} onOpenChange={setIsWorkoutDialogOpen} onSave={workout => {
      console.log('Saving workout:', workout);
      toast({
        title: "Workout Created",
        description: "Your new workout has been successfully created."
      });
      setIsWorkoutDialogOpen(false);
    }} />
    </div>;
};