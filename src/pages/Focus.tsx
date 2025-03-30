import React, { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "@/components/layout/AppLayout";
import FocusSessionHistory from "@/components/focus/FocusSessionHistory";
import FocusInsights from "@/components/focus/FocusInsights";
import FocusTechniques from "@/components/focus/FocusTechniques";
import FocusTimer from "@/components/focus/FocusTimer";
import FocusStatsCard from "@/components/focus/FocusStatsCard";

const Focus = () => {
  const [activeTab, setActiveTab] = useState("history");
  const [timerMode, setTimerMode] = useState<"focus" | "shortBreak" | "longBreak">("focus");
  const [timerDuration, setTimerDuration] = useState(25 * 60); // Default 25 minutes
  const [time, setTime] = useState({ minutes: 25, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [category, setCategory] = useState<FocusCategory>("Deep Work");
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
  
  // Keep a reference to the timer
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const updateTimerDuration = (minutes: number) => {
    setTimerDuration(minutes * 60);
    setTime({ minutes: minutes, seconds: 0 });
    setProgress(0);
    if (isRunning) {
      stopTimer();
      startTimeRef.current = null;
      pausedTimeRef.current = 0;
    }
  };

  const getInitialSeconds = (mode: string) => {
    switch (mode) {
      case "focus": return timerDuration;
      case "shortBreak": return 5 * 60; // 5 minutes
      case "longBreak": return 15 * 60; // 15 minutes
      default: return timerDuration;
    }
  };

  const resetTimer = () => {
    stopTimer();
    const initialSeconds = getInitialSeconds(timerMode);
    const minutes = Math.floor(initialSeconds / 60);
    const seconds = initialSeconds % 60;
    setTime({ minutes, seconds });
    setProgress(0);
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
  };

  const startTimer = () => {
    if (timerRef.current) return;
    
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now() - pausedTimeRef.current;
    }
    
    const totalSeconds = getInitialSeconds(timerMode);
    
    timerRef.current = window.setInterval(() => {
      const elapsedMillis = Date.now() - startTimeRef.current! + pausedTimeRef.current;
      const elapsedSeconds = Math.floor(elapsedMillis / 1000);
      const remainingSeconds = totalSeconds - elapsedSeconds;
      
      if (remainingSeconds <= 0) {
        completeTimer();
        return;
      }
      
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;
      
      setTime({ minutes, seconds });
      
      // Calculate progress
      const completedPercentage = (elapsedSeconds / totalSeconds) * 100;
      setProgress(completedPercentage);
    }, 1000);
  };
  
  const stopTimer = () => {
    if (timerRef.current) {
      if (startTimeRef.current) {
        pausedTimeRef.current = Date.now() - startTimeRef.current;
      }
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  
  const completeTimer = () => {
    stopTimer();
    
    if (timerMode === "focus") {
      // Record the completed session
      const newSession: FocusSession = {
        id: `session-${Date.now()}`,
        date: new Date(),
        duration: Math.floor(timerDuration / 60),
        category,
        xpEarned: Math.floor(timerDuration / 60)
      };
      
      setSessions(prev => [newSession, ...prev]);
      
      // Update stats
      setFocusStats(prev => ({
        ...prev,
        todayMinutes: prev.todayMinutes + newSession.duration,
        weekMinutes: prev.weekMinutes + newSession.duration,
        totalSessions: prev.totalSessions + 1,
        categoryStats: prev.categoryStats.map(stat => 
          stat.category === category 
            ? { ...stat, sessions: stat.sessions + 1 } 
            : stat
        )
      }));
    }
    
    resetTimer();
  };
  
  const toggleTimer = () => {
    if (isRunning) {
      stopTimer();
    } else {
      startTimer();
    }
    setIsRunning(!isRunning);
  };

  const handleModeChange = (mode: "focus" | "shortBreak" | "longBreak") => {
    setTimerMode(mode);
    setIsRunning(false);
    stopTimer();
    
    let newSeconds = 25 * 60;
    if (mode === "shortBreak") newSeconds = 5 * 60;
    if (mode === "longBreak") newSeconds = 15 * 60;
    
    const minutes = Math.floor(newSeconds / 60);
    const seconds = newSeconds % 60;
    
    setTime({ minutes, seconds });
    setProgress(0);
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
  };

  const handleCategoryChange = (newCategory: FocusCategory) => {
    setCategory(newCategory);
  };

  const startTechnique = (technique: FocusTechnique) => {
    setTimerMode("focus");
    updateTimerDuration(technique.duration);
    setIsRunning(true);
    setCategory(technique.name as FocusCategory);
    startTimer();
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-full">
        <div>
          <h1 className="text-4xl font-bold">Focus</h1>
          <p className="text-muted-foreground mt-2">Enhance your productivity with focused work sessions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left section - Timer */}
          <FocusTimer 
            timerMode={timerMode}
            timerDuration={timerDuration}
            time={time}
            progress={progress}
            category={category}
            isRunning={isRunning}
            onModeChange={handleModeChange}
            onDurationChange={updateTimerDuration}
            onCategoryChange={handleCategoryChange}
            onToggleTimer={toggleTimer}
            onResetTimer={resetTimer}
          />

          {/* Right section - Stats */}
          <FocusStatsCard stats={focusStats} />
        </div>

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
