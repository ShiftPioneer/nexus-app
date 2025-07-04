
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { UnifiedActionButton } from "@/components/ui/unified-action-button";
import { 
  Dumbbell, 
  Target, 
  TrendingUp, 
  Clock, 
  Calendar,
  Plus,
  Activity,
  Flame,
  Trophy,
  Zap
} from "lucide-react";

export const DashboardTab = () => {
  const [todayStats] = useState({
    workoutsCompleted: 1,
    totalWorkouts: 2,
    caloriesBurned: 320,
    activeMinutes: 45,
    currentStreak: 5
  });

  const [weeklyGoals] = useState([
    { name: "Workout Sessions", current: 3, target: 5, unit: "sessions" },
    { name: "Active Minutes", current: 180, target: 300, unit: "minutes" },
    { name: "Calories Burned", current: 1240, target: 2000, unit: "cal" }
  ]);

  const [recentWorkouts] = useState([
    { name: "Push Day", duration: 45, date: "Today", calories: 320 },
    { name: "Cardio HIIT", duration: 30, date: "Yesterday", calories: 280 },
    { name: "Pull Day", duration: 50, date: "2 days ago", calories: 350 }
  ]);

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{todayStats.workoutsCompleted}/{todayStats.totalWorkouts}</p>
              <p className="text-sm text-slate-400">Workouts Today</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 shadow-lg">
              <Flame className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{todayStats.caloriesBurned}</p>
              <p className="text-sm text-slate-400">Calories Burned</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{todayStats.activeMinutes}</p>
              <p className="text-sm text-slate-400">Active Minutes</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{todayStats.currentStreak}</p>
              <p className="text-sm text-slate-400">Day Streak</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Goals */}
        <Card className="lg:col-span-2 bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Target className="h-5 w-5 text-primary" />
              Weekly Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {weeklyGoals.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">{goal.name}</span>
                  <Badge variant="outline" className="border-slate-600 text-slate-300">
                    {goal.current}/{goal.target} {goal.unit}
                  </Badge>
                </div>
                <Progress 
                  value={(goal.current / goal.target) * 100} 
                  className="h-2 bg-slate-800"
                />
                <div className="flex justify-between text-sm text-slate-400">
                  <span>{Math.round((goal.current / goal.target) * 100)}% complete</span>
                  <span>{goal.target - goal.current} {goal.unit} remaining</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Zap className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <UnifiedActionButton
              onClick={() => {}}
              icon={Plus}
              variant="primary"
              className="w-full justify-center"
            >
              Start Workout
            </UnifiedActionButton>
            
            <UnifiedActionButton
              onClick={() => {}}
              icon={Activity}
              variant="secondary"
              className="w-full justify-center"
            >
              Log Activity
            </UnifiedActionButton>
            
            <UnifiedActionButton
              onClick={() => {}}
              icon={Calendar}
              variant="secondary"
              className="w-full justify-center"
            >
              Schedule Session
            </UnifiedActionButton>
          </CardContent>
        </Card>
      </div>

      {/* Recent Workouts */}
      <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="h-5 w-5 text-primary" />
              Recent Workouts
            </CardTitle>
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentWorkouts.map((workout, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-primary/20 to-orange-500/20">
                    <Dumbbell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{workout.name}</p>
                    <p className="text-sm text-slate-400">{workout.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{workout.duration} min</p>
                  <p className="text-xs text-slate-400">{workout.calories} cal</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
