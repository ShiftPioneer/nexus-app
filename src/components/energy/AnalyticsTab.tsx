
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart, PieChart, Pie, Cell } from "recharts";
import { PersonalBest, BodyMeasurement, WorkoutGoal } from "@/types/energy";
import { Button } from "@/components/ui/button";
import { Upload, Plus, Target, Award, Ruler } from "lucide-react";

const workoutData = [
  { month: 'Jan', workouts: 8, calories: 2800 },
  { month: 'Feb', workouts: 12, calories: 3600 },
  { month: 'Mar', workouts: 9, calories: 3100 },
  { month: 'Apr', workouts: 15, calories: 4200 },
  { month: 'May', workouts: 18, calories: 5000 },
  { month: 'Jun', workouts: 14, calories: 4100 },
];

const muscleGroupData = [
  { name: "Chest", value: 25, color: "#FF5722" },
  { name: "Back", value: 20, color: "#4CAF50" },
  { name: "Legs", value: 15, color: "#2196F3" },
  { name: "Shoulders", value: 15, color: "#9C27B0" },
  { name: "Arms", value: 15, color: "#FFC107" },
  { name: "Core", value: 10, color: "#795548" }
];

const progressData = [
  { month: 'Jan', weight: 85, bodyFat: 22 },
  { month: 'Feb', weight: 84, bodyFat: 21 },
  { month: 'Mar', weight: 83, bodyFat: 20 },
  { month: 'Apr', weight: 82.5, bodyFat: 19 },
  { month: 'May', weight: 81, bodyFat: 18 },
  { month: 'Jun', weight: 80, bodyFat: 17 },
];

const samplePersonalBests: PersonalBest[] = [
  {
    id: "1",
    exerciseName: "Bench Press",
    value: 100,
    unit: "kg",
    date: new Date("2023-06-15"),
    notes: "Finally hit 100kg!"
  },
  {
    id: "2",
    exerciseName: "Deadlift",
    value: 150,
    unit: "kg",
    date: new Date("2023-06-01")
  },
  {
    id: "3",
    exerciseName: "Pull-ups",
    value: 15,
    unit: "reps",
    date: new Date("2023-05-20")
  }
];

const sampleMeasurements: BodyMeasurement[] = [
  {
    id: "1",
    date: new Date("2023-06-01"),
    weight: 80,
    bodyFat: 17,
    chest: 105,
    waist: 85,
    hips: 95,
    arms: 38,
    thighs: 60
  }
];

const sampleGoals: WorkoutGoal[] = [
  {
    id: "1",
    title: "Lose 10kg",
    description: "Get to target weight of 75kg",
    targetDate: new Date("2023-10-01"),
    progress: 50,
    type: "Weight Loss"
  },
  {
    id: "2",
    title: "Bench Press 120kg",
    description: "Increase bench press strength",
    targetDate: new Date("2023-12-15"),
    progress: 70,
    type: "Strength"
  }
];

export function AnalyticsTab() {
  const [activeTab, setActiveTab] = useState<string>("overview");

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="body-metrics">Body Metrics</TabsTrigger>
          <TabsTrigger value="personal-bests">Personal Bests</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold text-xl mb-4">Workout Frequency</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={workoutData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="workouts" fill="#8884d8" name="Workouts" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold text-xl mb-4">Calories Burned</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={workoutData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="calories" fill="#82ca9d" stroke="#82ca9d" name="Calories" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-xl mb-4">Muscles Trained Distribution</h3>
              <div className="flex flex-col md:flex-row items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={muscleGroupData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {muscleGroupData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => {
                      if (typeof value === 'number') {
                        return `${value}%`;
                      }
                      return value;
                    }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="body-metrics" className="mt-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xl">Body Measurements</h3>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-1">
                <Ruler className="h-4 w-4" />
                Log Measurements
              </Button>
              <Button variant="outline" className="gap-1">
                <Upload className="h-4 w-4" />
                Add Progress Photo
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg mb-4">Weight & Body Fat Progress</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#8884d8" name="Weight (kg)" />
                  <Line yAxisId="right" type="monotone" dataKey="bodyFat" stroke="#82ca9d" name="Body Fat (%)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Latest Measurements</h3>
                {sampleMeasurements.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Recorded on {new Date(sampleMeasurements[0].date).toLocaleDateString()}
                    </p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div>
                        <p className="text-sm font-medium">Weight</p>
                        <p className="text-lg">{sampleMeasurements[0].weight} kg</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Body Fat</p>
                        <p className="text-lg">{sampleMeasurements[0].bodyFat}%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Chest</p>
                        <p className="text-lg">{sampleMeasurements[0].chest} cm</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Waist</p>
                        <p className="text-lg">{sampleMeasurements[0].waist} cm</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Arms</p>
                        <p className="text-lg">{sampleMeasurements[0].arms} cm</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Thighs</p>
                        <p className="text-lg">{sampleMeasurements[0].thighs} cm</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-2">No measurements recorded</p>
                    <Button>Log Your First Measurement</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Progress Photos</h3>
                <div className="border rounded-lg border-dashed p-10 flex flex-col items-center justify-center text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground mb-2">Drag and drop or click to upload</p>
                  <Button variant="outline">Upload Photos</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="personal-bests" className="mt-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xl">Personal Bests</h3>
            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              Add Personal Best
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {samplePersonalBests.map(pb => (
              <Card key={pb.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-lg">{pb.exerciseName}</h4>
                      <p className="text-xl font-bold text-primary mt-2">
                        {pb.value} {pb.unit}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(pb.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-primary/10 rounded-full p-2">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  {pb.notes && (
                    <p className="mt-3 text-sm">{pb.notes}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="goals" className="mt-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xl">Fitness Goals</h3>
            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              Add Goal
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleGoals.map(goal => (
              <Card key={goal.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 rounded-full p-3 mt-1">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-bold text-lg">{goal.title}</h4>
                        <span className="text-sm text-muted-foreground">
                          {goal.type}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{goal.description}</p>
                      
                      <div className="mt-4 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{goal.progress}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${goal.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Target: {new Date(goal.targetDate).toLocaleDateString()}
                        </span>
                        <Button variant="link" className="p-0 h-auto" size="sm">
                          Update
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
