
import { useState, useEffect } from 'react';

interface FocusStatsCardData {
  totalSessions: number;
  totalMinutes: number;
  todayMinutes: number;
  currentStreak: number;
  weeklyGoal: number;
  completionRate: number;
}

export const useFocusStats = (focusSessions: FocusSession[]) => {
  const [focusStats, setFocusStats] = useState<FocusStatsCardData>({
    todayMinutes: 0,
    totalMinutes: 0,
    currentStreak: 0,
    totalSessions: 0,
    weeklyGoal: 150, // Default weekly goal of 150 minutes
    completionRate: 0
  });

  const calculateCurrentStreak = (): number => {
    if (focusSessions.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateString = checkDate.toDateString();
      
      const dayHasSession = focusSessions.some(session => 
        new Date(session.date).toDateString() === dateString
      );
      
      if (dayHasSession) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  };

  const calculateCompletionRate = (): number => {
    if (focusSessions.length === 0) return 0;
    
    const completedSessions = focusSessions.filter(session => session.completed);
    return Math.round((completedSessions.length / focusSessions.length) * 100);
  };

  useEffect(() => {
    const completedToday = focusSessions.filter(session => {
      const today = new Date().toDateString();
      const sessionDate = new Date(session.date).toDateString();
      return sessionDate === today;
    });
    
    const todayMinutes = completedToday.reduce((sum, session) => sum + session.duration, 0);
    const totalMinutes = focusSessions.reduce((sum, session) => sum + session.duration, 0);

    setFocusStats({
      todayMinutes,
      totalMinutes,
      currentStreak: calculateCurrentStreak(),
      totalSessions: focusSessions.length,
      weeklyGoal: 150, // Default weekly goal
      completionRate: calculateCompletionRate()
    });
  }, [focusSessions]);

  return focusStats;
};
