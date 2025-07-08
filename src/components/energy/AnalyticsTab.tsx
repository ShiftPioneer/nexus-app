
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Target, 
  Zap, 
  Calendar,
  Trophy,
  Activity,
  BarChart3,
  Clock,
  Flame,
  Award
} from "lucide-react";
import { motion } from "framer-motion";
import { AnalyticsOverview } from './analytics-components/AnalyticsOverview';

export const AnalyticsTab = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  // Mock data for analytics
  const workoutStats = {
    totalWorkouts: 12,
    totalDuration: 720, // minutes
    avgDuration: 60,
    caloriesBurned: 3200,
    personalBests: 5,
    currentStreak: 8
  };

  const weeklyProgress = [
    { day: "Mon", duration: 60, calories: 450, completed: true },
    { day: "Tue", duration: 45, calories: 350, completed: true },
    { day: "Wed", duration: 0, calories: 0, completed: false },
    { day: "Thu", duration: 75, calories: 520, completed: true },
    { day: "Fri", duration: 50, calories: 380, completed: true },
    { day: "Sat", duration: 90, calories: 650, completed: true },
    { day: "Sun", duration: 0, calories: 0, completed: false }
  ];

  const muscleGroups = [
    { name: "Chest", sessions: 3, progress: 75 },
    { name: "Back", sessions: 4, progress: 85 },
    { name: "Legs", sessions: 2, progress: 60 },
    { name: "Arms", sessions: 5, progress: 90 },
    { name: "Core", sessions: 3, progress: 70 },
    { name: "Shoulders", sessions: 2, progress: 55 }
  ];

  const performanceInsights = [
    {
      title: "Strength Gains",
      description: "Your upper body strength has improved by 15% this month. Great progress on bench press and pull-ups!",
      icon: TrendingUp,
      color: "from-green-500/10 to-emerald-500/10",
      borderColor: "border-green-500/20",
      iconColor: "text-green-400"
    },
    {
      title: "Energy Levels",
      description: "Your energy peaks on Tuesdays and Thursdays. Consider scheduling intense workouts on these days.",
      icon: Zap,
      color: "from-blue-500/10 to-cyan-500/10",
      borderColor: "border-blue-500/20",
      iconColor: "text-blue-400"
    },
    {
      title: "Consistency",
      description: "You've maintained a 80% workout consistency this month. Try to reach 85% for optimal results.",
      icon: Trophy,
      color: "from-purple-500/10 to-indigo-500/10",
      borderColor: "border-purple-500/20",
      iconColor: "text-purple-400"
    },
    {
      title: "Focus Areas",
      description: "Consider increasing leg training frequency. Your lower body could benefit from more attention.",
      icon: Target,
      color: "from-red-500/10 to-orange-500/10",
      borderColor: "border-red-500/20",
      iconColor: "text-red-400"
    }
  ];

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    trend, 
    color = "primary" 
  }: {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ElementType;
    trend?: number;
    color?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${
              color === "red" ? "from-red-500/20 to-orange-500/20" :
              color === "green" ? "from-green-500/20 to-emerald-500/20" :
              color === "blue" ? "from-blue-500/20 to-cyan-500/20" :
              color === "purple" ? "from-purple-500/20 to-indigo-500/20" :
              "from-primary/20 to-orange-500/20"
            }`}>
              <Icon className={`h-6 w-6 ${
                color === "red" ? "text-red-400" :
                color === "green" ? "text-green-400" :
                color === "blue" ? "text-blue-400" :
                color === "purple" ? "text-purple-400" :
                "text-primary"
              }`} />
            </div>
            {trend && (
              <Badge className={`${trend > 0 ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
                <TrendingUp className="h-3 w-3 mr-1" />
                {trend > 0 ? "+" : ""}{trend}%
              </Badge>
            )}
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-white text-2xl">{value}</h3>
            <p className="text-slate-400 text-sm">{title}</p>
            <p className="text-slate-500 text-xs">{subtitle}</p>
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
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-white">Energy Analytics</h2>
        </div>
        
        <div className="flex gap-2">
          {["week", "month", "year"].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className={`${
                selectedPeriod === period
                  ? "bg-primary text-white"
                  : "bg-slate-800/50 text-slate-300 border-slate-700 hover:bg-slate-700"
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Workouts"
          value={workoutStats.totalWorkouts.toString()}
          subtitle="This week"
          icon={Activity}
          trend={15}
          color="red"
        />
        <StatCard
          title="Calories Burned"
          value={workoutStats.caloriesBurned.toLocaleString()}
          subtitle="This week"
          icon={Flame}
          trend={8}
          color="red"
        />
        <StatCard
          title="Current Streak"
          value={`${workoutStats.currentStreak} days`}
          subtitle="Keep it up!"
          icon={Trophy}
          trend={12}
          color="green"
        />
        <StatCard
          title="Personal Bests"
          value={workoutStats.personalBests.toString()}
          subtitle="This month"
          icon={Award}
          trend={25}
          color="purple"
        />
      </div>

      {/* Analytics Overview with Charts */}
      <AnalyticsOverview />

      {/* Weekly Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {weeklyProgress.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      day.completed ? "bg-green-500" : "bg-slate-600"
                    }`} />
                    <span className="text-white font-medium">{day.day}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span className="text-slate-400">{day.duration}m</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Flame className="h-3 w-3 text-red-400" />
                      <span className="text-red-400">{day.calories} cal</span>
                    </div>
                  </div>
                </div>
                <Progress 
                  value={day.completed ? 100 : 0} 
                  className="h-2"
                />
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Muscle Groups */}
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Muscle Groups
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {muscleGroups.map((group, index) => (
              <motion.div
                key={group.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white font-medium">{group.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{group.sessions} sessions</span>
                    <span className="text-primary font-medium">{group.progress}%</span>
                  </div>
                </div>
                <Progress 
                  value={group.progress} 
                  className="h-2"
                />
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Performance Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {performanceInsights.map((insight, index) => (
                <motion.div
                  key={insight.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`p-4 bg-gradient-to-r ${insight.color} border ${insight.borderColor} rounded-lg`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <insight.icon className={`h-4 w-4 ${insight.iconColor}`} />
                    <span className={`${insight.iconColor} font-medium`}>{insight.title}</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    {insight.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
