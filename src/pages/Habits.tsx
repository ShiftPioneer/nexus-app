import React, { useState, useEffect } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent } from "@/components/ui/modern-tabs";
import { Plus, Award, BarChart2, Filter, Search, Trophy, Target, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { UnifiedPageHeader } from "@/components/ui/unified-page-header";
import { UnifiedActionButton } from "@/components/ui/unified-action-button";
import HabitCreationDialog from "@/components/habits/HabitCreationDialog";
import ModernHabitCard from "@/components/habits/ModernHabitCard";
import HabitStreakCard from "@/components/habits/HabitStreakCard";
import WeeklyActivityCard from "@/components/habits/WeeklyActivityCard";
import ModernAnalyticsCard from "@/components/habits/ModernAnalyticsCard";
import { navigationIcons } from "@/lib/navigation-icons";

const Habits = () => {
  const { toast } = useToast();
  const [statisticsTab, setStatisticsTab] = useState("overview");
  const [showHabitDialog, setShowHabitDialog] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Use localStorage for data persistence with sample data
  const [habits, setHabits] = useLocalStorage<Habit[]>("userHabits", [
    {
      id: "habit-1",
      title: "Morning Meditation",
      category: "mindfulness",
      streak: 12,
      target: 21,
      status: "pending",
      completionDates: [
        new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      ],
      type: "daily",
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      duration: "10 minutes",
      scoreValue: 10,
      penaltyValue: 15
    },
    {
      id: "habit-2", 
      title: "Read 30 Pages",
      category: "learning",
      streak: 7,
      target: 30,
      status: "completed",
      completionDates: [
        new Date(),
        new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      ],
      type: "daily",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      duration: "45 minutes",
      scoreValue: 8,
      penaltyValue: 12
    }
  ]);
  
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
        const completedToday = habit.completionDates.some(date => 
          new Date(date).toDateString() === today.toDateString()
        );
        if (completedToday) {
          toast({
            title: "Already Completed",
            description: `${habit.title} has already been completed today.`,
            variant: "default"
          });
          return habit;
        }

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const completedYesterday = habit.completionDates.some(date => 
          new Date(date).toDateString() === yesterday.toDateString()
        );
        const newStreak = completedYesterday || habit.completionDates.length === 0 ? habit.streak + 1 : 1;
        
        return {
          ...habit,
          status: "completed" as const,
          streak: newStreak,
          completionDates: [today, ...habit.completionDates]
        };
      }
      return habit;
    }));
    
    const habit = habits.find(h => h.id === id);
    if (habit) {
      toast({
        title: "Habit Completed! 🎉",
        description: `${habit.title} completed for today. +${habit.scoreValue || 5} points!`
      });
    }
  };

  const missHabit = (id: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        return { ...habit, status: "missed" as const, streak: 0 };
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

  // Filter and search habits
  const filteredHabits = habits.filter(habit => {
    const matchesCategory = filterCategory === "all" || habit.category === filterCategory;
    const matchesSearch = habit.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ["all", ...Array.from(new Set(habits.map(h => h.category)))];

  return (
    <ModernAppLayout>
      <div className="animate-fade-in space-y-8 h-full">
        <UnifiedPageHeader
          title="Habits"
          description="Track your consistency and build unstoppable momentum"
          icon={navigationIcons.habits}
          gradient="from-purple-500 via-pink-500 to-rose-500"
        />
        <div className="flex justify-end">
          <UnifiedActionButton
            onClick={() => {
              setSelectedHabit(null);
              setShowHabitDialog(true);
            }}
            icon={Plus}
            variant="primary"
          >
            New Habit
          </UnifiedActionButton>
        </div>
        
        {/* Enhanced Accountability Score */}
        <Card className="relative overflow-hidden bg-slate-900/80 border border-slate-700/50 shadow-2xl backdrop-blur-sm">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/30 via-emerald-500/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/20 via-purple-500/15 to-transparent rounded-full blur-2xl" />
          </div>
          
          <CardHeader className="pb-6 relative z-10">
            <CardTitle className="flex items-center gap-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r from-primary via-orange-500 to-red-500 shadow-lg">
                <Trophy className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary via-orange-400 to-red-400 bg-clip-text text-transparent">
                  Accountability Score
                </span>
                <p className="text-slate-400 text-sm mt-1">Your consistency and dedication meter</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-center gap-8">
              <div className="relative">
                <div className="text-6xl font-bold bg-gradient-to-r from-primary via-orange-400 to-red-400 bg-clip-text text-transparent">
                  {accountabilityScore}
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-orange-500/20 to-red-500/20 rounded-2xl blur-xl" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-primary" />
                  <span className="text-primary font-semibold">
                    Keep building momentum to unlock new achievements!
                  </span>
                </div>
                <div className="relative w-full bg-slate-800/50 h-4 rounded-full border border-slate-700/30 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary via-orange-500 to-red-500 rounded-full transition-all duration-1000 ease-out relative" 
                    style={{ width: `${Math.min(100, accountabilityScore / 500 * 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
                  </div>
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>Getting Started</span>
                  <span>Habit Master (500)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <ModernTabs defaultValue="habits" className="space-y-8 h-full">
          <ModernTabsList>
            <ModernTabsTrigger 
              value="habits"
              icon={CheckCircle}
              gradient="from-emerald-500 via-teal-500 to-cyan-500"
            >
              Track Habits
            </ModernTabsTrigger>
            <ModernTabsTrigger 
              value="statistics"
              icon={BarChart2}
              gradient="from-purple-500 via-pink-500 to-rose-500"
            >
              Statistics
            </ModernTabsTrigger>
          </ModernTabsList>
          
          <ModernTabsContent value="habits" className="space-y-8">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search habits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select 
                  value={filterCategory} 
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm bg-slate-900 border-slate-700 text-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Habits Grid */}
            {filteredHabits.length === 0 ? (
              <Card className="border-slate-700 bg-slate-900/40">
                <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[300px]">
                  <Award className="h-16 w-16 text-slate-600 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {searchTerm || filterCategory !== "all" ? "No matching habits" : "No habits yet"}
                  </h3>
                  <p className="text-slate-400 text-center max-w-md mb-4">
                    {searchTerm || filterCategory !== "all" 
                      ? "Try adjusting your search or filter criteria."
                      : "Start by creating your first habit to track your consistency."
                    }
                  </p>
                  {!searchTerm && filterCategory === "all" && (
                    <Button 
                      onClick={() => {
                        setSelectedHabit(null);
                        setShowHabitDialog(true);
                      }}
                      className="bg-primary hover:bg-primary/90 text-white border-slate-700"
                    >
                      Create First Habit
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredHabits.map(habit => (
                  <ModernHabitCard
                    key={habit.id}
                    habit={habit}
                    onComplete={completeHabit}
                    onSkip={missHabit}
                    onEdit={handleEditHabit}
                  />
                ))}
              </div>
            )}
          </ModernTabsContent>
          
          <ModernTabsContent value="statistics" className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <HabitStreakCard habits={habits} />
              <WeeklyActivityCard habits={habits} />
            </div>

            {/* Modern Analytics Card */}
            <ModernAnalyticsCard 
              habits={habits}
              statisticsTab={statisticsTab}
              onStatisticsTabChange={setStatisticsTab}
            />
          </ModernTabsContent>
        </ModernTabs>
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
