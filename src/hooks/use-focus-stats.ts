
import { useState, useEffect } from 'react';

export const useFocusStats = (focusSessions: FocusSession[]) => {
  const [focusStats, setFocusStats] = useState<FocusStats>({
    todayMinutes: 0,
    weekMinutes: 0,
    currentStreak: 0,
    totalSessions: 0,
    categoryStats: [],
    longestSession: { duration: 0, date: new Date() },
    weeklyImprovement: 0
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

  const calculateCategoryStats = () => {
    const categoryTotals = focusSessions.reduce((acc, session) => {
      acc[session.category] = (acc[session.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(categoryTotals).map(([category, sessions]) => ({
      category: category as FocusCategory,
      sessions,
      percentage: Math.round((sessions / Math.max(focusSessions.length, 1)) * 100)
    }));
  };

  const findLongestSession = () => {
    if (focusSessions.length === 0) {
      return { duration: 0, date: new Date() };
    }
    
    const longest = focusSessions.reduce((max, session) => 
      session.duration > max.duration ? session : max
    );
    
    return {
      duration: longest.duration,
      date: new Date(longest.date)
    };
  };

  const calculateWeeklyImprovement = (): number => {
    const completedThisWeek = focusSessions.filter(session => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const sessionDate = new Date(session.date);
      return sessionDate >= weekAgo;
    });

    const thisWeekMinutes = completedThisWeek.reduce((sum, session) => sum + session.duration, 0);
    
    const lastWeekSessions = focusSessions.filter(session => {
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const sessionDate = new Date(session.date);
      return sessionDate >= twoWeeksAgo && sessionDate < weekAgo;
    });
    
    const lastWeekMinutes = lastWeekSessions.reduce((sum, session) => sum + session.duration, 0);
    
    if (lastWeekMinutes === 0) return thisWeekMinutes > 0 ? 100 : 0;
    return Math.round(((thisWeekMinutes - lastWeekMinutes) / lastWeekMinutes) * 100);
  };

  useEffect(() => {
    const completedToday = focusSessions.filter(session => {
      const today = new Date().toDateString();
      const sessionDate = new Date(session.date).toDateString();
      return sessionDate === today;
    });
    
    const completedThisWeek = focusSessions.filter(session => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const sessionDate = new Date(session.date);
      return sessionDate >= weekAgo;
    });
    
    const todayMinutes = completedToday.reduce((sum, session) => sum + session.duration, 0);
    const weekMinutes = completedThisWeek.reduce((sum, session) => sum + session.duration, 0);

    setFocusStats({
      todayMinutes,
      weekMinutes,
      currentStreak: calculateCurrentStreak(),
      totalSessions: focusSessions.length,
      categoryStats: calculateCategoryStats(),
      longestSession: findLongestSession(),
      weeklyImprovement: calculateWeeklyImprovement()
    });
  }, [focusSessions]);

  return focusStats;
};
