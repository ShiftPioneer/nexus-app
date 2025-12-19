import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CalendarSyncSettings {
  importEvents: boolean;
  exportEvents: boolean;
  autoSync: boolean;
}

interface GoogleCalendarEvent {
  googleEventId: string;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  isAllDay: boolean;
  location: string;
  htmlLink: string;
}

const LOCAL_STORAGE_KEY = 'calendarIntegration';

export const useGoogleCalendar = () => {
  const { toast } = useToast();
  const { user, session } = useAuth();

  // "Connected" means we currently have a Google OAuth token available in the session
  // (required for calling Google Calendar API from the edge function).
  // "Linked" means the user has a Google identity linked, but may need to re-authenticate
  // to obtain fresh provider tokens.
  const [connectionStatus, setConnectionStatus] = useState<
    "disconnected" | "linked" | "connected"
  >("disconnected");

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncSettings, setSyncSettings] = useState<CalendarSyncSettings>({
    importEvents: true,
    exportEvents: false,
    autoSync: false,
  });

  const isConnected = connectionStatus === "connected";
  const isLinked = connectionStatus !== "disconnected";

  // Determine connection state.
  // NOTE: For Supabase, provider_token is only present when the current session was created
  // via OAuth (or refreshed with provider tokens). A linked identity alone is not enough
  // to call Google APIs.
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!user) {
        if (!cancelled) setConnectionStatus("disconnected");
        return;
      }

      // Load persisted UI settings (doesn't decide connection state)
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          if (!cancelled) {
            setLastSyncTime(parsedData.lastSyncTime ? new Date(parsedData.lastSyncTime) : null);
            setSyncSettings({
              importEvents: parsedData.syncSettings?.importEvents ?? true,
              exportEvents: parsedData.syncSettings?.exportEvents ?? false,
              autoSync: parsedData.syncSettings?.autoSync ?? false,
            });
          }
        } catch (error) {
          console.error("Failed to load calendar integration settings:", error);
        }
      }

      const hasProviderToken = Boolean(session?.provider_token);

      // Check linked identities.
      let hasGoogleIdentity = false;
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        const identities = data.user?.identities ?? [];
        hasGoogleIdentity = identities.some((i) => i.provider === "google");
      } catch {
        hasGoogleIdentity = false;
      }

      if (cancelled) return;

      if (hasProviderToken) {
        setConnectionStatus("connected");
      } else if (hasGoogleIdentity) {
        setConnectionStatus("linked");
      } else {
        setConnectionStatus("disconnected");
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [user?.id, session?.access_token, session?.provider_token]);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        syncSettings,
        lastSyncTime: lastSyncTime?.toISOString(),
      })
    );
  }, [syncSettings, lastSyncTime]);

  // Connect to Google Calendar via OAuth
  const connectGoogleCalendar = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          scopes:
            "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events",
          redirectTo: `${window.location.origin}/time-design`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error connecting to Google Calendar:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Google Calendar. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Link Google Calendar to existing account
  const linkGoogleCalendar = async () => {
    try {
      const { error } = await supabase.auth.linkIdentity({
        provider: "google",
        options: {
          scopes:
            "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events",
          redirectTo: `${window.location.origin}/time-design`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error("Error linking Google Calendar:", error);

      // If identity is already linked, treat as linked (but not necessarily sync-ready)
      if (error.message?.includes("already linked")) {
        setConnectionStatus("linked");
        toast({
          title: "Already Linked",
          description:
            "Your Google account is already linked. If sync doesn't work, click Connect to re-authenticate.",
        });
        return true;
      }

      toast({
        title: "Link Failed",
        description: error.message || "Failed to link Google Calendar. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Disconnect from Google Calendar (local UI state only)
  const disconnectGoogleCalendar = async () => {
    try {
      setConnectionStatus("disconnected");
      setLastSyncTime(null);
      localStorage.removeItem(LOCAL_STORAGE_KEY);

      toast({
        title: "Disconnected",
        description: "Google Calendar has been disconnected in this app.",
      });

      return true;
    } catch (error) {
      console.error("Error disconnecting from Google Calendar:", error);
      toast({
        title: "Error",
        description: "Failed to disconnect from Google Calendar.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Update sync settings
  const updateSyncSetting = (key: string, value: boolean) => {
    setSyncSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Fetch events from Google Calendar
  const fetchGoogleEvents = useCallback(
    async (timeMin?: string, timeMax?: string): Promise<GoogleCalendarEvent[]> => {
      // IMPORTANT: don't manually override invoke headers; supabase-js will attach the current user JWT.
      // Overriding headers can drop required defaults in some environments.
      if (!user) throw new Error("Not authenticated");

      setIsSyncing(true);

      try {
        const { data, error } = await supabase.functions.invoke("google-calendar-sync", {
          body: {
            action: "fetch",
            timeMin,
            timeMax,
          },
        });

        if (error) {
          // Normalize common auth failure into a reconnect prompt.
          const msg = error.message || "Edge Function returned a non-2xx status code";
          if (/no session|jwt|unauthorized|401/i.test(msg)) {
            setConnectionStatus(isLinked ? "linked" : "disconnected");
            throw new Error("Google sync needs re-authentication. Click Connect/Reconnect Google.");
          }
          throw error;
        }

        if (data?.needsReconnect) {
          setConnectionStatus(isLinked ? "linked" : "disconnected");
          throw new Error(data.error || "Please reconnect your Google account");
        }

        if (data?.error) throw new Error(data.error);

        setLastSyncTime(new Date());
        return data?.events || [];
      } finally {
        setIsSyncing(false);
      }
    },
    [user?.id, isLinked]
  );

  // Push events to Google Calendar
  const pushEventsToGoogle = useCallback(
    async (
      events: Array<{
        title: string;
        description?: string;
        startDateTime: string;
        endDateTime: string;
      }>
    ) => {
      if (!user) throw new Error("Not authenticated");

      setIsSyncing(true);

      try {
        const { data, error } = await supabase.functions.invoke("google-calendar-sync", {
          body: {
            action: "push",
            events,
          },
        });

        if (error) {
          const msg = error.message || "Edge Function returned a non-2xx status code";
          if (/no session|jwt|unauthorized|401/i.test(msg)) {
            setConnectionStatus(isLinked ? "linked" : "disconnected");
            throw new Error("Google sync needs re-authentication. Click Connect/Reconnect Google.");
          }
          throw error;
        }

        if (data?.needsReconnect) {
          setConnectionStatus(isLinked ? "linked" : "disconnected");
          throw new Error(data.error || "Please reconnect your Google account");
        }

        return data?.results || [];
      } finally {
        setIsSyncing(false);
      }
    },
    [user?.id, isLinked]
  );

  // Sync calendars (import and/or export)
  const syncCalendars = useCallback(async () => {
    try {
      if (!isConnected) {
        throw new Error(
          connectionStatus === "linked"
            ? "Google is linked, but Nexus needs you to reconnect to enable sync. Click Connect."
            : "Not connected to Google Calendar"
        );
      }

      setIsSyncing(true);

      let importedEvents: GoogleCalendarEvent[] = [];

      if (syncSettings.importEvents) {
        importedEvents = await fetchGoogleEvents();
      }

      setLastSyncTime(new Date());

      toast({
        title: "Sync Complete",
        description: `${importedEvents.length} events imported from Google Calendar.`,
      });

      return { importedEvents };
    } catch (error: any) {
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to synchronize calendars. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsSyncing(false);
    }
  }, [isConnected, connectionStatus, syncSettings.importEvents, fetchGoogleEvents, toast]);

  return {
    // legacy
    isConnected,

    // richer state (use this in UI)
    connectionStatus,
    isLinked,

    isSyncing,
    lastSyncTime,
    syncSettings,

    connectGoogleCalendar,
    linkGoogleCalendar,
    disconnectGoogleCalendar,
    updateSyncSetting,
    syncCalendars,
    fetchGoogleEvents,
    pushEventsToGoogle,
  };
};
