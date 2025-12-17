import { useEffect, useRef, useCallback, useState } from "react";
import { useToast } from "./use-toast";

interface NotificationSettings {
  enabled: boolean;
  reminderTimes: number[]; // minutes before activity (e.g., [30, 15])
  browserNotifications: boolean;
  inAppToasts: boolean;
  sound: boolean;
}

interface TimeActivity {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  startTime: string;
  endDate: Date;
  endTime: string;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  reminderTimes: [30, 15],
  browserNotifications: true,
  inAppToasts: true,
  sound: false,
};

const LOCAL_STORAGE_KEY = "activityNotificationSettings";

export const useActivityNotifications = (activities: TimeActivity[]) => {
  const { toast } = useToast();
  const scheduledNotifications = useRef<Map<string, NodeJS.Timeout[]>>(new Map());
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>("default");

  // Load settings from localStorage
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_SETTINGS;
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

  // Send browser notification
  const sendBrowserNotification = useCallback(
    (title: string, body: string, tag?: string) => {
      if (!("Notification" in window) || Notification.permission !== "granted") return;

      try {
        const notification = new Notification(title, {
          body,
          icon: "/lovable-uploads/nexus-logo-orange.png",
          badge: "/lovable-uploads/nexus-logo-orange.png",
          tag: tag || `activity-${Date.now()}`,
          requireInteraction: false,
          silent: !settings.sound,
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        // Auto close after 10 seconds
        setTimeout(() => notification.close(), 10000);
      } catch (error) {
        console.error("Failed to send browser notification:", error);
      }
    },
    [settings.sound]
  );

  // Send in-app toast notification
  const sendToastNotification = useCallback(
    (title: string, description: string) => {
      toast({
        title,
        description,
      });
    },
    [toast]
  );

  // Schedule notification for an activity
  const scheduleNotification = useCallback(
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
        const title = minutesBefore === 0 ? "Activity Starting Now!" : `Activity in ${minutesBefore} minutes`;
        const body = activity.title;

        // In-app toast
        if (settings.inAppToasts) {
          sendToastNotification(title, body);
        }

        // Browser notification
        if (settings.browserNotifications && browserPermission === "granted") {
          sendBrowserNotification(title, body, `activity-${activity.id}-${minutesBefore}`);
        }
      }, timeUntilNotification);

      return timeoutId;
    },
    [settings.inAppToasts, settings.browserNotifications, browserPermission, sendToastNotification, sendBrowserNotification]
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
    scheduledNotifications.current.forEach((timeouts, activityId) => {
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
        const timeoutId = scheduleNotification(activity, minutesBefore);
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
  }, [activities, settings.enabled, settings.reminderTimes, scheduleNotification, clearAllNotifications]);

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

  return {
    settings,
    browserPermission,
    updateSettings,
    toggleReminderTime,
    requestBrowserPermission,
    sendBrowserNotification,
    sendToastNotification,
    clearActivityNotifications,
    clearAllNotifications,
  };
};
