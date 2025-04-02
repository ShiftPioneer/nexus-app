
import { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";

interface FocusTimerContextType {
  isTimerRunning: boolean;
  timeRemaining: { minutes: number; seconds: number };
  timerProgress: number;
  category: string;
  startTimer: (minutes: number, category: string, taskId?: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
}

const FocusTimerContext = createContext<FocusTimerContextType | undefined>(undefined);

export const useFocusTimer = () => {
  const context = useContext(FocusTimerContext);
  if (!context) {
    throw new Error('useFocusTimer must be used within a FocusTimerProvider');
  }
  return context;
};

export const FocusTimerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({ minutes: 25, seconds: 0 });
  const [timerProgress, setTimerProgress] = useState(0);
  const [category, setCategory] = useState('Deep Work');
  const [timerId, setTimerId] = useState<number | null>(null);
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [taskId, setTaskId] = useState<string | undefined>(undefined);
  
  const { toast } = useToast();

  const startTimer = (minutes: number, newCategory: string, newTaskId?: string) => {
    if (timerId) {
      window.clearInterval(timerId);
    }

    const totalSecs = minutes * 60;
    setTotalSeconds(totalSecs);
    setElapsedSeconds(0);
    setTimeRemaining({ minutes, seconds: 0 });
    setCategory(newCategory);
    setTaskId(newTaskId);
    setIsTimerRunning(true);
    setTimerProgress(0);
    
    const startTime = Date.now();
    
    const id = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = totalSecs - elapsed;
      
      if (remaining <= 0) {
        completeTimer();
        return;
      }
      
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      
      setTimeRemaining({ minutes: mins, seconds: secs });
      setElapsedSeconds(elapsed);
      setTimerProgress((elapsed / totalSecs) * 100);
    }, 1000);
    
    setTimerId(id);
    
    toast({
      title: "Focus Timer Started",
      description: `${minutes} minute ${newCategory} session has started.`,
    });
  };

  const pauseTimer = () => {
    if (timerId) {
      window.clearInterval(timerId);
      setTimerId(null);
      setIsTimerRunning(false);
      
      toast({
        title: "Focus Timer Paused",
        description: "Your focus session has been paused.",
      });
    }
  };

  const resumeTimer = () => {
    if (!isTimerRunning) {
      const remainingSecs = (timeRemaining.minutes * 60) + timeRemaining.seconds;
      const newTotalSecs = elapsedSeconds + remainingSecs;
      
      const startTime = Date.now() - (elapsedSeconds * 1000);
      
      const id = window.setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = totalSeconds - elapsed;
        
        if (remaining <= 0) {
          completeTimer();
          return;
        }
        
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        
        setTimeRemaining({ minutes: mins, seconds: secs });
        setElapsedSeconds(elapsed);
        setTimerProgress((elapsed / totalSeconds) * 100);
      }, 1000);
      
      setTimerId(id);
      setIsTimerRunning(true);
      
      toast({
        title: "Focus Timer Resumed",
        description: "Your focus session has been resumed.",
      });
    }
  };

  const stopTimer = () => {
    if (timerId) {
      window.clearInterval(timerId);
      setTimerId(null);
      setIsTimerRunning(false);
      
      toast({
        title: "Focus Timer Stopped",
        description: "Your focus session has been stopped.",
      });
    }
  };

  const resetTimer = () => {
    if (timerId) {
      window.clearInterval(timerId);
      setTimerId(null);
    }
    
    setTimeRemaining({ minutes: 25, seconds: 0 });
    setTimerProgress(0);
    setElapsedSeconds(0);
    setIsTimerRunning(false);
    
    toast({
      title: "Focus Timer Reset",
      description: "Your focus timer has been reset.",
    });
  };
  
  const completeTimer = () => {
    if (timerId) {
      window.clearInterval(timerId);
      setTimerId(null);
    }
    
    setTimeRemaining({ minutes: 0, seconds: 0 });
    setTimerProgress(100);
    setIsTimerRunning(false);
    
    toast({
      title: "Focus Session Completed",
      description: `You've completed your ${Math.round(totalSeconds / 60)} minute focus session!`,
    });
    
    // Here you would handle the logic for recording the completed session
    // and updating any related data in the Tasks and Focus pages
  };

  return (
    <FocusTimerContext.Provider
      value={{
        isTimerRunning,
        timeRemaining,
        timerProgress,
        category,
        startTimer,
        pauseTimer,
        resumeTimer,
        stopTimer,
        resetTimer
      }}
    >
      {children}
    </FocusTimerContext.Provider>
  );
};
