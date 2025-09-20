import { useState, useEffect, useCallback } from "react";

export interface ISettings {
  notifications: {
    dailyReminders: boolean;
    habitReminders: boolean;
    focusBreaks: boolean;
    goalDeadlines: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
  };
  ai: {
    enabled: boolean;
    suggestionsFrequency: 'realtime' | 'daily' | 'weekly' | 'never';
    personalizedTips: boolean;
    autoGoalSuggestions: boolean;
  };
  gamification: {
    enabled: boolean;
    showXP: boolean;
    showBadges: boolean;
    showLeaderboard: boolean;
    streakNotifications: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    accentColor: 'blue' | 'green' | 'purple' | 'orange' | 'red';
    compactMode: boolean;
    animationsEnabled: boolean;
  };
  privacy: {
    analyticsTracking: boolean;
    performanceData: boolean;
    crashReports: boolean;
    personalizedAds: boolean;
  };
  device: {
    soundEffects: boolean;
    hapticFeedback: boolean;
    autoSave: boolean;
    offlineMode: boolean;
  };
}

const DEFAULT_SETTINGS: ISettings = {
  notifications: {
    dailyReminders: true,
    habitReminders: true,
    focusBreaks: true,
    goalDeadlines: true,
    emailNotifications: false,
    pushNotifications: true
  },
  ai: {
    enabled: true,
    suggestionsFrequency: 'daily',
    personalizedTips: true,
    autoGoalSuggestions: true
  },
  gamification: {
    enabled: true,
    showXP: true,
    showBadges: true,
    showLeaderboard: false,
    streakNotifications: true
  },
  appearance: {
    theme: 'system',
    accentColor: 'orange',
    compactMode: false,
    animationsEnabled: true
  },
  privacy: {
    analyticsTracking: true,
    performanceData: true,
    crashReports: true,
    personalizedAds: false
  },
  device: {
    soundEffects: true,
    hapticFeedback: true,
    autoSave: true,
    offlineMode: true
  }
};

const SETTINGS_KEY = "nexus-settings";

export const useSettingsStorage = () => {
  const [settings, setSettings] = useState<ISettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to handle new settings
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
    return DEFAULT_SETTINGS;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Save settings to localStorage with debouncing
  const saveSettings = useCallback(async (newSettings: ISettings) => {
    setIsLoading(true);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
      
      // Dispatch custom event for other components to listen
      window.dispatchEvent(new CustomEvent('settingsChanged', { 
        detail: newSettings 
      }));
      
      return { success: true };
    } catch (error) {
      console.error("Error saving settings:", error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update a specific setting category
  const updateSettings = useCallback(async (category: keyof ISettings, updates: Partial<ISettings[keyof ISettings]>) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        ...updates
      }
    };
    return saveSettings(newSettings);
  }, [settings, saveSettings]);

  // Reset to default settings
  const resetSettings = useCallback(async () => {
    return saveSettings(DEFAULT_SETTINGS);
  }, [saveSettings]);

  // Export settings data
  const exportSettings = useCallback(() => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `nexus-settings-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [settings]);

  return {
    settings,
    updateSettings,
    saveSettings,
    resetSettings,
    exportSettings,
    isLoading,
    defaults: DEFAULT_SETTINGS
  };
};