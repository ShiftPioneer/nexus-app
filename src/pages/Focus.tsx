import React, { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RotateCcw, Play, Pause, Volume2, Clock, Calendar } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { format } from "date-fns";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FocusSessionHistory from "@/components/focus/FocusSessionHistory";
import FocusInsights from "@/components/focus/FocusInsights";
import FocusTechniques from "@/components/focus/FocusTechniques";

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

  const startTechnique = (technique: FocusTechnique) => {
    setTimerMode("focus");
    updateTimerDuration(technique.duration);
    setIsRunning(true);
    setCategory(technique.name as FocusCategory);
    startTimer();
  };

  // Format time as MM:SS
  const formatTime = () => {
    return `${time.minutes.toString().padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}`;
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
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Focus Timer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mode selection */}
              <div className="bg-muted rounded-lg p-1">
                <div className="grid grid-cols-3 gap-1">
                  <Button 
                    variant={timerMode === "focus" ? "default" : "ghost"} 
                    className={`w-full ${timerMode === "focus" ? "bg-orange-500 hover:bg-orange-600" : ""}`}
                    onClick={() => handleModeChange("focus")}
                  >
                    Focus
                  </Button>
                  <Button 
                    variant={timerMode === "shortBreak" ? "default" : "ghost"} 
                    className={`w-full ${timerMode === "shortBreak" ? "bg-green-500 hover:bg-green-600" : ""}`}
                    onClick={() => handleModeChange("shortBreak")}
                  >
                    Short Break
                  </Button>
                  <Button 
                    variant={timerMode === "longBreak" ? "default" : "ghost"} 
                    className={`w-full ${timerMode === "longBreak" ? "bg-blue-500 hover:bg-blue-600" : ""}`}
                    onClick={() => handleModeChange("longBreak")}
                  >
                    Long Break
                  </Button>
                </div>
              </div>

              {/* Timer duration selection (only in focus mode) */}
              {timerMode === "focus" && (
                <div className="grid grid-cols-5 gap-2">
                  <Button 
                    variant={timerDuration === 25*60 ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => updateTimerDuration(25)}
                    className={timerDuration === 25*60 ? "bg-orange-500 hover:bg-orange-600" : ""}
                  >
                    25m
                  </Button>
                  <Button 
                    variant={timerDuration === 45*60 ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => updateTimerDuration(45)}
                    className={timerDuration === 45*60 ? "bg-orange-500 hover:bg-orange-600" : ""}
                  >
                    45m
                  </Button>
                  <Button 
                    variant={timerDuration === 60*60 ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => updateTimerDuration(60)}
                    className={timerDuration === 60*60 ? "bg-orange-500 hover:bg-orange-600" : ""}
                  >
                    60m
                  </Button>
                  <Button 
                    variant={timerDuration === 90*60 ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => updateTimerDuration(90)}
                    className={timerDuration === 90*60 ? "bg-orange-500 hover:bg-orange-600" : ""}
                  >
                    90m
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                  >
                    Custom
                  </Button>
                </div>
              )}
              
              {/* Category selection (only in focus mode) */}
              {timerMode === "focus" && (
                <div className="space-y-2">
                  <label className="text-sm">Focus Category</label>
                  <Select 
                    value={category} 
                    onValueChange={(val) => setCategory(val as FocusCategory)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Deep Work">Deep Work</SelectItem>
                      <SelectItem value="Study">Study</SelectItem>
                      <SelectItem value="Creative">Creative</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Timer circle */}
              <div className="flex justify-center">
                <div className="relative w-64 h-64">
                  {/* Progress circle */}
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-muted-foreground/20"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray="283"
                      strokeDashoffset={283 - (283 * progress) / 100}
                      transform="rotate(-90 50 50)"
                      className={
                        timerMode === "focus" 
                          ? "text-orange-500" 
                          : timerMode === "shortBreak" 
                            ? "text-green-500" 
                            : "text-blue-500"
                      }
                    />
                  </svg>
                  
                  {/* Timer text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold">{formatTime()}</span>
                    <span className="text-sm text-muted-foreground mt-1">
                      {timerMode === "focus" ? "Focus" : timerMode === "shortBreak" ? "Short Break" : "Long Break"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-2">
                <Button variant="outline" size="icon" onClick={resetTimer}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button onClick={toggleTimer} className="bg-orange-500 hover:bg-orange-600">
                  {isRunning ? (
                    <>
                      <Pause className="h-4 w-4 mr-1" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-1" />
                      Start
                    </>
                  )}
                </Button>
                <Button variant="outline" size="icon">
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-center text-muted-foreground">
                <p>Stay focused and productive!</p>
                <p>Complete focus sessions to earn rewards.</p>
              </div>
            </CardContent>
          </Card>

          {/* Right section - Stats */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Focus Stats</CardTitle>
              <CardDescription>Your productivity insights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-blue-400">
                      <Clock className="h-5 w-5" />
                    </div>
                    <span>Today</span>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{focusStats.todayMinutes} minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-green-500">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <span>This Week</span>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">{focusStats.weekMinutes} minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-orange-500">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 2V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M16 2V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M3 7.5H21" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M12 14L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="12" cy="14" r="2" stroke="currentColor" strokeWidth="1.5" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M19 22H5C3.895 22 3 21.105 3 20V9C3 7.895 3.895 7 5 7H19C20.105 7 21 7.895 21 9V20C21 21.105 20.105 22 19 22Z" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </div>
                    <span>Current Streak</span>
                  </div>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">{focusStats.currentStreak} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-purple-500">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </div>
                    <span>Total Sessions</span>
                  </div>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">{focusStats.totalSessions} sessions</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Top Focus Categories</h4>
                <div className="space-y-3">
                  {focusStats.categoryStats.map((stat, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between">
                        <span>{stat.category}</span>
                        <span>{stat.sessions} sessions</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            stat.category === "Deep Work" ? "bg-purple-600" :
                            stat.category === "Study" ? "bg-blue-500" :
                            stat.category === "Creative" ? "bg-orange-500" : "bg-green-500"
                          }`} 
                          style={{ width: `${stat.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
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
