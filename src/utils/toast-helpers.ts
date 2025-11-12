/**
 * NEXUS Toast Utilities
 * Standardized toast notifications with consistent styling and behavior
 */

import { toast } from "sonner";

interface ToastOptions {
  description?: string;
  duration?: number;
}

export const toastHelpers = {
  // Success toasts
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, {
      icon: "✅",
      duration: options?.duration || 3000,
      description: options?.description,
    });
  },

  // Error toasts
  error: (message: string, options?: ToastOptions) => {
    toast.error(message, {
      icon: "❌",
      duration: options?.duration || 4000,
      description: options?.description,
    });
  },

  // Info toasts
  info: (message: string, options?: ToastOptions) => {
    toast.info(message, {
      icon: "ℹ️",
      duration: options?.duration || 3000,
      description: options?.description,
    });
  },

  // Warning toasts
  warning: (message: string, options?: ToastOptions) => {
    toast.warning(message, {
      icon: "⚠️",
      duration: options?.duration || 4000,
      description: options?.description,
    });
  },

  // Celebration toasts (gamification)
  celebrate: (message: string, options?: ToastOptions) => {
    toast(message, {
      icon: "🎉",
      duration: options?.duration || 5000,
      description: options?.description,
      className: "celebration-toast",
    });
  },

  // Streak toasts
  streak: (count: number, message?: string) => {
    toast(message || `${count} day streak!`, {
      icon: "🔥",
      duration: 5000,
      description: "Keep the momentum going!",
      className: "streak-toast",
    });
  },

  // XP gained toasts
  xpGained: (xp: number, message?: string) => {
    toast.success(message || "Task completed!", {
      icon: "⭐",
      duration: 3000,
      description: `+${xp} XP earned`,
    });
  },

  // Level up toasts
  levelUp: (level: number) => {
    toast("Level Up!", {
      icon: "🚀",
      duration: 6000,
      description: `You've reached level ${level}! Amazing progress!`,
      className: "level-up-toast",
    });
  },

  // Loading toasts
  loading: (message: string) => {
    return toast.loading(message);
  },

  // Promise-based toasts
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: (data) => {
        return typeof messages.success === "function"
          ? messages.success(data)
          : messages.success;
      },
      error: (error) => {
        return typeof messages.error === "function"
          ? messages.error(error)
          : messages.error;
      },
    });
  },
};
