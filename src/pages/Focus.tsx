
import React, { useState, useEffect } from "react";
import { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent } from "@/components/ui/modern-tabs";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { UnifiedPageHeader } from "@/components/ui/unified-page-header";
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
  const [timerMode, setTimerMode] = useState<"focus" | "shortBreak" | "longBreak">("focus");
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
  } = useFocusHandlers(setFocusSessions);

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

  const handleModeChangeLocal = (mode: "focus" | "shortBreak" | "longBreak") => {
    setTimerMode(mode);
    handleModeChange(mode);
  };

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
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
      count: focusSessions.length
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
    <div className="page-container">
      <div className="page-content">
        <UnifiedPageHeader
        title="Focus"
        description="Enhance your productivity with focused work sessions and proven techniques"
        icon={Brain}
        gradient="from-indigo-500 via-purple-500 to-pink-500"
      />

      <SessionCompletionBanner isVisible={timerProgress === 100} onComplete={handleCompleteSession} />

      <ModernTabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <ModernTabsList className="grid w-full grid-cols-4 max-w-4xl mx-auto">
          {tabItems.map((tab) => (
            <ModernTabsTrigger 
              key={tab.value}
              value={tab.value}
              gradient={tab.gradient}
              icon={tab.icon}
              count={tab.count}
              className="flex-1"
            >
              {tab.label}
            </ModernTabsTrigger>
          ))}
        </ModernTabsList>
        
        <ModernTabsContent value="timer" className="mt-8">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <div className="xl:col-span-3">
              <ModernFocusTimer 
                timerMode={timerMode}
                timerDuration={timeRemaining.minutes * 60 + timeRemaining.seconds}
                time={timeRemaining}
                progress={timerProgress}
                category={category}
                isRunning={isTimerRunning}
                onModeChange={handleModeChangeLocal}
                onDurationChange={updateTimerDuration}
                onCategoryChange={handleCategoryChange}
                onToggleTimer={toggleTimer}
                onResetTimer={resetTimer}
              />
            </div>
            <div className="xl:col-span-1">
              <FocusStatsCard stats={focusStats} />
            </div>
          </div>
        </ModernTabsContent>
        
          <ModernTabsContent value="history" className="mt-8 max-w-6xl mx-auto">
            <FocusSessionHistory
              sessions={prepareSessionsForHistory(focusSessions)} 
              onDeleteSession={deleteSession} 
            />
          </ModernTabsContent>
        
        <ModernTabsContent value="insights" className="mt-8 max-w-6xl mx-auto">
            <FocusStats sessions={prepareSessionsForStats(focusSessions)} />
        </ModernTabsContent>
        
        <ModernTabsContent value="techniques" className="mt-8 max-w-4xl mx-auto">
            <FocusTechniques onStartTechnique={startTechnique} />
          </ModernTabsContent>
        </ModernTabs>
      </div>
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
