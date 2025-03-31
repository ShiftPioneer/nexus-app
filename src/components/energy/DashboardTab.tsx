
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Calendar,
  BarChart2,
  PlusCircle,
  Clock,
  Dumbbell,
  Flame
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Workout } from "@/types/energy";
import { format } from "date-fns";
import { WorkoutDialog } from "./WorkoutDialog";
import { CalendarView } from "./CalendarView";

const sampleWorkouts: Workout[] = [
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
  },
  {
    id: "3",
    name: "Upper Body Focus",
    date: new Date("2023-12-20"),
    duration: 45,
    caloriesBurned: 320,
    exercises: [
      { id: "31", name: "Shoulder Press", category: "Shoulders", sets: 3, reps: 12, weight: 40, notes: "" },
      { id: "32", name: "Tricep Dips", category: "Arms", sets: 3, reps: 15, notes: "" },
      { id: "33", name: "Lat Pulldown", category: "Back", sets: 3, reps: 10, weight: 55, notes: "" }
    ],
    status: "Planned"
  }
];

export function DashboardTab() {
  const [workouts, setWorkouts] = useState<Workout[]>(sampleWorkouts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  
  const totalWorkouts = workouts.filter(w => w.status === "Completed").length;
  const totalCaloriesBurned = workouts
    .filter(w => w.status === "Completed")
    .reduce((total, workout) => total + workout.caloriesBurned, 0);
  const totalMinutes = workouts
    .filter(w => w.status === "Completed")
    .reduce((total, workout) => total + workout.duration, 0);
  
  const completedWorkouts = workouts.filter(w => w.status === "Completed").sort((a, b) => b.date.getTime() - a.date.getTime());
  const upcomingWorkouts = workouts.filter(w => w.status === "Planned").sort((a, b) => a.date.getTime() - b.date.getTime());
  
  const handleAddWorkout = (workout: Workout) => {
    // Add new workout or update existing one
    if (workouts.find(w => w.id === workout.id)) {
      setWorkouts(workouts.map(w => w.id === workout.id ? workout : w));
    } else {
      setWorkouts([...workouts, { ...workout, id: Date.now().toString() }]);
    }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Workouts</p>
              <h3 className="text-3xl font-bold">{totalWorkouts}</h3>
            </div>
            <Dumbbell className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Calories Burned</p>
              <h3 className="text-3xl font-bold">{totalCaloriesBurned}</h3>
            </div>
            <Flame className="h-8 w-8 text-orange-500" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Minutes</p>
              <h3 className="text-3xl font-bold">{totalMinutes}</h3>
            </div>
            <Clock className="h-8 w-8 text-blue-400" />
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button 
          className="h-20 text-lg gap-2"
          onClick={() => setDialogOpen(true)}
        >
          <PlusCircle className="h-5 w-5" />
          Start New Workout
        </Button>
        
        <Button 
          variant="outline"
          className="h-20 text-lg gap-2"
          onClick={() => window.location.href = "#workout-library"}
        >
          <Dumbbell className="h-5 w-5" />
          Workout Library
        </Button>
        
        <Button 
          variant="outline"
          className="h-20 text-lg gap-2"
          onClick={() => window.location.href = "#progress"}
        >
          <BarChart2 className="h-5 w-5" />
          View Progress
        </Button>
        
        <Button 
          variant="outline"
          className="h-20 text-lg gap-2"
          onClick={() => setScheduleDialogOpen(true)}
        >
          <Calendar className="h-5 w-5" />
          Schedule Workout
        </Button>
      </div>
      
      {/* Recent and Upcoming Workouts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-2">Recent Workouts</h3>
            <p className="text-sm text-muted-foreground mb-4">Your latest completed workouts</p>
            
            <div className="space-y-4">
              {completedWorkouts.slice(0, 3).map(workout => (
                <div key={workout.id} className="flex justify-between items-center border-b pb-3">
                  <div>
                    <p className="font-medium">{workout.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(workout.date, "MMM d, yyyy")} · {workout.duration} min
                    </p>
                  </div>
                  <span className="font-semibold">{workout.caloriesBurned} cal</span>
                </div>
              ))}
              
              {completedWorkouts.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No completed workouts yet</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-2">Upcoming Workouts</h3>
            <p className="text-sm text-muted-foreground mb-4">Your scheduled workouts</p>
            
            <div className="space-y-4">
              {upcomingWorkouts.slice(0, 3).map(workout => (
                <div key={workout.id} className="flex justify-between items-center border-b pb-3">
                  <div>
                    <p className="font-medium">{workout.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(workout.date, "MMM d, yyyy")} · {workout.duration} min
                    </p>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Calendar className="h-4 w-4 mr-1" />
                    Reschedule
                  </Button>
                </div>
              ))}
              
              {upcomingWorkouts.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No upcoming workouts scheduled</p>
                  <Button 
                    size="sm" 
                    className="gap-1"
                    onClick={() => setScheduleDialogOpen(true)}
                  >
                    <PlusCircle className="h-4 w-4" />
                    Schedule Workout
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Workout Calendar */}
      <Card id="calendar">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold mb-2">Workout Calendar</h3>
          <p className="text-sm text-muted-foreground mb-4">Plan your weekly fitness routine</p>
          
          <CalendarView workouts={workouts} />
        </CardContent>
      </Card>
      
      <WorkoutDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleAddWorkout}
      />
      
      <WorkoutDialog 
        open={scheduleDialogOpen}
        onOpenChange={setScheduleDialogOpen}
        onSave={handleAddWorkout}
        schedulingMode
      />
    </div>
  );
}
