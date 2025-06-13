
import { useToast } from "@/hooks/use-toast";
import { useFocusTimer } from "@/components/focus/FocusTimerService";

export const useFocusHandlers = (
  focusSessions: FocusSession[],
  setFocusSessions: (value: FocusSession[] | ((val: FocusSession[]) => FocusSession[])) => void
) => {
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

  return {
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
    resetTimer
  };
};
