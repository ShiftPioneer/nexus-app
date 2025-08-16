import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { UnifiedActionButton } from "@/components/ui/unified-action-button";
import { 
  Activity, 
  Calendar, 
  Clock, 
  Dumbbell, 
  Flame, 
  Plus, 
  Play, 
  Target, 
  TrendingUp,
  Award,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { WorkoutDialog } from "./WorkoutDialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const DashboardTab = () => {
  const [showWorkoutDialog, setShowWorkoutDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleStartWorkout = () => {
    setShowWorkoutDialog(true);
    toast({
      title: "Starting Workout",
      description: "Let's get energized! Create or select a workout to begin.",
    });
  };

  const handleLogActivity = () => {
    // Navigate to workouts tab
    const energyPageUrl = new URL(window.location.href);
    energyPageUrl.hash = '';
    energyPageUrl.pathname = '/energy';
    const newUrl = energyPageUrl.toString() + '#workouts';
    window.location.href = newUrl;
    
    toast({
      title: "Logging Activity",
      description: "Redirecting to workout management...",
    });
  };

  const handleScheduleSession = () => {
    // Navigate to time design with activity creation
    navigate('/time-design');
    
    // Create a time design activity for workout
    setTimeout(() => {
      const activityData = {
        startDate: new Date(),
        endDate: new Date(),
        startTime: new Date().getHours().toString().padStart(2, '0') + ':00',
        endTime: (new Date().getHours() + 1).toString().padStart(2, '0') + ':00',
        title: 'Workout Session',
        category: 'health' as const,
        description: 'Scheduled workout session'
      };
      
      // Dispatch event to create activity in Time Design
      window.dispatchEvent(new CustomEvent('createTimeDesignActivity', { 
        detail: activityData 
      }));
    }, 100);
    
    toast({
      title: "Schedule Session",
      description: "Redirecting to Time Design to schedule your workout...",
    });
  };

  const handleWorkoutSave = (workout: any) => {
    console.log('Workout saved:', workout);
    toast({
      title: "Workout Created",
      description: "Your workout has been successfully created and scheduled.",
    });
    setShowWorkoutDialog(false);
  };

  const stats = [
    {
      title: "Weekly Goal",
      value: "0/5",
      subtitle: "Workouts completed",
      progress: 0,
      icon: Target,
      gradient: "from-primary to-orange-500"
    },
    {
      title: "Total Workouts",
      value: "0",
      subtitle: "This month",
      icon: Dumbbell,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Active Minutes",
      value: "1,240",
      subtitle: "This week",
      icon: Clock,
      gradient: "from-emerald-500 to-green-600"
    },
    {
      title: "Calories Burned",
      value: "3,420",
      subtitle: "This week",
      icon: Flame,
      gradient: "from-red-500 to-pink-500"
    }
  ];

  const recentWorkouts = [
    {
      id: 1,
      name: "Upper Body Strength",
      date: "Today",
      duration: 45,
      status: "completed",
      calories: 320
    },
    {
      id: 2,
      name: "Cardio HIIT",
      date: "Yesterday",
      duration: 30,
      status: "completed", 
      calories: 280
    },
    {
      id: 3,
      name: "Lower Body Focus",
      date: "Tomorrow",
      duration: 50,
      status: "planned",
      calories: 0
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header with Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between"
      >
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 shadow-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            Energy Dashboard
          </h2>
          <p className="text-slate-400 text-lg">Track your fitness journey and stay motivated</p>
        </div>
        
        <div className="flex gap-3">
          <UnifiedActionButton
            onClick={handleStartWorkout}
            icon={Play}
            variant="primary"
          >
            Start Workout
          </UnifiedActionButton>
          <UnifiedActionButton
            onClick={handleLogActivity}
            icon={Plus}
            variant="secondary"
          >
            Log Activity
          </UnifiedActionButton>
          <UnifiedActionButton
            onClick={handleScheduleSession}
            icon={Calendar}
            variant="secondary"
          >
            Schedule Session
          </UnifiedActionButton>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <Card key={index} className="bg-slate-950/90 border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                {stat.progress && (
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                    {stat.progress}%
                  </Badge>
                )}
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.subtitle}</div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">{stat.title}</div>
                {stat.progress && (
                  <div className="mt-3">
                    <Progress value={stat.progress} className="h-2 bg-slate-800">
                      <div 
                        className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-500`}
                        style={{ width: `${stat.progress}%` }}
                      />
                    </Progress>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Recent Workouts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-slate-950/90 border-slate-700/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
              <Activity className="h-5 w-5 text-primary" />
              Recent Workouts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentWorkouts.map((workout) => (
              <div key={workout.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700/30 hover:bg-slate-900/70 transition-all duration-200">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    workout.status === 'completed' 
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600' 
                      : 'bg-gradient-to-r from-primary to-orange-500'
                  } shadow-lg`}>
                    {workout.status === 'completed' ? (
                      <Award className="h-5 w-5 text-white" />
                    ) : (
                      <Clock className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{workout.name}</h4>
                    <p className="text-sm text-slate-400">{workout.date} • {workout.duration} min</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {workout.calories > 0 && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">{workout.calories} cal</p>
                      <p className="text-xs text-slate-400">burned</p>
                    </div>
                  )}
                  <Badge className={
                    workout.status === 'completed'
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : "bg-primary/20 text-orange-300 border-primary/30"
                  }>
                    {workout.status}
                  </Badge>
                </div>
              </div>
            ))}
            
            <div className="pt-4 text-center">
              <UnifiedActionButton 
                onClick={handleLogActivity}
                icon={TrendingUp}
                variant="secondary"
              >
                View All Workouts
              </UnifiedActionButton>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Workout Dialog */}
      <WorkoutDialog
        open={showWorkoutDialog}
        onOpenChange={setShowWorkoutDialog}
        onSave={handleWorkoutSave}
        schedulingMode={true}
      />
    </div>
  );
};
