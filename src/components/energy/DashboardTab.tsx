
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Workout } from "@/types/energy";
import { Dumbbell, Calendar, Clock, FlameIcon, Plus, BarChart2, ArrowRight, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { ResponsiveContainer, BarChart, Bar, XAxis, LineChart, Line, CartesianGrid, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const sampleWorkouts: Workout[] = [
  {
    id: "1",
    name: "Upper Body Strength",
    date: new Date("2023-12-20T10:00:00"),
    duration: 60,
    caloriesBurned: 350,
    exercises: [
      {
        id: "e1",
        name: "Bench Press",
        category: "Chest",
        equipment: "Barbell",
        sets: 4,
        reps: 8,
        weight: 80,
        notes: "Focus on controlled descent"
      },
      {
        id: "e2",
        name: "Pull-ups",
        category: "Back",
        sets: 4,
        reps: 10
      },
      {
        id: "e3",
        name: "Shoulder Press",
        category: "Shoulders",
        equipment: "Dumbbells",
        sets: 3,
        reps: 10,
        weight: 20
      }
    ],
    status: "Completed"
  },
  {
    id: "2",
    name: "Lower Body Focus",
    date: new Date("2023-12-22T11:00:00"),
    duration: 55,
    caloriesBurned: 400,
    exercises: [
      {
        id: "e1",
        name: "Squats",
        category: "Legs",
        equipment: "Barbell",
        sets: 4,
        reps: 10,
        weight: 100
      },
      {
        id: "e2",
        name: "Romanian Deadlift",
        category: "Back/Legs",
        equipment: "Barbell",
        sets: 3,
        reps: 12,
        weight: 80
      }
    ],
    status: "Planned"
  }
];

const weeklyData = [
  { day: "Mon", workouts: 1, calories: 400 },
  { day: "Tue", workouts: 1, calories: 350 },
  { day: "Wed", workouts: 0, calories: 0 },
  { day: "Thu", workouts: 1, calories: 450 },
  { day: "Fri", workouts: 0, calories: 0 },
  { day: "Sat", workouts: 1, calories: 500 },
  { day: "Sun", workouts: 0, calories: 0 }
];

const progressData = [
  { week: "W1", weight: 85 },
  { week: "W2", weight: 84 },
  { week: "W3", weight: 83.5 },
  { week: "W4", weight: 82 }
];

const statsCards = [
  {
    title: "Total Workouts",
    value: "18",
    change: "+3",
    trend: "up",
    period: "this month"
  },
  {
    title: "Calories Burned",
    value: "5,280",
    change: "+12%",
    trend: "up",
    period: "vs last month"
  },
  {
    title: "Active Days",
    value: "12",
    change: "+2",
    trend: "up",
    period: "this month"
  },
  {
    title: "Avg. Workout",
    value: "52 min",
    change: "+5 min",
    trend: "up",
    period: "vs last month"
  }
];

export function DashboardTab() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeWorkouts, setActiveWorkouts] = useState<Workout[]>(sampleWorkouts);
  
  const handleStartWorkout = (workout: Workout) => {
    toast({
      title: "Starting Workout",
      description: `Starting ${workout.name}`,
    });
    // In a real app this would navigate to a workout session page
  };
  
  const handleQuickAction = (action: string) => {
    switch (action) {
      case "startWorkout":
        toast({
          title: "Start New Workout",
          description: "Creating a new workout session",
        });
        break;
      case "scheduleWorkout":
        toast({
          title: "Schedule Workout",
          description: "Opening workout scheduler",
        });
        break;
      case "browseExercises":
        navigate("/energy?tab=workouts");
        break;
      case "trackProgress":
        navigate("/energy?tab=analytics");
        break;
      default:
        break;
    }
  };
  
  const viewAllWorkouts = () => {
    navigate("/energy?tab=workouts");
  };
  
  const viewAnalytics = () => {
    navigate("/energy?tab=analytics");
  };
  
  const viewCalendar = () => {
    toast({
      title: "Calendar View",
      description: "Opening workout calendar",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <div className="flex items-baseline justify-between mt-2">
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className={cn(
                  "text-xs flex items-center",
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                )}>
                  {stat.change}
                  <TrendingUp className={cn(
                    "h-3 w-3 ml-1",
                    stat.trend === "up" ? "" : "rotate-180"
                  )} />
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stat.period}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">This Week's Activity</h3>
              <Button variant="outline" size="sm" className="gap-1" onClick={viewAnalytics}>
                <BarChart2 className="h-4 w-4" />
                View Analytics
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <Tooltip />
                <Bar dataKey="calories" fill="#F97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-6">Weight Progress</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis dataKey="week" />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#F97316" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Upcoming Workouts</h3>
              <Button variant="outline" size="sm" className="gap-1" onClick={viewCalendar}>
                <Calendar className="h-4 w-4" />
                View Calendar
              </Button>
            </div>
            
            <div className="space-y-4">
              {activeWorkouts
                .filter(workout => workout.status === "Planned")
                .map(workout => (
                <div key={workout.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Dumbbell className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{workout.name}</h4>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(workout.date, "MMM d, h:mm a")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {workout.duration} min
                      </div>
                    </div>
                  </div>
                  <Button size="sm" className="gap-1" onClick={() => handleStartWorkout(workout)}>
                    Start
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {activeWorkouts.filter(w => w.status === "Planned").length === 0 && (
                <div className="text-center py-6 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground mb-2">No upcoming workouts</p>
                  <Button size="sm" onClick={() => handleQuickAction("scheduleWorkout")}>Schedule Workout</Button>
                </div>
              )}
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button variant="link" className="gap-1" onClick={viewAllWorkouts}>
                View all workouts
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Quick Actions</h3>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button className="w-full justify-start gap-2" onClick={() => handleQuickAction("startWorkout")}>
                <Plus className="h-4 w-4" />
                Start New Workout
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => handleQuickAction("scheduleWorkout")}>
                <Calendar className="h-4 w-4" />
                Schedule Workout
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => handleQuickAction("browseExercises")}>
                <Dumbbell className="h-4 w-4" />
                Browse Exercises
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => handleQuickAction("trackProgress")}>
                <BarChart2 className="h-4 w-4" />
                Track Progress
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
