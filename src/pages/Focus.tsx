
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RotateCcw, Play, Volume2 } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const Focus = () => {
  const [activeTab, setActiveTab] = useState("history");
  const [activeMode, setActiveMode] = useState("focus");
  const [time, setTime] = useState({ minutes: 25, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  // Timer logic
  useEffect(() => {
    let interval: number | null = null;
    
    if (isRunning) {
      interval = window.setInterval(() => {
        if (time.seconds === 0) {
          if (time.minutes === 0) {
            clearInterval(interval!);
            setIsRunning(false);
            // Timer completed
            return;
          }
          setTime(prev => ({ minutes: prev.minutes - 1, seconds: 59 }));
        } else {
          setTime(prev => ({ ...prev, seconds: prev.seconds - 1 }));
        }

        // Calculate progress (25min = 1500 seconds by default)
        const totalSeconds = getInitialSeconds(activeMode);
        const remainingSeconds = time.minutes * 60 + time.seconds;
        const completedPercentage = (1 - (remainingSeconds / totalSeconds)) * 100;
        setProgress(completedPercentage);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, time, activeMode]);

  const getInitialSeconds = (mode: string) => {
    switch (mode) {
      case "focus": return 25 * 60; // 25 minutes
      case "shortBreak": return 5 * 60; // 5 minutes
      case "longBreak": return 15 * 60; // 15 minutes
      default: return 25 * 60;
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    const initialMinutes = activeMode === "focus" ? 25 : activeMode === "shortBreak" ? 5 : 15;
    setTime({ minutes: initialMinutes, seconds: 0 });
    setProgress(0);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleModeChange = (mode: string) => {
    setActiveMode(mode);
    setIsRunning(false);
    
    let newMinutes = 25;
    if (mode === "shortBreak") newMinutes = 5;
    if (mode === "longBreak") newMinutes = 15;
    
    setTime({ minutes: newMinutes, seconds: 0 });
    setProgress(0);
  };

  // Function to format time as MM:SS
  const formatTime = () => {
    return `${time.minutes.toString().padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}`;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Focus</h1>
          <p className="text-muted-foreground mt-2">Enhance your productivity with focused work sessions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left section - Timer */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Focus Timer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mode selection */}
              <div className="bg-muted rounded-lg p-1">
                <div className="grid grid-cols-3 gap-1">
                  <Button 
                    variant={activeMode === "focus" ? "default" : "ghost"} 
                    className="w-full" 
                    onClick={() => handleModeChange("focus")}
                  >
                    Focus
                  </Button>
                  <Button 
                    variant={activeMode === "shortBreak" ? "default" : "ghost"} 
                    className="w-full" 
                    onClick={() => handleModeChange("shortBreak")}
                  >
                    Short Break
                  </Button>
                  <Button 
                    variant={activeMode === "longBreak" ? "default" : "ghost"} 
                    className="w-full" 
                    onClick={() => handleModeChange("longBreak")}
                  >
                    Long Break
                  </Button>
                </div>
              </div>

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
                        activeMode === "focus" 
                          ? "text-purple-500" 
                          : activeMode === "shortBreak" 
                            ? "text-green-500" 
                            : "text-blue-500"
                      }
                    />
                  </svg>
                  
                  {/* Timer text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold">{formatTime()}</span>
                    <span className="text-sm text-muted-foreground mt-1">
                      {activeMode === "focus" ? "Focus" : activeMode === "shortBreak" ? "Short Break" : "Long Break"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-2">
                <Button variant="outline" size="icon" onClick={resetTimer}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button onClick={toggleTimer}>
                  <Play className="h-4 w-4 mr-1" />
                  {isRunning ? "Pause" : "Start"}
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
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Focus Stats</CardTitle>
              <CardDescription>Your productivity insights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-blue-400">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M12 6V12L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                    <span>Today</span>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">95 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-green-500">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M3 10H21" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M9 4V10" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M15 4V10" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </div>
                    <span>This Week</span>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">430 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-orange-500">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">5 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-purple-500">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </div>
                    <span>Total Sessions</span>
                  </div>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">43 sessions</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Top Focus Categories</h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Deep Work</span>
                      <span>18 sessions</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Study</span>
                      <span>12 sessions</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Creative</span>
                      <span>8 sessions</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '33%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Other</span>
                      <span>5 sessions</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
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
            <Card>
              <CardHeader>
                <CardTitle>Recent Focus Sessions</CardTitle>
                <CardDescription>Your past productivity sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Session items */}
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Deep Work</p>
                        <p className="text-sm text-muted-foreground">Today, 10:30 AM</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">25 min</div>
                      <div className="text-sm font-medium bg-purple-100 text-purple-800 px-2 py-0.5 rounded">25 XP</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Deep Work</p>
                        <p className="text-sm text-muted-foreground">Today, 9:00 AM</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">50 min</div>
                      <div className="text-sm font-medium bg-purple-100 text-purple-800 px-2 py-0.5 rounded">50 XP</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Study</p>
                        <p className="text-sm text-muted-foreground">Yesterday, 7:15 PM</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">45 min</div>
                      <div className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded">45 XP</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="insights" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Focus Distribution</CardTitle>
                  <CardDescription>Focus time by time of day</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <div className="flex h-full items-end gap-2 pb-8 pt-4">
                    {/* Mock chart bars */}
                    <div className="w-1/6 bg-purple-200 hover:bg-purple-300 transition-colors rounded-t h-[10%]" />
                    <div className="w-1/6 bg-purple-200 hover:bg-purple-300 transition-colors rounded-t h-[60%]" />
                    <div className="w-1/6 bg-purple-200 hover:bg-purple-300 transition-colors rounded-t h-[20%]" />
                    <div className="w-1/6 bg-purple-200 hover:bg-purple-300 transition-colors rounded-t h-[15%]" />
                    <div className="w-1/6 bg-purple-200 hover:bg-purple-300 transition-colors rounded-t h-[40%]" />
                    <div className="w-1/6 bg-purple-200 hover:bg-purple-300 transition-colors rounded-t h-[30%]" />
                  </div>
                  <div className="flex justify-between px-2 text-xs text-muted-foreground">
                    <div>6 AM</div>
                    <div>9 AM</div>
                    <div>12 PM</div>
                    <div>3 PM</div>
                    <div>6 PM</div>
                    <div>9 PM</div>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-medium">Peak Productivity Time</h4>
                    <p className="text-sm text-muted-foreground">You're most productive between 8-10 AM</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Productivity Insights</CardTitle>
                  <CardDescription>Your focus patterns and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium">Consistency Streak</h4>
                      <p className="text-sm text-muted-foreground">
                        You've completed at least one focus session for 5 consecutive days!
                      </p>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium">Longest Focus Session</h4>
                      <p className="text-sm text-muted-foreground">
                        Your longest uninterrupted focus session was 65 minutes on Tuesday.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium">Weekly Improvement</h4>
                      <p className="text-sm text-muted-foreground">
                        You've increased your total focus time by 25% compared to last week.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium">Next Milestone</h4>
                      <p className="text-sm text-muted-foreground">
                        Complete 3 more focus sessions to unlock the "Focus Master" badge!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="techniques" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-center mb-6">
                    <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-center mb-2">Pomodoro Technique</h3>
                  <p className="text-sm text-center text-muted-foreground mb-6">
                    Work in focused 25-minute intervals with short breaks
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-sm">Difficulty</span>
                      <span className="text-sm">Beginner</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Best for</span>
                      <span className="text-sm">Avoiding procrastination</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Structure</span>
                      <span className="text-sm">25min work / 5min break</span>
                    </div>
                  </div>
                  
                  <Button className="w-full">Start Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-center mb-6">
                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.93 4.93L19.07 19.07M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-center mb-2">Deep Work</h3>
                  <p className="text-sm text-center text-muted-foreground mb-6">
                    Extended period of distraction-free concentration
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-sm">Difficulty</span>
                      <span className="text-sm">Intermediate</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Best for</span>
                      <span className="text-sm">Complex tasks</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Structure</span>
                      <span className="text-sm">90min+ focused blocks</span>
                    </div>
                  </div>
                  
                  <Button className="w-full">Start Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-center mb-6">
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 9H21M9 3V21M17 3V21M3 15H21M3 3H21V21H3V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-center mb-2">Time Blocking</h3>
                  <p className="text-sm text-center text-muted-foreground mb-6">
                    Schedule specific time blocks for different tasks
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-sm">Difficulty</span>
                      <span className="text-sm">Advanced</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Best for</span>
                      <span className="text-sm">Managing multiple priorities</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Structure</span>
                      <span className="text-sm">Customized time blocks</span>
                    </div>
                  </div>
                  
                  <Button className="w-full">Start Now</Button>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Focus Environment Tips</CardTitle>
                <CardDescription>Optimize your environment for peak focus</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">Physical Space</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                        <span className="text-sm">Clear your workspace of distractions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                        <span className="text-sm">Ensure proper lighting and comfortable seating</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                        <span className="text-sm">Maintain comfortable temperature in your workspace</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                        <span className="text-sm">Add plants or natural elements to your environment</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Digital Environment</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        <span className="text-sm">Use website blockers during focus sessions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        <span className="text-sm">Turn off notifications on all devices</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        <span className="text-sm">Close unnecessary tabs and applications</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        <span className="text-sm">Consider using ambient noise or focus music</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Mental Preparation</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-sm">Set clear intentions before starting</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-sm">Practice a 2-minute mindfulness exercise</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-sm">Use visualization to imagine successful completion</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-sm">Have water and healthy snacks nearby</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Focus;
