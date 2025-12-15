/**
 * NEXUS Gamification Hook
 * Manages XP, levels, and achievement tracking
 */

import { useState, useEffect, useCallback } from "react";
import { useLocalStorage } from "./use-local-storage";

interface GamificationState {
  currentXP: number;
  level: number;
  totalXP: number;
  streakDays: number;
  lastActivityDate: string | null;
  achievements: string[];
}

const XP_PER_LEVEL = 100; // XP needed per level
const XP_REWARDS = {
  taskComplete: 10,
  habitComplete: 15,
  goalProgress: 5,
  journalEntry: 20,
  streakBonus: 5,
  dailyLogin: 5,
};

export const useGamification = () => {
  const [state, setState] = useLocalStorage<GamificationState>("nexus-gamification", {
    currentXP: 0,
    level: 1,
    totalXP: 0,
    streakDays: 0,
    lastActivityDate: null,
    achievements: [],
  });

  const [levelUp, setLevelUp] = useState<number | null>(null);

  // Calculate level thresholds
  const getLevelXP = (level: number) => (level - 1) * XP_PER_LEVEL;
  const getNextLevelXP = (level: number) => level * XP_PER_LEVEL;

  // Add XP and handle level ups
  const addXP = useCallback((amount: number, source?: string) => {
    setState((prev) => {
      const newTotalXP = prev.totalXP + amount;
      const newCurrentXP = prev.currentXP + amount;
      
      // Check for level up
      let newLevel = prev.level;
      let xpForLevel = newCurrentXP;
      
      while (xpForLevel >= getNextLevelXP(newLevel)) {
        xpForLevel -= XP_PER_LEVEL;
        newLevel++;
      }

      if (newLevel > prev.level) {
        setLevelUp(newLevel);
        // Auto-clear level up notification after 3 seconds
        setTimeout(() => setLevelUp(null), 3000);
      }

      return {
        ...prev,
        currentXP: xpForLevel,
        totalXP: newTotalXP,
        level: newLevel,
      };
    });
  }, [setState]);

  // Update streak
  const updateStreak = useCallback(() => {
    const today = new Date().toDateString();
    
    setState((prev) => {
      if (prev.lastActivityDate === today) {
        return prev; // Already updated today
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const wasActiveYesterday = prev.lastActivityDate === yesterday.toDateString();

      return {
        ...prev,
        streakDays: wasActiveYesterday ? prev.streakDays + 1 : 1,
        lastActivityDate: today,
      };
    });
  }, [setState]);

  // Reward functions
  const rewardTaskComplete = useCallback(() => {
    addXP(XP_REWARDS.taskComplete, "task_complete");
    updateStreak();
  }, [addXP, updateStreak]);

  const rewardHabitComplete = useCallback(() => {
    addXP(XP_REWARDS.habitComplete, "habit_complete");
    updateStreak();
  }, [addXP, updateStreak]);

  const rewardJournalEntry = useCallback(() => {
    addXP(XP_REWARDS.journalEntry, "journal_entry");
    updateStreak();
  }, [addXP, updateStreak]);

  const rewardGoalProgress = useCallback(() => {
    addXP(XP_REWARDS.goalProgress, "goal_progress");
    updateStreak();
  }, [addXP, updateStreak]);

  // Check for daily login bonus
  useEffect(() => {
    const today = new Date().toDateString();
    if (state.lastActivityDate !== today) {
      addXP(XP_REWARDS.dailyLogin, "daily_login");
      updateStreak();
    }
  }, []);

  // Clear level up notification
  const clearLevelUp = useCallback(() => {
    setLevelUp(null);
  }, []);

  return {
    // State
    currentXP: state.currentXP,
    level: state.level,
    totalXP: state.totalXP,
    streakDays: state.streakDays,
    levelXP: getLevelXP(state.level),
    nextLevelXP: getNextLevelXP(state.level),
    levelUp,
    
    // Actions
    addXP,
    rewardTaskComplete,
    rewardHabitComplete,
    rewardJournalEntry,
    rewardGoalProgress,
    clearLevelUp,
    
    // Constants
    XP_REWARDS,
  };
};
