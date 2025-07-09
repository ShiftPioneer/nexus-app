
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Calendar,
  Activity,
  Award,
  Plus,
  ChevronRight
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart } from "recharts";
import { motion } from "framer-motion";

const AnalyticsTab = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  // Sample data for charts
  const workoutProgressData = [
    { name: 'Mon', workouts: 2, calories: 350, duration: 45 },
    { name: 'Tue', workouts: 1, calories: 200, duration: 30 },
    { name: 'Wed', workouts: 3, calories: 500, duration: 60 },
    { name: 'Thu', workouts: 2, calories: 380, duration: 50 },
    { name: 'Fri', workouts: 1, calories: 180, duration: 25 },
    { name: 'Sat', workouts: 2, calories: 420, duration: 55 },
    { name: 'Sun', workouts: 1, calories: 250, duration: 35 }
  ];

  const strengthProgressData = [
    { exercise: 'Bench Press', current: 185, target: 200, improvement: 15 },
    { exercise: 'Squat', current: 225, target: 250, improvement: 25 },
    { exercise: 'Deadlift', current: 275, target: 300, improvement: 25 },
    { exercise: 'Pull-ups', current: 12, target: 15, improvement: 3 }
  ];

  const workoutTypeData = [
    { name: 'Strength', value: 45, color: '#FF6500' },
    { name: 'Cardio', value: 30, color: '#024CAA' },
    { name: 'Flexibility', value: 15, color: '#0B192C' },
    { name: 'Sports', value: 10, color: '#D1D5DB' }
  ];

  const monthlyTrendsData = [
    { month: 'Jan', workouts: 18, avgDuration: 42, calories: 5400 },
    { month: 'Feb', workouts: 22, avgDuration: 45, calories: 6600 },
    { month: 'Mar', workouts: 25, avgDuration: 48, calories: 7500 },
    { month: 'Apr', workouts: 28, avgDuration: 50, calories: 8400 },
    { month: 'May', workouts: 30, avgDuration: 52, calories: 9000 },
    { month: 'Jun', workouts: 32, avgDuration: 55, calories: 9600 }
  ];

  const statCards = [
    { 
      label: "Total Workouts", 
      value: "156", 
      change: "+12%", 
      icon: Activity, 
      color: "text-blue-400",
      trend: "up"
    },
    { 
      label: "Avg Duration", 
      value: "52min", 
      change: "+8min", 
      icon: BarChart3, 
      color: "text-green-400",
      trend: "up"
    },
    { 
      label: "Calories Burned", 
      value: "45.2k", 
      change: "+2.1k", 
      icon: TrendingUp, 
      color: "text-orange-400",
      trend: "up"
    },
    { 
      label: "Streak Record", 
      value: "21 days", 
      change: "Personal best", 
      icon: Award, 
      color: "text-purple-400",
      trend: "up"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Performance Analytics</h2>
            <p className="text-slate-400">Track your progress and insights</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {["week", "month", "year"].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className={selectedPeriod === period 
                ? "bg-primary text-white" 
                : "border-slate-600 text-slate-300 hover:bg-slate-700"
              }
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-slate-800/50 flex items-center justify-center`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <Badge className={`${
                    stat.trend === 'up' 
                      ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                      : 'bg-red-500/20 text-red-300 border-red-500/30'
                  } text-xs`}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.change}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Workout Progress */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-400" />
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={workoutProgressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="calories" 
                    stroke="#FF6500" 
                    fill="url(#colorCalories)" 
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6500" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FF6500" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Workout Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-green-400" />
                Workout Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={workoutTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {workoutTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-4">
                {workoutTypeData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-slate-300">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Strength Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-400" />
                Strength Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {strengthProgressData.map((exercise, index) => (
                  <div key={exercise.exercise} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{exercise.exercise}</span>
                      <span className="text-slate-400">{exercise.current}/{exercise.target}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(exercise.current / exercise.target) * 100}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                      />
                    </div>
                    <div className="text-xs text-slate-500">
                      +{exercise.improvement} improvement
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-cyan-400" />
                Monthly Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="workouts" 
                    stroke="#024CAA" 
                    strokeWidth={3}
                    dot={{ fill: '#024CAA', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#024CAA', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Goals & Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-400" />
                Goals & Achievements
              </CardTitle>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Set Goal
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Weekly Workout Goal", current: 5, target: 6, unit: "workouts" },
                { title: "Monthly Calories", current: 8400, target: 10000, unit: "cal" },
                { title: "Strength Milestone", current: 185, target: 200, unit: "lbs" }
              ].map((goal, index) => (
                <div key={goal.title} className="p-4 bg-slate-800/30 rounded-lg border border-slate-600/30">
                  <h4 className="font-medium text-white mb-2">{goal.title}</h4>
                  <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                    <span>{goal.current} / {goal.target} {goal.unit}</span>
                    <span>{Math.round((goal.current / goal.target) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(goal.current / goal.target) * 100}%` }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AnalyticsTab;
