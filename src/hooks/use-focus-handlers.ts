import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useFocusHandlers = (setFocusSessions?: React.Dispatch<React.SetStateAction<FocusSession[]>>) => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<FocusSession[]>(() => {
    const saved = localStorage.getItem('focusSessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentSession, setCurrentSession] = useState<FocusSession | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [category, setCategory] = useState<FocusCategory>('Deep Work');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Use external setFocusSessions if provided, otherwise use internal setSessions
  const updateSessions = setFocusSessions || setSessions;

  useEffect(() => {
    localStorage.setItem('focusSessions', JSON.stringify(sessions));
  }, [sessions]);

  const completeSession = useCallback(() => {
    if (currentSession) {
      const completedSession: FocusSession = {
        ...currentSession,
        duration: Math.round((totalTime - timeLeft) / 60),
        completed: true,
        xpEarned: Math.round((totalTime - timeLeft) / 60) * 10,
        notes: currentSession.notes || ""
      };

      updateSessions(prev => [...prev, completedSession]);
      
      toast({
        title: "Session Complete!",
        description: `Great job! You earned ${completedSession.xpEarned} XP.`,
      });

      // Reset state
      setCurrentSession(null);
      setIsActive(false);
      setTimeLeft(0);
      setTotalTime(0);
    }
  }, [currentSession, totalTime, timeLeft, toast, updateSessions]);

  const startSession = useCallback((duration: number, sessionCategory: FocusCategory, notes?: string) => {
    const newSession: FocusSession = {
      id: Date.now().toString(),
      date: new Date(),
      duration: duration,
      category: sessionCategory,
      completed: false,
      xpEarned: 0,
      notes: notes || ""
    };
    setCurrentSession(newSession);
    setIsActive(true);
    setTimeLeft(duration * 60);
    setTotalTime(duration * 60);
    setCategory(sessionCategory);

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 0) {
          clearInterval(intervalRef.current as NodeJS.Timeout);
          completeSession();
          return 0;
        } else {
          return prevTime - 1;
        }
      });
    }, 1000);
  }, [completeSession]);

  const pauseSession = useCallback(() => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const stopSession = useCallback(() => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setCurrentSession(null);
    setTimeLeft(0);
    setTotalTime(0);
  }, []);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTimeLeft(totalTime);
  }, [totalTime]);

  const toggleTimer = useCallback(() => {
    if (isActive) {
      pauseSession();
    } else {
      setIsActive(true);
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 0) {
            clearInterval(intervalRef.current as NodeJS.Timeout);
            completeSession();
            return 0;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);
    }
  }, [isActive, pauseSession, completeSession]);

  const handleModeChange = useCallback((mode: "focus" | "shortBreak" | "longBreak") => {
    if (mode === "focus") {
      setCategory('Deep Work');
    } else if (mode === "shortBreak") {
      setCategory('Deep Work');
    } else {
      setCategory('Deep Work');
    }
  }, []);

  const handleCategoryChange = useCallback((newCategory: FocusCategory) => {
    setCategory(newCategory);
  }, []);

  const updateTimerDuration = useCallback((minutes: number) => {
    const newDuration = minutes * 60;
    setTimeLeft(newDuration);
    setTotalTime(newDuration);
  }, []);

  const startTechnique = useCallback((technique: any) => {
    const duration = technique.duration || 25;
    startSession(duration, 'Deep Work', `Using ${technique.name} technique`);
  }, [startSession]);

  const handleCompleteSession = useCallback(() => {
    completeSession();
  }, [completeSession]);

  const deleteSession = useCallback((sessionId: string) => {
    updateSessions(prev => prev.filter(session => session.id !== sessionId));
  }, [updateSessions]);

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate timer properties
  const timeRemaining = {
    minutes: Math.floor(timeLeft / 60),
    seconds: timeLeft % 60
  };

  const timerProgress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
  const isTimerRunning = isActive;

  return {
    sessions,
    currentSession,
    isActive,
    isTimerRunning,
    timeLeft,
    timeRemaining,
    totalTime,
    timerProgress,
    category,
    startSession,
    pauseSession,
    stopSession,
    completeSession,
    resetTimer,
    toggleTimer,
    handleModeChange,
    handleCategoryChange,
    updateTimerDuration,
    startTechnique,
    handleCompleteSession,
    deleteSession,
    formatTime
  };
};
