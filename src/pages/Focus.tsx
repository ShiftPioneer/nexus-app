
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import FocusSessionHistory from "@/components/focus/FocusSessionHistory";
import FocusInsights from "@/components/focus/FocusInsights";
import FocusTechniques from "@/components/focus/FocusTechniques";
import ModernFocusTimer from "@/components/focus/ModernFocusTimer";
import FocusStatsCard from "@/components/focus/FocusStatsCard";
import FocusStats from "@/components/focus/FocusStats";
import SessionCompletionBanner from "@/components/focus/SessionCompletionBanner";
import { FocusTimerProvider } from "@/components/focus/FocusTimerService";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useFocusStats } from "@/hooks/use-focus-stats";
import { useFocusHandlers } from "@/hooks/use-focus-handlers";
import { prepareSessionsForHistory, prepareSessionsForStats } from "@/utils/focus-session-utils";

const FocusContent = () => {
  const [activeTab, setActiveTab] = useState("timer");
  const [focusSessions, setFocusSessions] = useLocalStorage<FocusSession[]>("focusSessions", []);
  const focusStats = useFocusStats(focusSessions);
  const {
    isTimerRunning,
    timeRemaining,
    timerProgress,
    category,
    updateTimerDuration,
    handleModeChange,
    handleCategoryChange,
    toggleTimer,
    startTechnique,
    handleCompleteSession,
    deleteSession,
    resetTimer
  } = useFocusHandlers(focusSessions, setFocusSessions);

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

  return (
    <div className="space-y-6 max-w-full animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Focus</h1>
        <p className="text-muted-foreground mt-2">Enhance your productivity with focused work sessions</p>
      </div>

      <SessionCompletionBanner isVisible={timerProgress === 100} onComplete={handleCompleteSession} />

      <Tabs defaultValue="timer" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
          <TabsTrigger value="timer" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500/20 data-[state=active]:to-teal-600/20 data-[state=active]:text-white">
            Focus Timer
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-indigo-600/20 data-[state=active]:text-white">
            Session History
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-600/20 data-[state=active]:text-white">
            Insights
          </TabsTrigger>
          <TabsTrigger value="techniques" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500/20 data-[state=active]:to-red-600/20 data-[state=active]:text-white">
            Techniques
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="timer" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <ModernFocusTimer 
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
          <FocusSessionHistory 
            sessions={prepareSessionsForHistory(focusSessions)} 
            onDeleteSession={deleteSession} 
          />
        </TabsContent>
        
        <TabsContent value="insights" className="mt-6">
          <FocusStats sessions={prepareSessionsForStats(focusSessions)} />
        </TabsContent>
        
        <TabsContent value="techniques" className="mt-6">
          <FocusTechniques onStartTechnique={startTechnique} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Focus = () => {
  return (
    <ModernAppLayout>
      <FocusTimerProvider>
        <FocusContent />
      </FocusTimerProvider>
    </ModernAppLayout>
  );
};

export default Focus;
