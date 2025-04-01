
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, LineChart, BarChart } from "./EnergyCharts";
import { Dumbbell, Activity, Flame, TrendingUp, Calendar } from "lucide-react";

export function AnalyticsOverview() {
  // Sample data for analytics charts
  const weeklyWorkoutData = [
    { name: "Mon", workouts: 1 },
    { name: "Tue", workouts: 0 },
    { name: "Wed", workouts: 1 },
    { name: "Thu", workouts: 0 },
    { name: "Fri", workouts: 1 },
    { name: "Sat", workouts: 0 },
    { name: "Sun", workouts: 0 },
  ];
  
  const calorieData = [
    { date: "Jan 1", calories: 500 },
    { date: "Jan 2", calories: 420 },
    { date: "Jan 3", calories: 0 },
    { date: "Jan 4", calories: 350 },
    { date: "Jan 5", calories: 0 },
    { date: "Jan 6", calories: 400 },
    { date: "Jan 7", calories: 580 },
  ];
  
  const exerciseData = [
    { name: "Chest", sessions: 4 },
    { name: "Back", sessions: 3 },
    { name: "Legs", sessions: 2 },
    { name: "Shoulders", sessions: 2 },
    { name: "Arms", sessions: 3 },
    { name: "Core", sessions: 4 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Workouts</CardDescription>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="text-primary h-5 w-5" />
              12
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <span className="text-green-600 font-medium">↑ 25%</span> vs last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Workout Minutes</CardDescription>
            <CardTitle className="flex items-center gap-2">
              <Activity className="text-primary h-5 w-5" />
              720
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <span className="text-green-600 font-medium">↑ 12%</span> vs last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Calories Burned</CardDescription>
            <CardTitle className="flex items-center gap-2">
              <Flame className="text-primary h-5 w-5" />
              5,340
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <span className="text-green-600 font-medium">↑ 18%</span> vs last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Days</CardDescription>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="text-primary h-5 w-5" />
              16
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <span className="text-green-600 font-medium">↑ 5%</span> vs last month
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Workout Frequency</CardTitle>
            <CardDescription>Weekly workout distribution</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <BarChart 
              data={weeklyWorkoutData}
              categories={["workouts"]}
              index="name"
              showAnimation={true}
              className="aspect-[3/2] mt-2"
            />
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Calories Burned</CardTitle>
            <CardDescription>Daily calorie expenditure</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <AreaChart 
              data={calorieData}
              categories={["calories"]}
              index="date"
              valueFormatter={(value) => `${value} kcal`}
              showAnimation={true}
              className="aspect-[3/2] mt-2"
            />
          </CardContent>
        </Card>
      </div>
      
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Muscle Group Focus</CardTitle>
          <CardDescription>Number of workouts per muscle group</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <BarChart 
            data={exerciseData}
            categories={["sessions"]}
            index="name"
            showAnimation={true}
            layout="vertical"
            className="aspect-[4/2] mt-2"
          />
        </CardContent>
      </Card>
    </div>
  );
}
