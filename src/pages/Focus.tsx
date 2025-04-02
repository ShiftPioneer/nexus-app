
import React, { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "@/components/layout/AppLayout";
import FocusSessionHistory from "@/components/focus/FocusSessionHistory";
import FocusInsights from "@/components/focus/FocusInsights";
import FocusTechniques from "@/components/focus/FocusTechniques";
import FocusTimer from "@/components/focus/FocusTimer";
import FocusStatsCard from "@/components/focus/FocusStatsCard";
import { useFocusTimer } from "@/components/focus/FocusTimerService";
import { useToast } from "@/hooks/use-toast";

const Focus = () => {
  const [activeTab, setActiveTab] = useState("history");
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
  
  const [focusStats, setFocusStats] = useState<FocusStats>({
    todayMinutes: 95,
    weekMinutes: 430,
    currentStreak: 5,
    totalSessions: 43,
    categoryStats: [
      { category: "Deep Work", sessions: 18, percentage: 75 },
      { category: "Study", sessions: 12, percentage: 50 },
      { category: "Creative", sessions: 8, percentage: 33 },
      { category: "Other", sessions: 5, percentage: 20 }
    ],
    longestSession: {
      duration: 65,
      date: new Date(2023, 4, 16) // Tuesday last week
    },
    weeklyImprovement: 25
  });
  
  const [sessions, setSessions] = useState<FocusSession[]>([
    {
      id: "1",
      date: new Date(),
      duration: 25,
      category: "Deep Work",
      xpEarned: 25
    },
    {
      id: "2",
      date: new Date(),
      duration: 50,
      category: "Deep Work",
      xpEarned: 50
    },
    {
      id: "3",
      date: new Date(Date.now() - 86400000), // yesterday
      duration: 45,
      category: "Study",
      xpEarned: 45
    }
  ]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isTimerRunning) {
        // Message displayed to the user when they try to leave
        e.preventDefault();
        e.returnValue = "You have an active focus session. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isTimerRunning]);

  const updateTimerDuration = (minutes: number) => {
    resetTimer();
    startTimer(minutes, category);
  };

  const handleModeChange = (mode: "focus" | "shortBreak" | "longBreak") => {
    resetTimer();
    
    let minutes = 25;
    let newCategory = "Focus";
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

  // Complete timer and record session handler
  const handleCompleteSession = () => {
    const sessionDuration = Math.round(timerProgress * timeRemaining.minutes / 100);
    
    if (sessionDuration > 0) {
      const newSession: FocusSession = {
        id: `session-${Date.now()}`,
        date: new Date(),
        duration: sessionDuration,
        category: category as FocusCategory,
        xpEarned: sessionDuration
      };
      
      setSessions(prev => [newSession, ...prev]);
      
      // Update stats
      setFocusStats(prev => ({
        ...prev,
        todayMinutes: prev.todayMinutes + sessionDuration,
        weekMinutes: prev.weekMinutes + sessionDuration,
        totalSessions: prev.totalSessions + 1,
        categoryStats: prev.categoryStats.map(stat => 
          stat.category === category 
            ? { ...stat, sessions: stat.sessions + 1 } 
            : stat
        )
      }));
      
      toast({
        title: "Session Recorded",
        description: `Your ${sessionDuration} minute ${category} session has been recorded.`,
      });
      
      resetTimer();
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-full animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold">Focus</h1>
          <p className="text-muted-foreground mt-2">Enhance your productivity with focused work sessions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left section - Timer */}
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

          {/* Right section - Stats */}
          <FocusStatsCard stats={focusStats} />
        </div>

        {/* Completion confirmation when timer is done */}
        {timerProgress === 100 && (
          <div className="bg-green-100 dark:bg-green-900 border border-green-500 rounded-md p-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-green-800 dark:text-green-100">Focus Session Completed!</h3>
              <p className="text-sm text-green-600 dark:text-green-300">
                Great job! You've completed your focus session.
              </p>
            </div>
            <button 
              onClick={handleCompleteSession}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
            >
              Record Session
            </button>
          </div>
        )}

        {/* Tabs section */}
        <Tabs defaultValue="history" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted">
            <TabsTrigger value="history">Session History</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="techniques">Techniques</TabsTrigger>
          </TabsList>
          
          <TabsContent value="history" className="mt-6">
            <FocusSessionHistory sessions={sessions} />
          </TabsContent>
          
          <TabsContent value="insights" className="mt-6">
            <FocusInsights stats={focusStats} />
          </TabsContent>
          
          <TabsContent value="techniques" className="mt-6">
            <FocusTechniques onStartTechnique={startTechnique} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Focus;
