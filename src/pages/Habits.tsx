
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, CheckCircle2, Award, BarChart2, LineChart, Calendar, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import HabitStatisticsOverview from "@/components/habits/HabitStatisticsOverview";
import HabitStatisticsTrends from "@/components/habits/HabitStatisticsTrends";
import HabitStatisticsCategories from "@/components/habits/HabitStatisticsCategories";
import HabitStatisticsStreaks from "@/components/habits/HabitStatisticsStreaks";
import HabitCreationDialog from "@/components/habits/HabitCreationDialog";

interface Habit {
  id: string;
  title: string;
  category: string;
  streak: number;
  target: number;
  status: "completed" | "pending" | "missed";
  completionDates: Date[];
  type: "daily" | "weekly" | "monthly";
  createdAt: Date;
}

const Habits = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("active");
  const [statisticsTab, setStatisticsTab] = useState("overview");
  const [showHabitDialog, setShowHabitDialog] = useState(false);
  
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: "1",
      title: "Morning Meditation",
      category: "mindfulness",
      streak: 7,
      target: 15,
      status: "completed",
      completionDates: Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date;
      }),
      type: "daily",
      createdAt: new Date(Date.now() - 14 * 86400000)
    },
    {
      id: "2",
      title: "Read 20 pages",
      category: "learning",
      streak: 3,
      target: 30,
      status: "pending",
      completionDates: Array.from({ length: 3 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i - 1);
        return date;
      }),
      type: "daily",
      createdAt: new Date(Date.now() - 10 * 86400000)
    },
    {
      id: "3",
      title: "Workout",
      category: "health",
      streak: 0,
      target: 5,
      status: "missed",
      completionDates: [],
      type: "daily",
      createdAt: new Date(Date.now() - 5 * 86400000)
    },
    {
      id: "4",
      title: "Drink 2L water",
      category: "health",
      streak: 12,
      target: 30,
      status: "completed",
      completionDates: Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date;
      }),
      type: "daily",
      createdAt: new Date(Date.now() - 20 * 86400000)
    }
  ]);
  
  const handleCreateHabit = (habit: Habit) => {
    const newHabit = {
      ...habit,
      id: `habit-${Date.now()}`,
      createdAt: new Date(),
      streak: 0,
      completionDates: []
    };
    setHabits([...habits, newHabit]);
    toast({
      title: "Habit Created",
      description: "Your new habit has been created successfully!",
    });
    setShowHabitDialog(false);
  };
  
  const completeHabit = (id: string) => {
    setHabits(habits.map(habit =>
      habit.id === id ? 
        { 
          ...habit, 
          status: "completed",
          streak: habit.streak + 1,
          completionDates: [...habit.completionDates, new Date()]
        } : habit
    ));
    
    const habit = habits.find(h => h.id === id);
    if (habit) {
      toast({
        title: "Habit Completed!",
        description: `${habit.title} completed for today.`,
      });
      
      // Check if streak milestone reached
      const updatedStreak = habit.streak + 1;
      if (updatedStreak === habit.target) {
        setTimeout(() => {
          toast({
            title: "Achievement Unlocked!",
            description: `You've reached your streak goal of ${habit.target} days for ${habit.title}!`,
            variant: "default",
          });
        }, 1000);
      }
    }
  };
  
  // Calculate statistics
  const todayCompleted = habits.filter(h => h.status === "completed").length;
  const totalHabits = habits.length;
  const completionRate = Math.round((habits.reduce((acc, habit) => 
    acc + habit.completionDates.length, 0) / (habits.length * 30)) * 100);
  const longestStreak = Math.max(...habits.map(h => h.streak));
  const accountabilityScore = habits.reduce((acc, habit) => acc + habit.streak * 10, 0);

  const pendingHabits = habits.filter(habit => habit.status === "pending");
  const completedHabits = habits.filter(habit => habit.status === "completed");
  const missedHabits = habits.filter(habit => habit.status === "missed");

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              Habit Tracker
            </h1>
            <p className="text-muted-foreground">Build consistency with your daily habits.</p>
          </div>
          <Button onClick={() => setShowHabitDialog(true)} className="gap-2">
            <Plus size={18} />
            New Habit
          </Button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Accountability Score</p>
                  <h2 className="text-3xl font-bold">{accountabilityScore}</h2>
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <span className="mr-1">+{Math.round(accountabilityScore * 0.1)} this week</span>
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Progress</p>
                  <h2 className="text-3xl font-bold">{todayCompleted}/{totalHabits}</h2>
                  <p className="text-xs text-muted-foreground mt-1">habits completed</p>
                </div>
                <div className="bg-muted p-3 rounded-full">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
              </div>
              <Progress value={(todayCompleted / totalHabits) * 100} className="h-2 mt-4" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Longest Streak</p>
                  <h2 className="text-3xl font-bold">{longestStreak}</h2>
                  <p className="text-xs text-muted-foreground mt-1">days in a row</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <Award className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                  <h2 className="text-3xl font-bold">{completionRate}%</h2>
                  <p className="text-xs text-muted-foreground mt-1">overall success</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <BarChart2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="active">Active Habits</TabsTrigger>
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="missed">Missed</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Calendar className="h-4 w-4" />
                <span>Week</span>
              </Button>
            </div>
          </div>

          <TabsContent value="active" className="mt-6">
            {pendingHabits.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">No active habits</h3>
                <p className="mt-2 text-muted-foreground">
                  Start by creating your first habit to track.
                </p>
                <Button onClick={() => setShowHabitDialog(true)} className="mt-4">
                  Create New Habit
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingHabits.map(habit => (
                  <Card key={habit.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                    <CardContent className="p-0">
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center bg-muted/30`}>
                              <CheckCircle2 className="h-5 w-5 text-muted-foreground/50" />
                            </div>
                            <div>
                              <h4 className="font-medium">{habit.title}</h4>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Award className="h-3.5 w-3.5 text-orange-500" />
                                <span className="text-xs text-muted-foreground">
                                  {habit.streak} day streak
                                </span>
                                <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted/30">
                                  {habit.target} day goal
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => completeHabit(habit.id)}
                          >
                            Complete
                          </Button>
                        </div>
                        
                        <div className="mt-2">
                          <div className="h-2 bg-muted/30 rounded-full w-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full bg-primary`}
                              style={{ width: `${(habit.streak / habit.target) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex justify-between items-center">
                          <div className="bg-muted/30 px-2 py-0.5 rounded-full text-xs text-muted-foreground">
                            {habit.category}
                          </div>
                          
                          <span className="text-xs text-muted-foreground">
                            {habit.type}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="statistics" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    Habit Statistics
                  </CardTitle>
                  
                  <Tabs defaultValue="overview" value={statisticsTab} onValueChange={setStatisticsTab}>
                    <TabsList>
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="trends">Trends</TabsTrigger>
                      <TabsTrigger value="categories">Categories</TabsTrigger>
                      <TabsTrigger value="streaks">Streaks</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                {statisticsTab === "overview" && <HabitStatisticsOverview habits={habits} />}
                {statisticsTab === "trends" && <HabitStatisticsTrends habits={habits} />}
                {statisticsTab === "categories" && <HabitStatisticsCategories habits={habits} />}
                {statisticsTab === "streaks" && <HabitStatisticsStreaks habits={habits} />}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed" className="mt-6">
            {completedHabits.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">No completed habits today</h3>
                <p className="mt-2 text-muted-foreground">
                  Complete your active habits to see them here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedHabits.map(habit => (
                  <Card key={habit.id} className="overflow-hidden bg-muted/5 border-success/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-success/20">
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{habit.title}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Award className="h-3.5 w-3.5 text-orange-500" />
                            <span className="text-xs text-muted-foreground">
                              {habit.streak} day streak
                            </span>
                          </div>
                        </div>
                        <div className="bg-success/20 px-2 py-1 rounded-full text-xs text-success">
                          Completed
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="missed" className="mt-6">
            {missedHabits.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">No missed habits</h3>
                <p className="mt-2 text-muted-foreground">
                  Great job staying on track with your habits!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {missedHabits.map(habit => (
                  <Card key={habit.id} className="overflow-hidden border-destructive/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-destructive/20">
                          <CheckCircle2 className="h-5 w-5 text-destructive" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{habit.title}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-muted-foreground">
                              Streak reset (was {habit.streak})
                            </span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => completeHabit(habit.id)}
                        >
                          Complete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <HabitCreationDialog
        open={showHabitDialog}
        onOpenChange={setShowHabitDialog}
        onHabitCreate={handleCreateHabit}
      />
    </AppLayout>
  );
};

export default Habits;
