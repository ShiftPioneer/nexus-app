import React, { useState, useEffect } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, CheckCircle2, Award, BarChart2, Calendar, Filter, Clock, CheckCircle, Flame, Circle, X, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/use-local-storage";
import HabitStatisticsOverview from "@/components/habits/HabitStatisticsOverview";
import HabitStatisticsTrends from "@/components/habits/HabitStatisticsTrends";
import HabitStatisticsCategories from "@/components/habits/HabitStatisticsCategories";
import HabitStatisticsStreaks from "@/components/habits/HabitStatisticsStreaks";
import HabitCreationDialog from "@/components/habits/HabitCreationDialog";
import { Badge } from "@/components/ui/badge";
const Habits = () => {
  const {
    toast
  } = useToast();
  const [statisticsTab, setStatisticsTab] = useState("overview");
  const [showHabitDialog, setShowHabitDialog] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Use localStorage for data persistence
  const [habits, setHabits] = useLocalStorage<Habit[]>("userHabits", [{
    id: "1",
    title: "Morning Meditation",
    category: "mindfulness",
    streak: 7,
    target: 15,
    status: "completed" as const,
    completionDates: Array.from({
      length: 7
    }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    }),
    type: "daily",
    createdAt: new Date(Date.now() - 14 * 86400000),
    duration: "10 minutes",
    scoreValue: 5,
    penaltyValue: 10
  }, {
    id: "2",
    title: "Read 20 pages",
    category: "learning",
    streak: 3,
    target: 30,
    status: "pending" as const,
    completionDates: Array.from({
      length: 3
    }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i - 1);
      return date;
    }),
    type: "daily",
    createdAt: new Date(Date.now() - 10 * 86400000),
    duration: "20 pages",
    scoreValue: 3,
    penaltyValue: 5
  }]);
  const [accountabilityScore, setAccountabilityScore] = useLocalStorage("accountabilityScore", 0);

  // Calculate real accountability score based on streaks and completions
  useEffect(() => {
    const score = habits.reduce((total, habit) => {
      const streakBonus = habit.streak * (habit.scoreValue || 5);
      const completionBonus = habit.completionDates.length * 2;
      const penaltyDeduction = habit.status === "missed" ? habit.penaltyValue || 10 : 0;
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
      setHabits(prevHabits => prevHabits.map(habit => {
        if (habit.type === "daily" && habit.status === "completed") {
          const lastCompletion = habit.completionDates[0];
          const lastCompletionDate = lastCompletion ? new Date(lastCompletion).toDateString() : '';
          if (lastCompletionDate !== today) {
            return {
              ...habit,
              status: "pending" as const
            };
          }
        }
        return habit;
      }));
      localStorage.setItem('lastHabitCheck', today);
    }
  }, [setHabits]);
  const handleCreateHabit = (habit: Habit) => {
    if (selectedHabit) {
      setHabits(habits.map(h => h.id === habit.id ? habit : h));
      toast({
        title: "Habit Updated",
        description: "Your habit has been updated successfully!"
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
        description: "Your new habit has been created successfully!"
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
        const completedToday = habit.completionDates.some(date => new Date(date).toDateString() === today.toDateString());
        if (completedToday) {
          toast({
            title: "Already Completed",
            description: `${habit.title} has already been completed today.`,
            variant: "default"
          });
          return habit;
        }

        // Calculate new streak
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const completedYesterday = habit.completionDates.some(date => new Date(date).toDateString() === yesterday.toDateString());
        const newStreak = completedYesterday || habit.completionDates.length === 0 ? habit.streak + 1 : 1;
        const updatedHabit: Habit = {
          ...habit,
          status: "completed" as const,
          streak: newStreak,
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
        description: `${habit.title} completed for today. +${habit.scoreValue || 5} points!`
      });
      const updatedStreak = habit.streak + 1;
      if (updatedStreak === habit.target) {
        setTimeout(() => {
          toast({
            title: "Achievement Unlocked! 🏆",
            description: `You've reached your streak goal of ${habit.target} days for ${habit.title}!`,
            variant: "default"
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
        variant: "destructive"
      });
    }
  };
  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
    toast({
      title: "Habit Deleted",
      description: "The habit has been removed from your list."
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

  // Get status icon based on habit status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "missed":
        return <X className="h-6 w-6 text-red-500" />;
      default:
        return <Circle className="h-6 w-6 text-muted-foreground/50" />;
    }
  };

  // Filter habits based on category
  const filteredHabits = habits.filter(habit => filterCategory === "all" || habit.category === filterCategory);

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(habits.map(h => h.category)))];
  return <ModernAppLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              Habits
            </h1>
            <p className="text-muted-foreground">Track your daily habits and build lasting streaks</p>
          </div>
          <Button onClick={() => {
          setSelectedHabit(null);
          setShowHabitDialog(true);
        }} className="gap-2">
            <Plus size={18} />
            New Habit
          </Button>
        </div>
        
        {/* Accountability Score */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 border-orange-200 dark:border-orange-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-orange-800 dark:text-orange-200 flex items-center gap-2 text-lg">
              <Award className="h-5 w-5" />
              Accountability Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {accountabilityScore}
              </div>
              <div className="flex-1">
                <p className="text-sm text-orange-700 dark:text-orange-300 mb-2">
                  Keep building your habits to increase your score!
                </p>
                <div className="w-full bg-orange-200 dark:bg-orange-800 h-2 rounded-full">
                  <div className="bg-orange-500 h-2 rounded-full transition-all duration-500" style={{
                  width: `${Math.min(100, accountabilityScore / 500 * 100)}%`
                }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Habits List */}
        <Card>
          <CardHeader className="pb-4 bg-slate-950">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Your Habits</CardTitle>
                <CardDescription>Track your consistency and build momentum</CardDescription>
              </div>
              <div className="flex gap-2">
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="px-3 py-1 border rounded-md text-sm bg-slate-900 text-lime-500">
                  {categories.map(cat => <option key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>)}
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="bg-slate-950">
            {filteredHabits.length === 0 ? <div className="text-center py-12">
                <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">No habits yet</h3>
                <p className="mt-2 text-muted-foreground">
                  Start by creating your first habit to track.
                </p>
                <Button onClick={() => {
              setSelectedHabit(null);
              setShowHabitDialog(true);
            }} className="mt-4">
                  Create New Habit
                </Button>
              </div> : <div className="space-y-3">
                {filteredHabits.map(habit => <Card key={habit.id} className={cn("border overflow-hidden hover:border-primary/30 transition-all duration-200 cursor-pointer group", habit.status === "completed" && "border-green-500/30 bg-green-50 dark:bg-green-950/30", habit.status === "missed" && "border-red-500/30 bg-red-50 dark:bg-red-950/30")} onClick={() => handleEditHabit(habit)}>
                    <CardContent className="p-4 bg-slate-900">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={cn("h-12 w-12 rounded-full flex items-center justify-center transition-all", habit.status === "completed" ? "bg-green-500/20" : habit.status === "missed" ? "bg-red-500/20" : "bg-muted")}>
                            {getStatusIcon(habit.status)}
                          </div>
                          <div>
                            <h4 className="font-medium text-lg">{habit.title}</h4>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="h-3.5 w-3.5 text-lime-600" />
                                <span className="text-yellow-500">{habit.duration}</span>
                              </span>
                              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5 text-lime-600" />
                                <span className="text-yellow-500">{habit.type}</span>
                              </span>
                              <span className="flex items-center gap-1 text-sm text-orange-500 font-medium">
                                <Flame className="h-4 w-4" />
                                <span>{habit.streak} day streak</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={cn("text-xs", getCategoryColor(habit.category))}>
                            {habit.category}
                          </Badge>
                          
                          {habit.status === "pending" && <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button size="sm" onClick={e => {
                        e.stopPropagation();
                        completeHabit(habit.id);
                      }}>
                                Complete
                              </Button>
                              <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={e => {
                        e.stopPropagation();
                        missHabit(habit.id);
                      }}>
                                Skip
                              </Button>
                            </div>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>)}
              </div>}
          </CardContent>
        </Card>

        {/* Statistics Section - Moved to Bottom */}
        <Card>
          <CardHeader className="bg-slate-950">
            <CardTitle className="flex items-center gap-2 text-xl">
              <BarChart2 className="h-5 w-5 text-primary" />
              Habit Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-slate-950">
            <Tabs value={statisticsTab} onValueChange={setStatisticsTab}>
              <TabsList className="grid w-full grid-cols-4 mb-6 py-0 items-center ">
                <TabsTrigger value="overview" className="my-0">Overview</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="streaks">Streaks</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-4">
                <HabitStatisticsOverview habits={habits} />
              </TabsContent>
              
              <TabsContent value="trends" className="mt-4">
                <HabitStatisticsTrends habits={habits} />
              </TabsContent>
              
              <TabsContent value="categories" className="mt-4">
                <HabitStatisticsCategories habits={habits} />
              </TabsContent>
              
              <TabsContent value="streaks" className="mt-4">
                <HabitStatisticsStreaks habits={habits} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <HabitCreationDialog open={showHabitDialog} onOpenChange={setShowHabitDialog} onHabitCreate={handleCreateHabit} initialHabit={selectedHabit} />
    </ModernAppLayout>;
};
export default Habits;