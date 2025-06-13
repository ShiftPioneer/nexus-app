
import React, { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import FocusSessionHistory from "@/components/focus/FocusSessionHistory";
import FocusInsights from "@/components/focus/FocusInsights";
import FocusTechniques from "@/components/focus/FocusTechniques";
import FocusTimer from "@/components/focus/FocusTimer";
import FocusStatsCard from "@/components/focus/FocusStatsCard";
import FocusStats from "@/components/focus/FocusStats";
import { useFocusTimer } from "@/components/focus/FocusTimerService";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";

const Focus = () => {
  const [activeTab, setActiveTab] = useState("timer");
  const [focusSessions, setFocusSessions] = useLocalStorage<FocusSession[]>("focusSessions", []);
  const { 
    isTimerRunning, 
    timeRemaining, 
    timerProgress, 
    category,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer
  } = useFocusTimer();
  const { toast } = useToast();
  
  // Calculate dynamic stats from real sessions
  const completedToday = focusSessions.filter(session => {
    const today = new Date().toDateString();
    const sessionDate = new Date(session.date).toDateString();
    return sessionDate === today;
  });
  
  const completedThisWeek = focusSessions.filter(session => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const sessionDate = new Date(session.date);
    return sessionDate >= weekAgo;
  });
  
  const todayMinutes = completedToday.reduce((sum, session) => sum + session.duration, 0);
  const weekMinutes = completedThisWeek.reduce((sum, session) => sum + session.duration, 0);
  const currentStreak = calculateCurrentStreak();
  const totalSessions = focusSessions.length;
  
  function calculateCurrentStreak(): number {
    if (focusSessions.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateString = checkDate.toDateString();
      
      const dayHasSession = focusSessions.some(session => 
        new Date(session.date).toDateString() === dateString
      );
      
      if (dayHasSession) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  }
  
  const [focusStats, setFocusStats] = useState<FocusStats>({
    todayMinutes,
    weekMinutes,
    currentStreak,
    totalSessions,
    categoryStats: calculateCategoryStats(),
    longestSession: findLongestSession(),
    weeklyImprovement: calculateWeeklyImprovement()
  });
  
  function calculateCategoryStats() {
    const categoryTotals = focusSessions.reduce((acc, session) => {
      acc[session.category] = (acc[session.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(categoryTotals).map(([category, sessions]) => ({
      category: category as FocusCategory,
      sessions,
      percentage: Math.round((sessions / Math.max(totalSessions, 1)) * 100)
    }));
  }
  
  function findLongestSession() {
    if (focusSessions.length === 0) {
      return { duration: 0, date: new Date() };
    }
    
    const longest = focusSessions.reduce((max, session) => 
      session.duration > max.duration ? session : max
    );
    
    return {
      duration: longest.duration,
      date: new Date(longest.date)
    };
  }
  
  function calculateWeeklyImprovement(): number {
    const thisWeekMinutes = weekMinutes;
    const lastWeekSessions = focusSessions.filter(session => {
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const sessionDate = new Date(session.date);
      return sessionDate >= twoWeeksAgo && sessionDate < weekAgo;
    });
    
    const lastWeekMinutes = lastWeekSessions.reduce((sum, session) => sum + session.duration, 0);
    
    if (lastWeekMinutes === 0) return thisWeekMinutes > 0 ? 100 : 0;
    return Math.round(((thisWeekMinutes - lastWeekMinutes) / lastWeekMinutes) * 100);
  }
  
  // Update stats when sessions change
  useEffect(() => {
    setFocusStats({
      todayMinutes: completedToday.reduce((sum, session) => sum + session.duration, 0),
      weekMinutes: completedThisWeek.reduce((sum, session) => sum + session.duration, 0),
      currentStreak: calculateCurrentStreak(),
      totalSessions: focusSessions.length,
      categoryStats: calculateCategoryStats(),
      longestSession: findLongestSession(),
      weeklyImprovement: calculateWeeklyImprovement()
    });
  }, [focusSessions]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isTimerRunning) {
        e.preventDefault();
        e.returnValue = "You have an active focus session. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isTimerRunning]);

  const updateTimerDuration = (minutes: number) => {
    resetTimer();
    startTimer(minutes, category);
  };

  const handleModeChange = (mode: "focus" | "shortBreak" | "longBreak") => {
    resetTimer();
    
    let minutes = 25;
    let newCategory = "Deep Work";
    if (mode === "shortBreak") {
      minutes = 5;
      newCategory = "Short Break";
    } else if (mode === "longBreak") {
      minutes = 15;
      newCategory = "Long Break";
    }
    
    startTimer(minutes, newCategory);
  };

  const handleCategoryChange = (newCategory: FocusCategory) => {
    if (isTimerRunning) {
      toast({
        title: "Category Change",
        description: `Changed category to ${newCategory}`,
      });
    }
    startTimer(timeRemaining.minutes, newCategory);
  };

  const toggleTimer = () => {
    if (isTimerRunning) {
      pauseTimer();
    } else {
      if (timerProgress > 0) {
        resumeTimer();
      } else {
        startTimer(timeRemaining.minutes, category);
      }
    }
  };

  const startTechnique = (technique: FocusTechnique) => {
    startTimer(technique.duration, technique.name as FocusCategory);
  };

  const handleCompleteSession = () => {
    const sessionDuration = Math.round(timerProgress * timeRemaining.minutes / 100);
    
    if (sessionDuration > 0) {
      const newSession: FocusSession = {
        id: `session-${Date.now()}`,
        date: new Date(),
        duration: sessionDuration,
        category: category as FocusCategory,
        xpEarned: sessionDuration,
        notes: `${category} session completed`
      };
      
      setFocusSessions(prev => [newSession, ...prev]);
      
      toast({
        title: "Session Completed! 🎉",
        description: `Your ${sessionDuration} minute ${category} session has been recorded. +${sessionDuration} XP earned!`,
      });
      
      resetTimer();
    }
  };

  // Convert sessions for components that expect string dates
  const sessionsForHistory = focusSessions.map(session => ({
    ...session,
    date: typeof session.date === 'string' ? session.date : session.date.toISOString()
  }));

  const sessionsForStats = focusSessions.map(session => ({
    ...session,
    date: typeof session.date === 'string' ? session.date : session.date.toISOString(),
    completed: true
  }));

  return (
    <ModernAppLayout>
      <div className="space-y-6 max-w-full animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Focus</h1>
          <p className="text-muted-foreground mt-2">Enhance your productivity with focused work sessions</p>
        </div>

        {/* Completion confirmation when timer is done */}
        {timerProgress === 100 && (
          <div className="bg-green-100 dark:bg-green-900 border border-green-500 rounded-lg p-4 flex items-center justify-between animate-fade-in">
            <div>
              <h3 className="text-lg font-medium text-green-800 dark:text-green-100">Focus Session Completed! 🎉</h3>
              <p className="text-sm text-green-600 dark:text-green-300">
                Great job! You've completed your focus session.
              </p>
            </div>
            <button 
              onClick={handleCompleteSession}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            >
              Record Session
            </button>
          </div>
        )}

        <Tabs defaultValue="timer" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted">
            <TabsTrigger value="timer">Focus Timer</TabsTrigger>
            <TabsTrigger value="history">Session History</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="techniques">Techniques</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timer" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <FocusTimer 
                timerMode={category === "Short Break" ? "shortBreak" : category === "Long Break" ? "longBreak" : "focus"}
                timerDuration={timeRemaining.minutes * 60 + timeRemaining.seconds}
                time={timeRemaining}
                progress={timerProgress}
                category={category as FocusCategory}
                isRunning={isTimerRunning}
                onModeChange={handleModeChange}
                onDurationChange={updateTimerDuration}
                onCategoryChange={handleCategoryChange}
                onToggleTimer={toggleTimer}
                onResetTimer={resetTimer}
              />
              <FocusStatsCard stats={focusStats} />
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <FocusSessionHistory sessions={sessionsForHistory} />
          </TabsContent>
          
          <TabsContent value="insights" className="mt-6">
            <FocusStats sessions={sessionsForStats} />
          </TabsContent>
          
          <TabsContent value="techniques" className="mt-6">
            <FocusTechniques onStartTechnique={startTechnique} />
          </TabsContent>
        </Tabs>
      </div>
    </ModernAppLayout>
  );
};

export default Focus;
