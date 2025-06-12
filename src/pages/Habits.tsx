
import React, { useState, useEffect } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, CheckCircle2, Award, BarChart2, Calendar, Filter, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/use-local-storage";
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
  
  // Use localStorage for data persistence
  const [habits, setHabits] = useLocalStorage<Habit[]>("userHabits", [
    {
      id: "1",
      title: "Morning Meditation",
      category: "mindfulness",
      streak: 7,
      target: 15,
      status: "completed" as const,
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
      status: "pending" as const,
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
    }
  ]);

  const [accountabilityScore, setAccountabilityScore] = useLocalStorage("accountabilityScore", 0);

  // Calculate real accountability score based on streaks and completions
  useEffect(() => {
    const score = habits.reduce((total, habit) => {
      const streakBonus = habit.streak * (habit.scoreValue || 5);
      const completionBonus = habit.completionDates.length * 2;
      const penaltyDeduction = habit.status === "missed" ? (habit.penaltyValue || 10) : 0;
      return total + streakBonus + completionBonus - penaltyDeduction;
    }, 0);
    setAccountabilityScore(Math.max(0, score));
  }, [habits, setAccountabilityScore]);

  // Check and update habit statuses daily
  useEffect(() => {
    const today = new Date().toDateString();
    const lastCheck = localStorage.getItem('lastHabitCheck');
    
    if (lastCheck !== today) {
      // Reset daily habits that haven't been completed
      setHabits(prevHabits => 
        prevHabits.map(habit => {
          if (habit.type === "daily" && habit.status === "completed") {
            const lastCompletion = habit.completionDates[0];
            const lastCompletionDate = lastCompletion ? new Date(lastCompletion).toDateString() : '';
            
            if (lastCompletionDate !== today) {
              return { ...habit, status: "pending" as const };
            }
          }
          return habit;
        })
      );
      
      localStorage.setItem('lastHabitCheck', today);
    }
  }, [setHabits]);
  
  const handleCreateHabit = (habit: Habit) => {
    if (selectedHabit) {
      setHabits(habits.map(h => h.id === habit.id ? habit : h));
      toast({
        title: "Habit Updated",
        description: "Your habit has been updated successfully!",
      });
      setSelectedHabit(null);
    } else {
      const newHabit: Habit = {
        ...habit,
        id: `habit-${Date.now()}`,
        createdAt: new Date(),
        streak: 0,
        completionDates: [],
        status: "pending"
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
    const today = new Date();
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        // Check if already completed today
        const completedToday = habit.completionDates.some(date => 
          new Date(date).toDateString() === today.toDateString()
        );
        
        if (completedToday) {
          toast({
            title: "Already Completed",
            description: `${habit.title} has already been completed today.`,
            variant: "default",
          });
          return habit;
        }
        
        const updatedHabit: Habit = { 
          ...habit, 
          status: "completed" as const,
          streak: habit.streak + 1,
          completionDates: [today, ...habit.completionDates]
        };
        
        return updatedHabit;
      }
      return habit;
    }));
    
    const habit = habits.find(h => h.id === id);
    if (habit) {
      toast({
        title: "Habit Completed! 🎉",
        description: `${habit.title} completed for today. +${habit.scoreValue || 5} points!`,
      });
      
      const updatedStreak = habit.streak + 1;
      if (updatedStreak === habit.target) {
        setTimeout(() => {
          toast({
            title: "Achievement Unlocked! 🏆",
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
        const updatedHabit: Habit = { 
          ...habit, 
          status: "missed" as const,
          streak: 0
        };
        
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

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
    toast({
      title: "Habit Deleted",
      description: "The habit has been removed from your list.",
    });
  };
  
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

  const generateWeeklyCompletionData = () => {
    const result = [];
    const habitSubset = habits.slice(0, 5);
    
    for (const habit of habitSubset) {
      const weekData = {
        name: habit.title,
        category: habit.category,
        completions: Array(7).fill(false),
      };
      
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toDateString();
        
        const completed = habit.completionDates.some(d => 
          new Date(d).toDateString() === dateString
        );
        
        weekData.completions[6-i] = completed;
      }
      
      result.push(weekData);
    }
    
    return result;
  };
  
  const weeklyActivityData = generateWeeklyCompletionData();

  return (
    <ModernAppLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <CheckCircle2 className="h-7 w-7 text-primary" />
              Habits
            </h1>
            <p className="text-muted-foreground mt-2">Track your daily habits and build lasting streaks</p>
          </div>
          <Button onClick={() => {setSelectedHabit(null); setShowHabitDialog(true);}} className="gap-2">
            <Plus size={18} />
            New Habit
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
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
                  <div className="space-y-3">
                    {habits.map((habit) => (
                      <Card 
                        key={habit.id} 
                        className={cn(
                          "border overflow-hidden hover:border-primary/30 transition-all duration-200 cursor-pointer group",
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
                                  "h-12 w-12 rounded-full flex items-center justify-center transition-all",
                                  habit.status === "completed" ? "bg-success/20" : 
                                  habit.status === "missed" ? "bg-destructive/20" : "bg-muted"
                                )}
                              >
                                <CheckCircle 
                                  className={cn(
                                    "h-6 w-6 transition-all",
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
                              <div className={cn("px-2 py-1 rounded-full text-xs font-medium", getCategoryColor(habit.category))}>
                                {habit.category}
                              </div>
                              
                              {habit.status === "pending" && (
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                                <span className="px-3 py-1 text-xs rounded-full bg-success/20 text-success font-medium">
                                  ✓ Completed
                                </span>
                              )}
                              
                              {habit.status === "missed" && (
                                <span className="px-3 py-1 text-xs rounded-full bg-destructive/20 text-destructive font-medium">
                                  ✗ Missed
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <div className="h-2 bg-muted/30 rounded-full w-full overflow-hidden">
                              <div 
                                className={cn(
                                  "h-full rounded-full transition-all duration-700",
                                  habit.status === "missed" ? "bg-destructive/50" : "bg-primary"
                                )}
                                style={{ width: `${Math.min((habit.streak / habit.target) * 100, 100)}%` }}
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
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Accountability Score</p>
                    <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400">{accountabilityScore}</h2>
                    <p className="text-xs text-green-600 mt-1 flex items-center">
                      <span className="mr-1">+{habits.reduce((sum, h) => sum + (h.scoreValue || 5), 0)} potential today</span>
                    </p>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                    <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
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
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs ${getCategoryColor(habit.category)}`}>
                            {index + 1}
                          </div>
                          <span className="font-medium">{habit.title}</span>
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
                                  "h-7 w-7 rounded-full flex items-center justify-center transition-colors",
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
    </ModernAppLayout>
  );
};

export default Habits;
