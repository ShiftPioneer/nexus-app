
import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, CheckCircle2, Award, BarChart2, LineChart, Calendar, Filter, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import HabitStatisticsOverview from "@/components/habits/HabitStatisticsOverview";
import HabitStatisticsTrends from "@/components/habits/HabitStatisticsTrends";
import HabitStatisticsCategories from "@/components/habits/HabitStatisticsCategories";
import HabitStatisticsStreaks from "@/components/habits/HabitStatisticsStreaks";
import HabitCreationDialog from "@/components/habits/HabitCreationDialog";

const Habits = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("active");
  const [statisticsTab, setStatisticsTab] = useState("overview");
  const [showHabitDialog, setShowHabitDialog] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [accountabilityScore, setAccountabilityScore] = useState(0);
  
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
      createdAt: new Date(Date.now() - 14 * 86400000),
      duration: "10 minutes",
      scoreValue: 5,
      penaltyValue: 10
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
      createdAt: new Date(Date.now() - 10 * 86400000),
      duration: "20 pages",
      scoreValue: 3,
      penaltyValue: 5
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
      createdAt: new Date(Date.now() - 5 * 86400000),
      duration: "30 minutes",
      scoreValue: 10,
      penaltyValue: 15
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
      createdAt: new Date(Date.now() - 20 * 86400000),
      duration: "2 liters",
      scoreValue: 2,
      penaltyValue: 4
    }
  ]);

  // Calculate accountability score
  useEffect(() => {
    const score = habits.reduce((total, habit) => {
      return total + (habit.streak * (habit.scoreValue || 5));
    }, 0);
    setAccountabilityScore(score);
  }, [habits]);
  
  const handleCreateHabit = (habit: Habit) => {
    if (selectedHabit) {
      // Update existing habit
      setHabits(habits.map(h => h.id === habit.id ? habit : h));
      toast({
        title: "Habit Updated",
        description: "Your habit has been updated successfully!",
      });
      setSelectedHabit(null);
    } else {
      // Create new habit
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
    }
    setShowHabitDialog(false);
  };
  
  const handleEditHabit = (habit: Habit) => {
    setSelectedHabit(habit);
    setShowHabitDialog(true);
  };
  
  const completeHabit = (id: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const updatedHabit = { 
          ...habit, 
          status: "completed",
          streak: habit.streak + 1,
          completionDates: [...habit.completionDates, new Date()]
        };
        
        // Update accountability score
        setAccountabilityScore(prev => prev + (habit.scoreValue || 5));
        
        return updatedHabit;
      }
      return habit;
    }));
    
    const habit = habits.find(h => h.id === id);
    if (habit) {
      toast({
        title: "Habit Completed!",
        description: `${habit.title} completed for today. +${habit.scoreValue || 5} points!`,
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

  const missHabit = (id: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        // Reset streak and change status to missed
        const updatedHabit = { 
          ...habit, 
          status: "missed",
          streak: 0
        };
        
        // Update accountability score
        setAccountabilityScore(prev => Math.max(0, prev - (habit.penaltyValue || 10)));
        
        return updatedHabit;
      }
      return habit;
    }));
    
    const habit = habits.find(h => h.id === id);
    if (habit) {
      toast({
        title: "Habit Missed",
        description: `${habit.title} marked as missed. -${habit.penaltyValue || 10} points.`,
        variant: "destructive",
      });
    }
  };
  
  // Calculate statistics
  const todayCompleted = habits.filter(h => h.status === "completed").length;
  const totalHabits = habits.length;
  const completionRate = Math.round((habits.reduce((acc, habit) => 
    acc + habit.completionDates.length, 0) / (Math.max(1, habits.length) * 30)) * 100);
  const longestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;

  const pendingHabits = habits.filter(habit => habit.status === "pending");
  const completedHabits = habits.filter(habit => habit.status === "completed");
  const missedHabits = habits.filter(habit => habit.status === "missed");

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'mindfulness':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'learning':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case 'productivity':
        return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
      case 'relationships':
        return 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400';
      case 'finance':
        return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'religion':
        return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getWeekDays = () => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const today = new Date().getDay();
    const orderedDays = [...days.slice(today + 1), ...days.slice(0, today + 1)];
    return orderedDays;
  };

  // Generate weekly habit completion data
  const generateWeeklyCompletionData = () => {
    const result = [];
    const habitSubset = habits.slice(0, 5); // Limit to 5 habits for display
    
    for (const habit of habitSubset) {
      const weekData = {
        name: habit.title,
        category: habit.category,
        completions: Array(7).fill(false),
      };
      
      // Simulate some completions
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        const completed = habit.completionDates.some(d => 
          new Date(d).toISOString().split('T')[0] === dateString
        );
        
        weekData.completions[6-i] = completed;
      }
      
      result.push(weekData);
    }
    
    return result;
  };
  
  const weeklyActivityData = generateWeeklyCompletionData();

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              Habits
            </h1>
            <p className="text-muted-foreground">Track your daily habits and build streaks</p>
          </div>
          <Button onClick={() => {setSelectedHabit(null); setShowHabitDialog(true);}} className="gap-2">
            <Plus size={18} />
            New Habit
          </Button>
        </div>
        
        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Habits list */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Habits</CardTitle>
                    <CardDescription>Track your consistency and build momentum</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {habits.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <h3 className="mt-4 text-lg font-medium">No habits yet</h3>
                    <p className="mt-2 text-muted-foreground">
                      Start by creating your first habit to track.
                    </p>
                    <Button onClick={() => {setSelectedHabit(null); setShowHabitDialog(true);}} className="mt-4">
                      Create New Habit
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {habits.map((habit) => (
                      <Card 
                        key={habit.id} 
                        className={cn(
                          "border overflow-hidden hover:border-primary/30 transition-colors cursor-pointer",
                          habit.status === "completed" && "border-success/30 bg-success/5",
                          habit.status === "missed" && "border-destructive/30 bg-destructive/5"
                        )}
                        onClick={() => handleEditHabit(habit)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div 
                                className={cn(
                                  "h-12 w-12 rounded-full flex items-center justify-center",
                                  habit.status === "completed" ? "bg-success/20" : 
                                  habit.status === "missed" ? "bg-destructive/20" : "bg-muted"
                                )}
                              >
                                <CheckCircle 
                                  className={cn(
                                    "h-6 w-6",
                                    habit.status === "completed" ? "text-success" : 
                                    habit.status === "missed" ? "text-destructive" : "text-muted-foreground/50"
                                  )}
                                />
                              </div>
                              <div>
                                <h4 className="font-medium text-lg">{habit.title}</h4>
                                <div className="flex items-center gap-4 mt-1">
                                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>{habit.duration}</span>
                                  </span>
                                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>{habit.type}</span>
                                  </span>
                                  <span className="flex items-center gap-1 text-sm text-orange-500 font-medium">
                                    <Award className="h-4 w-4" />
                                    <span>{habit.streak} day streak</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className={cn("px-2 py-1 rounded-full text-xs", getCategoryColor(habit.category))}>
                                {habit.category}
                              </div>
                              
                              {habit.status === "pending" && (
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      completeHabit(habit.id);
                                    }}
                                  >
                                    Complete
                                  </Button>
                                  <Button 
                                    size="sm"
                                    variant="outline"
                                    className="text-destructive border-destructive/30 hover:bg-destructive/10"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      missHabit(habit.id);
                                    }}
                                  >
                                    Skip
                                  </Button>
                                </div>
                              )}
                              
                              {habit.status === "completed" && (
                                <span className="px-2 py-1 text-xs rounded-full bg-success/20 text-success">
                                  Completed
                                </span>
                              )}
                              
                              {habit.status === "missed" && (
                                <span className="px-2 py-1 text-xs rounded-full bg-destructive/20 text-destructive">
                                  Missed
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Progress bar */}
                          <div className="mt-3">
                            <div className="h-2 bg-muted/30 rounded-full w-full overflow-hidden">
                              <div 
                                className={cn(
                                  "h-full rounded-full",
                                  habit.status === "missed" ? "bg-destructive/50" : "bg-primary"
                                )}
                                style={{ width: `${(habit.streak / habit.target) * 100}%` }}
                              ></div>
                            </div>
                            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                              <span>Streak: {habit.streak}</span>
                              <span>Goal: {habit.target} days</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Statistics section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart2 className="h-5 w-5" />
                    Habit Statistics
                  </CardTitle>
                  
                  <Tabs defaultValue="overview" value={statisticsTab} onValueChange={setStatisticsTab}>
                    <TabsList className="overflow-x-auto">
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
          </div>
          
          <div className="space-y-6">
            {/* Accountability Score */}
            <Card className="bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Accountability Score</p>
                    <h2 className="text-3xl font-bold">{accountabilityScore}</h2>
                    <p className="text-xs text-green-600 mt-1 flex items-center">
                      <span className="mr-1">Earn points by completing habits</span>
                    </p>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                    <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Streaks */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-orange-500" />
                  <CardTitle className="text-lg">Streaks</CardTitle>
                </div>
                <CardDescription>Your longest streaks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {habits.length > 0 ? (
                  habits
                    .sort((a, b) => b.streak - a.streak)
                    .slice(0, 5)
                    .map((habit, index) => (
                      <div key={habit.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full ${getCategoryColor(habit.category)}`} />
                          <span>{habit.title}</span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${habit.streak > 0 ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}>
                          {habit.streak} days
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No habits yet. Start building your streaks!
                  </p>
                )}
              </CardContent>
            </Card>
            
            {/* Weekly Activity */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-lg">Weekly Activity</CardTitle>
                </div>
                <CardDescription>This week's habit completion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left font-medium text-muted-foreground text-sm py-2">Habit</th>
                        {getWeekDays().map((day, i) => (
                          <th key={i} className="text-center font-medium text-muted-foreground text-sm py-2 px-1">{day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {weeklyActivityData.map((habit, index) => (
                        <tr key={index} className="border-t">
                          <td className="py-2">
                            <div className="flex items-center gap-2">
                              <div className={`h-2 w-2 rounded-full ${getCategoryColor(habit.category)}`} />
                              <span className="text-sm truncate max-w-[120px]">{habit.name}</span>
                            </div>
                          </td>
                          {habit.completions.map((completed, i) => (
                            <td key={i} className="text-center">
                              <div className="flex justify-center">
                                <div className={cn(
                                  "h-7 w-7 rounded-full flex items-center justify-center",
                                  completed ? "bg-primary/20 text-primary" : "bg-muted/30 text-muted-foreground/30"
                                )}>
                                  <CheckCircle className="h-4 w-4" />
                                </div>
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <HabitCreationDialog
        open={showHabitDialog}
        onOpenChange={setShowHabitDialog}
        onHabitCreate={handleCreateHabit}
        initialHabit={selectedHabit}
      />
    </AppLayout>
  );
};

export default Habits;
