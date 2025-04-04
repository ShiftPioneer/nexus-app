
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  initGoogleCalendarAPI,
  listCalendars,
  fetchGoogleCalendarEvents,
  createGoogleCalendarEvent,
  updateGoogleCalendarEvent,
  deleteGoogleCalendarEvent,
  GoogleCalendarEvent,
  CalendarSyncConfig
} from '@/integrations/googleCalendar/GoogleCalendarService';

interface UseGoogleCalendarProps {
  autoInit?: boolean;
}

export const useGoogleCalendar = ({ autoInit = true }: UseGoogleCalendarProps = {}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [calendars, setCalendars] = useState<any[]>([]);
  const [syncConfig, setSyncConfig] = useState<CalendarSyncConfig>({
    enabled: false,
    calendarId: 'primary',
    syncDirection: 'both',
    syncCategories: ['tasks', 'habits', 'events']
  });
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize Google Calendar API if autoInit is true
  useEffect(() => {
    if (autoInit) {
      initializeGoogleCalendar();
    }
  }, [autoInit]);

  // Initialize Google Calendar API client
  const initializeGoogleCalendar = async () => {
    try {
      setIsInitializing(true);
      setError(null);
      const success = await initGoogleCalendarAPI();
      
      if (success) {
        setIsInitialized(true);
        // Try to fetch calendars after successful init
        await fetchCalendars();
        toast({
          title: "Google Calendar Connected",
          description: "Successfully connected to your Google Calendar",
          duration: 3000,
        });
      } else {
        setError('Failed to initialize Google Calendar API');
        toast({
          title: "Connection Failed",
          description: "Could not connect to Google Calendar",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (err) {
      setError(`Error initializing Google Calendar: ${err instanceof Error ? err.message : String(err)}`);
      toast({
        title: "Connection Error",
        description: "An error occurred while connecting to Google Calendar",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsInitializing(false);
    }
  };

  // Fetch user's Google Calendars
  const fetchCalendars = async () => {
    try {
      setError(null);
      const calendarList = await listCalendars();
      setCalendars(calendarList);
      return calendarList;
    } catch (err) {
      const errorMsg = `Error fetching calendars: ${err instanceof Error ? err.message : String(err)}`;
      setError(errorMsg);
      toast({
        title: "Calendar Error",
        description: "Could not fetch your calendars",
        variant: "destructive",
        duration: 3000,
      });
      return [];
    }
  };

  // Get events from Google Calendar
  const getEvents = async (
    calendarId: string = syncConfig.calendarId,
    startDate: Date,
    endDate: Date
  ) => {
    try {
      setError(null);
      return await fetchGoogleCalendarEvents(calendarId, startDate, endDate);
    } catch (err) {
      const errorMsg = `Error fetching events: ${err instanceof Error ? err.message : String(err)}`;
      setError(errorMsg);
      toast({
        title: "Event Error",
        description: "Could not fetch your calendar events",
        variant: "destructive",
        duration: 3000,
      });
      return [];
    }
  };

  // Create a new event in Google Calendar
  const createEvent = async (
    event: GoogleCalendarEvent,
    calendarId: string = syncConfig.calendarId
  ) => {
    try {
      setError(null);
      const result = await createGoogleCalendarEvent(calendarId, event);
      if (result) {
        toast({
          title: "Event Created",
          description: "Successfully added event to Google Calendar",
          duration: 3000,
        });
      }
      return result;
    } catch (err) {
      const errorMsg = `Error creating event: ${err instanceof Error ? err.message : String(err)}`;
      setError(errorMsg);
      toast({
        title: "Event Error",
        description: "Failed to create calendar event",
        variant: "destructive",
        duration: 3000,
      });
      return null;
    }
  };

  // Update an existing event in Google Calendar
  const updateEvent = async (
    eventId: string,
    event: GoogleCalendarEvent,
    calendarId: string = syncConfig.calendarId
  ) => {
    try {
      setError(null);
      const result = await updateGoogleCalendarEvent(calendarId, eventId, event);
      if (result) {
        toast({
          title: "Event Updated",
          description: "Successfully updated event in Google Calendar",
          duration: 3000,
        });
      }
      return result;
    } catch (err) {
      const errorMsg = `Error updating event: ${err instanceof Error ? err.message : String(err)}`;
      setError(errorMsg);
      toast({
        title: "Event Error",
        description: "Failed to update calendar event",
        variant: "destructive",
        duration: 3000,
      });
      return null;
    }
  };

  // Delete an event from Google Calendar
  const deleteEvent = async (
    eventId: string,
    calendarId: string = syncConfig.calendarId
  ) => {
    try {
      setError(null);
      const success = await deleteGoogleCalendarEvent(calendarId, eventId);
      if (success) {
        toast({
          title: "Event Deleted",
          description: "Successfully removed event from Google Calendar",
          duration: 3000,
        });
      }
      return success;
    } catch (err) {
      const errorMsg = `Error deleting event: ${err instanceof Error ? err.message : String(err)}`;
      setError(errorMsg);
      toast({
        title: "Event Error",
        description: "Failed to delete calendar event",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }
  };

  // Update sync configuration
  const updateSyncConfig = (config: Partial<CalendarSyncConfig>) => {
    setSyncConfig(prev => ({ ...prev, ...config }));
  };

  return {
    isInitialized,
    isInitializing,
    error,
    calendars,
    syncConfig,
    initializeGoogleCalendar,
    fetchCalendars,
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    updateSyncConfig
  };
};

export default useGoogleCalendar;
