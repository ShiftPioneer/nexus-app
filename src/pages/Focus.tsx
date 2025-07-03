
import React, { useState, useEffect } from "react";
import { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent } from "@/components/ui/modern-tabs";
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
import { Brain, Clock, BarChart2, Lightbulb } from "lucide-react";

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

  const tabItems = [
    { 
      value: "timer", 
      label: "Focus Timer", 
      icon: Clock,
      gradient: "from-emerald-500 via-teal-500 to-cyan-500"
    },
    { 
      value: "history", 
      label: "Session History", 
      icon: BarChart2,
      gradient: "from-blue-500 via-indigo-500 to-purple-500"
    },
    { 
      value: "insights", 
      label: "Insights", 
      icon: Brain,
      gradient: "from-purple-500 via-pink-500 to-rose-500"
    },
    { 
      value: "techniques", 
      label: "Techniques", 
      icon: Lightbulb,
      gradient: "from-orange-500 via-red-500 to-pink-500"
    }
  ];

  return (
    <div className="space-y-8 max-w-full animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          Focus
        </h1>
        <p className="text-slate-400 mt-3 text-lg">Enhance your productivity with focused work sessions</p>
      </div>

      <SessionCompletionBanner isVisible={timerProgress === 100} onComplete={handleCompleteSession} />

      <ModernTabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <ModernTabsList>
          {tabItems.map((tab) => (
            <ModernTabsTrigger 
              key={tab.value}
              value={tab.value}
              gradient={tab.gradient}
              icon={tab.icon}
            >
              {tab.label}
            </ModernTabsTrigger>
          ))}
        </ModernTabsList>
        
        <ModernTabsContent value="timer">
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
        </ModernTabsContent>
        
        <ModernTabsContent value="history">
          <FocusSessionHistory 
            sessions={prepareSessionsForHistory(focusSessions)} 
            onDeleteSession={deleteSession} 
          />
        </ModernTabsContent>
        
        <ModernTabsContent value="insights">
          <FocusStats sessions={prepareSessionsForStats(focusSessions)} />
        </ModernTabsContent>
        
        <ModernTabsContent value="techniques">
          <FocusTechniques onStartTechnique={startTechnique} />
        </ModernTabsContent>
      </ModernTabs>
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
