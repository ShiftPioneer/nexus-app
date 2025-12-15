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
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncSettings, setSyncSettings] = useState<CalendarSyncSettings>({
    importEvents: true,
    exportEvents: false,
    autoSync: false,
  });

  // Check if user is connected via Google OAuth
  useEffect(() => {
    if (session?.provider_token && session?.user?.app_metadata?.provider === 'google') {
      setIsConnected(true);
    } else {
      // Check localStorage for connection state (for users who linked Google)
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setIsConnected(parsedData.isConnected || false);
          setLastSyncTime(parsedData.lastSyncTime ? new Date(parsedData.lastSyncTime) : null);
          setSyncSettings({
            importEvents: parsedData.syncSettings?.importEvents ?? true,
            exportEvents: parsedData.syncSettings?.exportEvents ?? false,
            autoSync: parsedData.syncSettings?.autoSync ?? false,
          });
        } catch (error) {
          console.error("Failed to load calendar integration settings:", error);
        }
      }
    }
  }, [session]);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
      isConnected,
      syncSettings,
      lastSyncTime: lastSyncTime?.toISOString(),
    }));
  }, [isConnected, syncSettings, lastSyncTime]);

  // Connect to Google Calendar via OAuth
  const connectGoogleCalendar = async () => {
    try {
      console.log("Connecting to Google Calendar...");
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events',
          redirectTo: `${window.location.origin}/time-design`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        throw error;
      }

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
      console.log("Linking Google Calendar...");
      
      const { data, error } = await supabase.auth.linkIdentity({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events',
          redirectTo: `${window.location.origin}/time-design`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        throw error;
      }

      return true;
    } catch (error: any) {
      console.error("Error linking Google Calendar:", error);
      
      // If identity is already linked, treat as success
      if (error.message?.includes('already linked')) {
        setIsConnected(true);
        toast({
          title: "Already Connected",
          description: "Your Google account is already linked.",
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

  // Disconnect from Google Calendar
  const disconnectGoogleCalendar = async () => {
    try {
      console.log("Disconnecting from Google Calendar...");
      
      // Clear local state
      setIsConnected(false);
      setLastSyncTime(null);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      
      toast({
        title: "Disconnected",
        description: "Google Calendar has been disconnected.",
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
    setSyncSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Fetch events from Google Calendar
  const fetchGoogleEvents = useCallback(async (timeMin?: string, timeMax?: string): Promise<GoogleCalendarEvent[]> => {
    if (!session?.access_token) {
      throw new Error("Not authenticated");
    }

    setIsSyncing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('google-calendar-sync', {
        body: {
          action: 'fetch',
          timeMin,
          timeMax,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.needsReconnect) {
        setIsConnected(false);
        throw new Error(data.error || 'Please reconnect your Google account');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setLastSyncTime(new Date());
      return data?.events || [];
    } catch (error: any) {
      console.error("Error fetching Google Calendar events:", error);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  }, [session]);

  // Push events to Google Calendar
  const pushEventsToGoogle = useCallback(async (events: Array<{
    title: string;
    description?: string;
    startDateTime: string;
    endDateTime: string;
  }>) => {
    if (!session?.access_token) {
      throw new Error("Not authenticated");
    }

    setIsSyncing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('google-calendar-sync', {
        body: {
          action: 'push',
          events,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.needsReconnect) {
        setIsConnected(false);
        throw new Error(data.error || 'Please reconnect your Google account');
      }

      return data?.results || [];
    } catch (error: any) {
      console.error("Error pushing events to Google Calendar:", error);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  }, [session]);

  // Sync calendars (import and/or export)
  const syncCalendars = useCallback(async () => {
    try {
      if (!isConnected) {
        throw new Error("Not connected to Google Calendar");
      }
      
      setIsSyncing(true);
      console.log("Syncing calendars with settings:", syncSettings);
      
      let importedEvents: GoogleCalendarEvent[] = [];
      
      if (syncSettings.importEvents) {
        importedEvents = await fetchGoogleEvents();
        console.log(`Imported ${importedEvents.length} events from Google Calendar`);
      }
      
      setLastSyncTime(new Date());
      
      toast({
        title: "Sync Complete",
        description: `${importedEvents.length} events imported from Google Calendar.`,
      });
      
      return { importedEvents };
    } catch (error: any) {
      console.error("Error syncing calendars:", error);
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to synchronize calendars. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsSyncing(false);
    }
  }, [isConnected, syncSettings, fetchGoogleEvents, toast]);

  return {
    isConnected,
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
