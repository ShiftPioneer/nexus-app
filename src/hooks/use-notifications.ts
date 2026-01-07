import { useEffect, useRef, useCallback, useState } from "react";
import { useToast } from "./use-toast";

export interface NotificationSettings {
  enabled: boolean;
  reminderTimes: number[]; // minutes before activity (e.g., [30, 15, 5])
  browserNotifications: boolean;
  inAppToasts: boolean;
  sound: boolean;
  vibration: boolean;
  dailyDigest: boolean;
  dailyDigestTime: string; // HH:MM format
  habitReminders: boolean;
  goalDeadlines: boolean;
  focusBreaks: boolean;
  streakAlerts: boolean;
}

export interface TimeActivity {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  startTime: string;
  endDate: Date;
  endTime: string;
  category?: string;
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,
  reminderTimes: [30, 15, 5],
  browserNotifications: true,
  inAppToasts: true,
  sound: true,
  vibration: true,
  dailyDigest: false,
  dailyDigestTime: "08:00",
  habitReminders: true,
  goalDeadlines: true,
  focusBreaks: true,
  streakAlerts: true,
};

const LOCAL_STORAGE_KEY = "nexus-notification-settings";

export const useNotifications = (activities: TimeActivity[] = []) => {
  const { toast } = useToast();
  const scheduledNotifications = useRef<Map<string, NodeJS.Timeout[]>>(new Map());
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>("default");

  // Load settings from localStorage
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_NOTIFICATION_SETTINGS;
  });

  // Check browser notification permission on mount
  useEffect(() => {
    if ("Notification" in window) {
      setBrowserPermission(Notification.permission);
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Request browser notification permission
  const requestBrowserPermission = useCallback(async (): Promise<boolean> => {
    if (!("Notification" in window)) {
      console.warn("Browser does not support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      setBrowserPermission("granted");
      return true;
    }

    if (Notification.permission === "denied") {
      setBrowserPermission("denied");
      return false;
    }

    const permission = await Notification.requestPermission();
    setBrowserPermission(permission);
    return permission === "granted";
  }, []);

  // Vibrate device if supported
  const vibrate = useCallback((pattern: number[] = [200, 100, 200]) => {
    if (settings.vibration && "vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  }, [settings.vibration]);

  // Play notification sound
  const playSound = useCallback(() => {
    if (settings.sound) {
      try {
        const audio = new Audio('/notification.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {
          // Fallback to Web Audio API
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = 440;
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.3);
        });
      } catch (error) {
        console.error("Failed to play notification sound:", error);
      }
    }
  }, [settings.sound]);

  // Send browser notification
  const sendBrowserNotification = useCallback(
    (title: string, body: string, options?: { tag?: string; icon?: string }) => {
      if (!("Notification" in window) || Notification.permission !== "granted") return null;

      try {
        const notification = new Notification(title, {
          body,
          icon: options?.icon || "/lovable-uploads/nexus-logo-orange.png",
          badge: "/lovable-uploads/nexus-logo-orange.png",
          tag: options?.tag || `nexus-${Date.now()}`,
          requireInteraction: false,
          silent: !settings.sound,
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        // Auto close after 10 seconds
        setTimeout(() => notification.close(), 10000);

        // Vibrate and play sound
        if (settings.sound) playSound();
        if (settings.vibration) vibrate();

        return notification;
      } catch (error) {
        console.error("Failed to send browser notification:", error);
        return null;
      }
    },
    [settings.sound, settings.vibration, playSound, vibrate]
  );

  // Send in-app toast notification
  const sendToastNotification = useCallback(
    (title: string, description: string, variant?: 'default' | 'destructive') => {
      if (!settings.inAppToasts) return;
      
      toast({
        title,
        description,
        variant,
      });

      if (settings.sound) playSound();
      if (settings.vibration) vibrate([100]);
    },
    [toast, settings.inAppToasts, settings.sound, settings.vibration, playSound, vibrate]
  );

  // Send notification based on type
  const sendNotification = useCallback(
    (title: string, body: string, options?: { 
      type?: 'activity' | 'habit' | 'goal' | 'focus' | 'streak';
      tag?: string;
    }) => {
      const type = options?.type || 'activity';
      
      // Check if this notification type is enabled
      const typeEnabled = {
        activity: true,
        habit: settings.habitReminders,
        goal: settings.goalDeadlines,
        focus: settings.focusBreaks,
        streak: settings.streakAlerts,
      }[type];

      if (!settings.enabled || !typeEnabled) return;

      // In-app toast
      if (settings.inAppToasts) {
        sendToastNotification(title, body);
      }

      // Browser notification
      if (settings.browserNotifications && browserPermission === "granted") {
        sendBrowserNotification(title, body, { tag: options?.tag });
      }
    },
    [settings, browserPermission, sendToastNotification, sendBrowserNotification]
  );

  // Schedule notification for an activity
  const scheduleActivityNotification = useCallback(
    (activity: TimeActivity, minutesBefore: number) => {
      const startDate = new Date(activity.startDate);
      const [hours, minutes] = activity.startTime.split(":").map(Number);
      startDate.setHours(hours, minutes, 0, 0);

      const notificationTime = new Date(startDate.getTime() - minutesBefore * 60 * 1000);
      const now = new Date();

      // Skip if notification time has passed
      if (notificationTime <= now) return null;

      const timeUntilNotification = notificationTime.getTime() - now.getTime();

      const timeoutId = setTimeout(() => {
        const title = minutesBefore === 0 
          ? "🚀 Activity Starting Now!" 
          : `⏰ Activity in ${minutesBefore} minutes`;
        
        sendNotification(title, activity.title, {
          type: 'activity',
          tag: `activity-${activity.id}-${minutesBefore}`,
        });
      }, timeUntilNotification);

      return timeoutId;
    },
    [sendNotification]
  );

  // Clear all scheduled notifications for an activity
  const clearActivityNotifications = useCallback((activityId: string) => {
    const timeouts = scheduledNotifications.current.get(activityId);
    if (timeouts) {
      timeouts.forEach(clearTimeout);
      scheduledNotifications.current.delete(activityId);
    }
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    scheduledNotifications.current.forEach((timeouts) => {
      timeouts.forEach(clearTimeout);
    });
    scheduledNotifications.current.clear();
  }, []);

  // Schedule all notifications for activities
  useEffect(() => {
    if (!settings.enabled) {
      clearAllNotifications();
      return;
    }

    // Clear existing notifications
    clearAllNotifications();

    // Schedule new notifications for each activity
    activities.forEach((activity) => {
      const timeouts: NodeJS.Timeout[] = [];

      settings.reminderTimes.forEach((minutesBefore) => {
        const timeoutId = scheduleActivityNotification(activity, minutesBefore);
        if (timeoutId) timeouts.push(timeoutId);
      });

      if (timeouts.length > 0) {
        scheduledNotifications.current.set(activity.id, timeouts);
      }
    });

    // Cleanup on unmount
    return () => {
      clearAllNotifications();
    };
  }, [activities, settings.enabled, settings.reminderTimes, scheduleActivityNotification, clearAllNotifications]);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  // Toggle specific reminder time
  const toggleReminderTime = useCallback((minutes: number) => {
    setSettings((prev) => {
      const newTimes = prev.reminderTimes.includes(minutes)
        ? prev.reminderTimes.filter((t) => t !== minutes)
        : [...prev.reminderTimes, minutes].sort((a, b) => b - a);
      return { ...prev, reminderTimes: newTimes };
    });
  }, []);

  // Send specific notification types
  const sendHabitReminder = useCallback((habitName: string) => {
    sendNotification("🎯 Habit Reminder", `Don't forget to complete: ${habitName}`, {
      type: 'habit',
      tag: `habit-${habitName}`,
    });
  }, [sendNotification]);

  const sendGoalDeadlineAlert = useCallback((goalName: string, daysLeft: number) => {
    sendNotification(
      "📌 Goal Deadline Approaching",
      `${goalName} is due in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`,
      { type: 'goal', tag: `goal-${goalName}` }
    );
  }, [sendNotification]);

  const sendFocusBreakAlert = useCallback(() => {
    sendNotification("☕ Time for a Break", "You've been focused for a while. Take a short break!", {
      type: 'focus',
      tag: 'focus-break',
    });
  }, [sendNotification]);

  const sendStreakAlert = useCallback((streakCount: number, streakType: string) => {
    sendNotification(
      "🔥 Streak Achievement!",
      `You've maintained a ${streakCount} day ${streakType} streak!`,
      { type: 'streak', tag: `streak-${streakType}` }
    );
  }, [sendNotification]);

  return {
    settings,
    browserPermission,
    updateSettings,
    toggleReminderTime,
    requestBrowserPermission,
    sendNotification,
    sendBrowserNotification,
    sendToastNotification,
    sendHabitReminder,
    sendGoalDeadlineAlert,
    sendFocusBreakAlert,
    sendStreakAlert,
    clearActivityNotifications,
    clearAllNotifications,
    vibrate,
    playSound,
  };
};

// Re-export for backwards compatibility
export { useNotifications as useActivityNotifications };
