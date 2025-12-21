import React, { useState, useEffect } from "react";
import { useHabitsStorage } from "@/hooks/use-habits-storage";
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
import { EmptyState } from "@/components/ui/empty-state";
import HabitCreationDialog from "@/components/habits/HabitCreationDialog";
import ModernHabitCard from "@/components/habits/ModernHabitCard";
import HabitStreakCard from "@/components/habits/HabitStreakCard";
import WeeklyActivityCard from "@/components/habits/WeeklyActivityCard";
import ModernAnalyticsCard from "@/components/habits/ModernAnalyticsCard";
import { navigationIcons } from "@/lib/navigation-icons";
const Habits = () => {
  const {
    toast
  } = useToast();
  const [statisticsTab, setStatisticsTab] = useState("overview");
  const [showHabitDialog, setShowHabitDialog] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Use improved habits storage
  const {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    markHabitComplete,
    markHabitMissed
  } = useHabitsStorage();
  const [accountabilityScore, setAccountabilityScore] = useLocalStorage("accountabilityScore", 0);

  // Calculate real accountability score based on streaks, completions, and multi-daily progress
  useEffect(() => {
    const score = habits.reduce((total, habit) => {
      const dailyTarget = habit.dailyTarget || 1;
      const todayCompletions = habit.todayCompletions || 0;

      // Streak bonus (weighted by score value)
      const streakBonus = habit.streak * (habit.scoreValue || 5);

      // Completion history bonus
      const historyBonus = (habit.completionHistory || []).reduce((sum, h) => {
        // Bonus for each full completion day
        return sum + (h.count >= dailyTarget ? 5 : h.count);
      }, 0);

      // Today's partial progress bonus
      const todayBonus = Math.floor(todayCompletions / dailyTarget * (habit.scoreValue || 5));

      // Penalty for missed habits
      const penaltyDeduction = habit.status === "missed" ? habit.penaltyValue || 10 : 0;
      return total + streakBonus + historyBonus + todayBonus - penaltyDeduction;
    }, 0);
    setAccountabilityScore(Math.max(0, score));
  }, [habits, setAccountabilityScore]);

  // Check and reset habit statuses daily
  useEffect(() => {
    const today = new Date().toDateString();
    const lastCheck = localStorage.getItem('lastHabitCheck');
    if (lastCheck !== today) {
      habits.forEach(habit => {
        if (habit.type === "daily") {
          // Reset todayCompletions and status for a new day
          updateHabit(habit.id, {
            todayCompletions: 0,
            status: "pending"
          });
        }
      });
      localStorage.setItem('lastHabitCheck', today);
    }
  }, [habits, updateHabit]);
  const handleCreateHabit = (habit: Habit) => {
    if (selectedHabit) {
      updateHabit(habit.id, habit);
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
      addHabit(newHabit);
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
    const habit = habits.find(h => h.id === id);
    if (habit) {
      const dailyTarget = habit.dailyTarget || 1;
      const todayCompletions = habit.todayCompletions || 0;
      if (todayCompletions >= dailyTarget) {
        toast({
          title: "Already Completed",
          description: `${habit.title} has already been fully completed today (${dailyTarget}/${dailyTarget}).`,
          variant: "default"
        });
        return;
      }
      markHabitComplete(id);
      const newCompletions = todayCompletions + 1;
      const isFullyComplete = newCompletions >= dailyTarget;
      toast({
        title: isFullyComplete ? "Habit Fully Completed! 🎉" : `Progress: ${newCompletions}/${dailyTarget}`,
        description: isFullyComplete ? `${habit.title} completed for today. +${habit.scoreValue || 5} points!` : `${habit.title}: ${dailyTarget - newCompletions} more to go today.`
      });
    }
  };
  const missHabit = (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (habit) {
      markHabitMissed(id);
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
  return <ModernAppLayout>
      <div className="page-container">
        <div className="page-content">
        <UnifiedPageHeader title="Habits" description="Track your consistency and build unstoppable momentum" icon={navigationIcons.habits} gradient="from-purple-500 via-pink-500 to-rose-500" />
        <div className="flex justify-end">
          <UnifiedActionButton onClick={() => {
            setSelectedHabit(null);
            setShowHabitDialog(true);
          }} icon={Plus} variant="primary">
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
                  <div className="h-full bg-gradient-to-r from-primary via-orange-500 to-red-500 rounded-full transition-all duration-1000 ease-out relative" style={{
                    width: `${Math.min(100, accountabilityScore / 500 * 100)}%`
                  }}>
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
            <ModernTabsTrigger value="habits" icon={CheckCircle} gradient="from-emerald-500 via-teal-500 to-cyan-500">
              Track Habits
            </ModernTabsTrigger>
            <ModernTabsTrigger value="statistics" icon={BarChart2} gradient="from-purple-500 via-pink-500 to-rose-500">
              Statistics
            </ModernTabsTrigger>
          </ModernTabsList>
          
          <ModernTabsContent value="habits" className="space-y-8">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Search habits..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 bg-slate-900 border-slate-700 text-white mx-[10px]" />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="px-3 py-2 border rounded-md text-sm bg-slate-900 border-slate-700 text-white">
                   {categories.map(cat => <option key={cat} value={cat}>
                       {cat === "all" ? "All Categories" : String(cat).charAt(0).toUpperCase() + String(cat).slice(1)}
                     </option>)}
                </select>
              </div>
            </div>

            {/* Habits Grid */}
            {filteredHabits.length === 0 ? <EmptyState icon={Award} title={searchTerm || filterCategory !== "all" ? "No matching habits" : "No habits yet"} description={searchTerm || filterCategory !== "all" ? "Try adjusting your search or filter criteria." : "Start by creating your first habit to track your consistency."} action={!searchTerm && filterCategory === "all" ? <UnifiedActionButton onClick={() => {
              setSelectedHabit(null);
              setShowHabitDialog(true);
            }} icon={Plus} variant="primary">
                      Create First Habit
                    </UnifiedActionButton> : undefined} /> : <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredHabits.map(habit => <ModernHabitCard key={habit.id} habit={habit} onComplete={completeHabit} onSkip={missHabit} onEdit={handleEditHabit} />)}
              </div>}
          </ModernTabsContent>
          
          <ModernTabsContent value="statistics" className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <HabitStreakCard habits={habits} />
              <WeeklyActivityCard habits={habits} />
            </div>

            {/* Modern Analytics Card */}
            <ModernAnalyticsCard habits={habits} statisticsTab={statisticsTab} onStatisticsTabChange={setStatisticsTab} />
          </ModernTabsContent>
        </ModernTabs>
        </div>
      </div>
      
      <HabitCreationDialog open={showHabitDialog} onOpenChange={setShowHabitDialog} onHabitCreate={handleCreateHabit} initialHabit={selectedHabit} />
    </ModernAppLayout>;
};
export default Habits;