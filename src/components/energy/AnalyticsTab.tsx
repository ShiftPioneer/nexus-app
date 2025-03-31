
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart, PieChart, Pie, Cell } from "recharts";
import { PersonalBest, BodyMeasurement, WorkoutGoal } from "@/types/energy";
import { Button } from "@/components/ui/button";
import { Upload, Plus, Target, Award, Ruler, Camera } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

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

export function AnalyticsTab() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [personalBests, setPersonalBests] = useState<PersonalBest[]>([
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
  ]);
  
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([
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
  ]);
  
  const [goals, setGoals] = useState<WorkoutGoal[]>([
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
  ]);

  // Dialog states
  const [personalBestDialogOpen, setPersonalBestDialogOpen] = useState(false);
  const [measurementDialogOpen, setMeasurementDialogOpen] = useState(false);
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [progressPhotoDialogOpen, setProgressPhotoDialogOpen] = useState(false);
  
  // Form states
  const [newPersonalBest, setNewPersonalBest] = useState<Partial<PersonalBest>>({
    exerciseName: '',
    value: 0,
    unit: 'kg',
    date: new Date(),
    notes: ''
  });
  
  const [newMeasurement, setNewMeasurement] = useState<Partial<BodyMeasurement>>({
    date: new Date(),
    weight: undefined,
    bodyFat: undefined,
    chest: undefined,
    waist: undefined,
    hips: undefined,
    arms: undefined,
    thighs: undefined
  });
  
  const [newGoal, setNewGoal] = useState<Partial<WorkoutGoal>>({
    title: '',
    description: '',
    targetDate: new Date(),
    progress: 0,
    type: 'Strength'
  });

  const handleAddPersonalBest = () => {
    if (!newPersonalBest.exerciseName || !newPersonalBest.value) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const personalBest: PersonalBest = {
      id: Date.now().toString(),
      exerciseName: newPersonalBest.exerciseName,
      value: newPersonalBest.value,
      unit: newPersonalBest.unit as 'kg' | 'reps' | 'minutes' | 'seconds',
      date: newPersonalBest.date || new Date(),
      notes: newPersonalBest.notes
    };

    setPersonalBests([personalBest, ...personalBests]);
    
    toast({
      title: "Personal Best Added",
      description: `Added new personal best for ${personalBest.exerciseName}`
    });
    
    setNewPersonalBest({
      exerciseName: '',
      value: 0,
      unit: 'kg',
      date: new Date(),
      notes: ''
    });
    
    setPersonalBestDialogOpen(false);
  };

  const handleAddMeasurement = () => {
    if (!newMeasurement.weight && !newMeasurement.bodyFat) {
      toast({
        title: "Missing information",
        description: "Please add at least weight or body fat percentage",
        variant: "destructive"
      });
      return;
    }

    const measurement: BodyMeasurement = {
      id: Date.now().toString(),
      date: newMeasurement.date || new Date(),
      weight: newMeasurement.weight,
      bodyFat: newMeasurement.bodyFat,
      chest: newMeasurement.chest,
      waist: newMeasurement.waist,
      hips: newMeasurement.hips,
      arms: newMeasurement.arms,
      thighs: newMeasurement.thighs
    };

    setMeasurements([measurement, ...measurements]);
    
    toast({
      title: "Measurements Logged",
      description: "Your body measurements have been saved"
    });
    
    setNewMeasurement({
      date: new Date(),
      weight: undefined,
      bodyFat: undefined,
      chest: undefined,
      waist: undefined,
      hips: undefined,
      arms: undefined,
      thighs: undefined
    });
    
    setMeasurementDialogOpen(false);
  };

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.targetDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const goal: WorkoutGoal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description || '',
      targetDate: newGoal.targetDate,
      progress: newGoal.progress || 0,
      type: newGoal.type as 'Strength' | 'Endurance' | 'Weight Loss' | 'Muscle Gain' | 'Other'
    };

    setGoals([goal, ...goals]);
    
    toast({
      title: "Goal Added",
      description: `Added new ${goal.type} goal: ${goal.title}`
    });
    
    setNewGoal({
      title: '',
      description: '',
      targetDate: new Date(),
      progress: 0,
      type: 'Strength'
    });
    
    setGoalDialogOpen(false);
  };

  const handleAddProgressPhoto = () => {
    toast({
      title: "Photo Added",
      description: "Your progress photo has been saved"
    });
    setProgressPhotoDialogOpen(false);
  };

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
                      return typeof value === 'number' ? `${value}%` : value;
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
              <Button variant="outline" className="gap-1" onClick={() => setMeasurementDialogOpen(true)}>
                <Ruler className="h-4 w-4" />
                Log Measurements
              </Button>
              <Button variant="outline" className="gap-1" onClick={() => setProgressPhotoDialogOpen(true)}>
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
                {measurements.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Recorded on {measurements[0].date.toLocaleDateString()}
                    </p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {measurements[0].weight && (
                        <div>
                          <p className="text-sm font-medium">Weight</p>
                          <p className="text-lg">{measurements[0].weight} kg</p>
                        </div>
                      )}
                      {measurements[0].bodyFat && (
                        <div>
                          <p className="text-sm font-medium">Body Fat</p>
                          <p className="text-lg">{measurements[0].bodyFat}%</p>
                        </div>
                      )}
                      {measurements[0].chest && (
                        <div>
                          <p className="text-sm font-medium">Chest</p>
                          <p className="text-lg">{measurements[0].chest} cm</p>
                        </div>
                      )}
                      {measurements[0].waist && (
                        <div>
                          <p className="text-sm font-medium">Waist</p>
                          <p className="text-lg">{measurements[0].waist} cm</p>
                        </div>
                      )}
                      {measurements[0].arms && (
                        <div>
                          <p className="text-sm font-medium">Arms</p>
                          <p className="text-lg">{measurements[0].arms} cm</p>
                        </div>
                      )}
                      {measurements[0].thighs && (
                        <div>
                          <p className="text-sm font-medium">Thighs</p>
                          <p className="text-lg">{measurements[0].thighs} cm</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-2">No measurements recorded</p>
                    <Button onClick={() => setMeasurementDialogOpen(true)}>Log Your First Measurement</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Progress Photos</h3>
                <div className="border rounded-lg border-dashed p-10 flex flex-col items-center justify-center text-center">
                  <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground mb-2">Drag and drop or click to upload</p>
                  <Button variant="outline" onClick={() => setProgressPhotoDialogOpen(true)}>Upload Photos</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="personal-bests" className="mt-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xl">Personal Bests</h3>
            <Button className="gap-1" onClick={() => setPersonalBestDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Personal Best
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {personalBests.map(pb => (
              <Card key={pb.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-lg">{pb.exerciseName}</h4>
                      <p className="text-xl font-bold text-primary mt-2">
                        {pb.value} {pb.unit}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {pb.date.toLocaleDateString()}
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
            <Button className="gap-1" onClick={() => setGoalDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Goal
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map(goal => (
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
                          Target: {goal.targetDate.toLocaleDateString()}
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

      {/* Personal Best Dialog */}
      <Dialog open={personalBestDialogOpen} onOpenChange={setPersonalBestDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Personal Best</DialogTitle>
            <DialogDescription>Record a new personal best for an exercise</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="exerciseName">Exercise Name</Label>
              <Input
                id="exerciseName"
                value={newPersonalBest.exerciseName || ''}
                onChange={(e) => setNewPersonalBest({...newPersonalBest, exerciseName: e.target.value})}
                placeholder="e.g. Bench Press, Deadlift"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  type="number"
                  value={newPersonalBest.value || ''}
                  onChange={(e) => setNewPersonalBest({...newPersonalBest, value: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Select 
                  value={newPersonalBest.unit}
                  onValueChange={(value) => setNewPersonalBest({...newPersonalBest, unit: value as 'kg' | 'reps' | 'minutes' | 'seconds'})}>
                  <SelectTrigger id="unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="reps">reps</SelectItem>
                    <SelectItem value="minutes">minutes</SelectItem>
                    <SelectItem value="seconds">seconds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="pbDate">Date</Label>
              <Input
                id="pbDate"
                type="date"
                value={newPersonalBest.date ? new Date(newPersonalBest.date).toISOString().split('T')[0] : ''}
                onChange={(e) => setNewPersonalBest({...newPersonalBest, date: new Date(e.target.value)})}
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newPersonalBest.notes || ''}
                onChange={(e) => setNewPersonalBest({...newPersonalBest, notes: e.target.value})}
                placeholder="Any additional details..."
                className="resize-none"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPersonalBestDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddPersonalBest}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Measurements Dialog */}
      <Dialog open={measurementDialogOpen} onOpenChange={setMeasurementDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Log Body Measurements</DialogTitle>
            <DialogDescription>Record your current body measurements</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="measurementDate">Date</Label>
              <Input
                id="measurementDate"
                type="date"
                value={newMeasurement.date ? new Date(newMeasurement.date).toISOString().split('T')[0] : ''}
                onChange={(e) => setNewMeasurement({...newMeasurement, date: new Date(e.target.value)})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={newMeasurement.weight || ''}
                  onChange={(e) => setNewMeasurement({...newMeasurement, weight: parseFloat(e.target.value)})}
                  placeholder="e.g. 80.5"
                />
              </div>
              
              <div>
                <Label htmlFor="bodyFat">Body Fat (%)</Label>
                <Input
                  id="bodyFat"
                  type="number"
                  step="0.1"
                  value={newMeasurement.bodyFat || ''}
                  onChange={(e) => setNewMeasurement({...newMeasurement, bodyFat: parseFloat(e.target.value)})}
                  placeholder="e.g. 15.5"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="chest">Chest (cm)</Label>
                <Input
                  id="chest"
                  type="number"
                  step="0.1"
                  value={newMeasurement.chest || ''}
                  onChange={(e) => setNewMeasurement({...newMeasurement, chest: parseFloat(e.target.value)})}
                  placeholder="e.g. 100"
                />
              </div>
              
              <div>
                <Label htmlFor="waist">Waist (cm)</Label>
                <Input
                  id="waist"
                  type="number"
                  step="0.1"
                  value={newMeasurement.waist || ''}
                  onChange={(e) => setNewMeasurement({...newMeasurement, waist: parseFloat(e.target.value)})}
                  placeholder="e.g. 85"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hips">Hips (cm)</Label>
                <Input
                  id="hips"
                  type="number"
                  step="0.1"
                  value={newMeasurement.hips || ''}
                  onChange={(e) => setNewMeasurement({...newMeasurement, hips: parseFloat(e.target.value)})}
                  placeholder="e.g. 95"
                />
              </div>
              
              <div>
                <Label htmlFor="arms">Arms (cm)</Label>
                <Input
                  id="arms"
                  type="number"
                  step="0.1"
                  value={newMeasurement.arms || ''}
                  onChange={(e) => setNewMeasurement({...newMeasurement, arms: parseFloat(e.target.value)})}
                  placeholder="e.g. 35"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="thighs">Thighs (cm)</Label>
              <Input
                id="thighs"
                type="number"
                step="0.1"
                value={newMeasurement.thighs || ''}
                onChange={(e) => setNewMeasurement({...newMeasurement, thighs: parseFloat(e.target.value)})}
                placeholder="e.g. 55"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setMeasurementDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddMeasurement}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Goal Dialog */}
      <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Fitness Goal</DialogTitle>
            <DialogDescription>Create a new fitness goal to track your progress</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="goalTitle">Goal Title</Label>
              <Input
                id="goalTitle"
                value={newGoal.title || ''}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                placeholder="e.g. Lose 5kg, Run a marathon"
              />
            </div>
            
            <div>
              <Label htmlFor="goalType">Goal Type</Label>
              <Select 
                value={newGoal.type}
                onValueChange={(value) => setNewGoal({
                  ...newGoal, 
                  type: value as 'Strength' | 'Endurance' | 'Weight Loss' | 'Muscle Gain' | 'Other'
                })}>
                <SelectTrigger id="goalType">
                  <SelectValue placeholder="Select goal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Strength">Strength</SelectItem>
                  <SelectItem value="Endurance">Endurance</SelectItem>
                  <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                  <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="goalDescription">Description</Label>
              <Textarea
                id="goalDescription"
                value={newGoal.description || ''}
                onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                placeholder="Describe your goal in more detail..."
                className="resize-none"
              />
            </div>
            
            <div>
              <Label htmlFor="goalTargetDate">Target Date</Label>
              <Input
                id="goalTargetDate"
                type="date"
                value={newGoal.targetDate ? new Date(newGoal.targetDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setNewGoal({...newGoal, targetDate: new Date(e.target.value)})}
              />
            </div>
            
            <div>
              <Label htmlFor="goalProgress">Current Progress (%)</Label>
              <Input
                id="goalProgress"
                type="number"
                min="0"
                max="100"
                value={newGoal.progress || 0}
                onChange={(e) => setNewGoal({...newGoal, progress: parseInt(e.target.value)})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setGoalDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddGoal}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Progress Photo Dialog */}
      <Dialog open={progressPhotoDialogOpen} onOpenChange={setProgressPhotoDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Progress Photo</DialogTitle>
            <DialogDescription>Upload a photo to track your physical progress</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-center">
              <Camera className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="mb-3">Drag and drop your photo here</p>
              <p className="text-sm text-muted-foreground mb-4">or</p>
              <Button variant="outline">Browse Files</Button>
            </div>
            
            <div>
              <Label htmlFor="photoDate">Date</Label>
              <Input
                id="photoDate"
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div>
              <Label htmlFor="photoNotes">Notes</Label>
              <Textarea
                id="photoNotes"
                placeholder="Any notes about this photo..."
                className="resize-none"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setProgressPhotoDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddProgressPhoto}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
