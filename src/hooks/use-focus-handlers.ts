import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useFocusHandlers = () => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<FocusSession[]>(() => {
    const saved = localStorage.getItem('focusSessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentSession, setCurrentSession] = useState<FocusSession | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    localStorage.setItem('focusSessions', JSON.stringify(sessions));
  }, [sessions]);

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const startSession = useCallback((duration: number, category: FocusCategory, notes?: string) => {
    const newSession: FocusSession = {
      id: Date.now().toString(),
      date: new Date(),
      duration: duration,
      category: category,
      completed: false,
      xpEarned: 0,
      notes: notes || ""
    };
    setCurrentSession(newSession);
    setIsActive(true);
    setTimeLeft(duration * 60);
    setTotalTime(duration * 60);

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

  const completeSession = useCallback(() => {
    if (currentSession) {
      const completedSession: FocusSession = {
        ...currentSession,
        duration: Math.round((totalTime - timeLeft) / 60),
        completed: true,
        xpEarned: Math.round((totalTime - timeLeft) / 60) * 10,
        notes: currentSession.notes || ""
      };

      setSessions(prev => [...prev, completedSession]);
      
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
  }, [currentSession, totalTime, timeLeft, toast]);

  return {
    sessions,
    currentSession,
    isActive,
    timeLeft,
    totalTime,
    startSession,
    pauseSession,
    stopSession,
    completeSession,
    formatTime
  };
};
