
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Workout, MuscleGroup } from "@/types/energy";
import { addDays, format, startOfWeek, subDays, subMonths } from "date-fns";

const sampleWorkouts: Workout[] = [
  // Same sample workouts as in other tabs...
  {
    id: "1",
    name: "HIIT Cardio",
    date: new Date("2023-12-17"),
    duration: 30,
    caloriesBurned: 380,
    exercises: [
      { id: "11", name: "Burpees", category: "Full Body", sets: 3, reps: 15, notes: "" },
      { id: "12", name: "Mountain Climbers", category: "Core", sets: 3, reps: 30, notes: "" },
      { id: "13", name: "Jump Squats", category: "Legs", sets: 3, reps: 20, notes: "" }
    ],
    status: "Completed"
  },
  {
    id: "2",
    name: "Full Body Strength",
    date: new Date("2023-12-15"),
    duration: 60,
    caloriesBurned: 450,
    exercises: [
      { id: "21", name: "Bench Press", category: "Chest", sets: 3, reps: 10, weight: 65, notes: "" },
      { id: "22", name: "Squats", category: "Legs", sets: 4, reps: 12, weight: 95, notes: "" },
      { id: "23", name: "Pull-ups", category: "Back", sets: 3, reps: 8, notes: "" }
    ],
    status: "Completed"
  }
];

// Add more historical workout data for analytics
const generateHistoricalData = () => {
  const workouts = [...sampleWorkouts];
  const today = new Date();
  
  // Add historical workouts from the past 2 months
  for (let i = 1; i <= 12; i++) {
    const randomDate = subDays(today, Math.floor(Math.random() * 60) + 1);
    const randomDuration = Math.floor(Math.random() * 45) + 30;
    const randomCalories = randomDuration * (Math.floor(Math.random() * 5) + 7);
    
    workouts.push({
      id: `hist-${i}`,
      name: i % 3 === 0 ? "Cardio Session" : i % 2 === 0 ? "Upper Body Day" : "Leg Day",
      date: randomDate,
      duration: randomDuration,
      caloriesBurned: randomCalories,
      exercises: [],
      status: "Completed"
    });
  }
  
  return workouts;
};

export function AnalyticsTab() {
  const [workouts] = useState<Workout[]>(generateHistoricalData());
  const [timeRange, setTimeRange] = useState<"week" | "month" | "3month" | "year">("month");
  
  // Filter workouts by time range
  const filterWorkoutsByTimeRange = () => {
    const today = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case "week":
        startDate = startOfWeek(today);
        break;
      case "month":
        startDate = subMonths(today, 1);
        break;
      case "3month":
        startDate = subMonths(today, 3);
        break;
      case "year":
        startDate = subMonths(today, 12);
        break;
      default:
        startDate = subMonths(today, 1);
    }
    
    return workouts.filter(w => 
      w.status === "Completed" && w.date >= startDate
    ).sort((a, b) => a.date.getTime() - b.date.getTime());
  };
  
  const filteredWorkouts = filterWorkoutsByTimeRange();
  
  // Prepare data for charts
  const workoutFrequencyData = () => {
    // Group workouts by date and count
    const workoutsByDate = filteredWorkouts.reduce((acc, workout) => {
      const dateKey = format(workout.date, "yyyy-MM-dd");
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: workout.date,
          count: 0,
          calories: 0,
          duration: 0
        };
      }
      acc[dateKey].count += 1;
      acc[dateKey].calories += workout.caloriesBurned;
      acc[dateKey].duration += workout.duration;
      return acc;
    }, {} as Record<string, { date: Date; count: number; calories: number; duration: number }>);
    
    // Convert to array sorted by date
    return Object.values(workoutsByDate).sort((a, b) => a.date.getTime() - b.date.getTime());
  };
  
  const muscleGroupData = () => {
    // Count exercises by muscle group
    const muscleGroups: Record<string, number> = {};
    
    filteredWorkouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        if (!muscleGroups[exercise.category]) {
          muscleGroups[exercise.category] = 0;
        }
        muscleGroups[exercise.category] += 1;
      });
    });
    
    // Convert to array for chart
    return Object.entries(muscleGroups).map(([name, value]) => ({ name, value }));
  };
  
  // Calculate total stats
  const totalWorkouts = filteredWorkouts.length;
  const totalDuration = filteredWorkouts.reduce((sum, w) => sum + w.duration, 0);
  const totalCalories = filteredWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
  const averageDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B'];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Workout Analytics</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Time Range:</span>
          <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
            <TabsList className="h-9">
              <TabsTrigger value="week" className="text-xs">Week</TabsTrigger>
              <TabsTrigger value="month" className="text-xs">Month</TabsTrigger>
              <TabsTrigger value="3month" className="text-xs">3 Months</TabsTrigger>
              <TabsTrigger value="year" className="text-xs">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-muted-foreground">Total Workouts</h4>
            <p className="text-2xl font-bold">{totalWorkouts}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-muted-foreground">Total Duration</h4>
            <p className="text-2xl font-bold">{totalDuration} min</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-muted-foreground">Avg. Duration</h4>
            <p className="text-2xl font-bold">{averageDuration} min</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-muted-foreground">Calories Burned</h4>
            <p className="text-2xl font-bold">{totalCalories}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Workout Activity Over Time */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-6">Workout Activity</h3>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={workoutFrequencyData()}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date"
                  tickFormatter={(date) => format(new Date(date), "MMM d")}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: any) => [`${value}`, '']}
                  labelFormatter={(label) => format(new Date(label), "MMM d, yyyy")}
                />
                <Area 
                  type="monotone" 
                  name="Duration (min)" 
                  dataKey="duration" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.3}
                />
                <Area 
                  type="monotone" 
                  name="Calories" 
                  dataKey="calories" 
                  stroke="#82ca9d" 
                  fill="#82ca9d"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Muscle Groups */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-6">Muscle Groups Targeted</h3>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={muscleGroupData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {muscleGroupData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} exercises`, '']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Workout Consistency */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-6">Workout Frequency</h3>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={workoutFrequencyData()}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="date"
                    tickFormatter={(date) => format(new Date(date), "MMM d")}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: any) => [`${value} workouts`, 'Count']}
                    labelFormatter={(label) => format(new Date(label), "MMM d, yyyy")}
                  />
                  <Bar dataKey="count" name="Workouts" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
