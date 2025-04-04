
import { useState, useEffect } from 'react';
import { useToast } from './use-toast';
import GoogleCalendarService from '@/services/GoogleCalendarService';

export interface GoogleCalendarHookProps {
  apiKey?: string;
  clientId?: string;
}

export const useGoogleCalendar = (options?: GoogleCalendarHookProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [calendars, setCalendars] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const googleCalendarService = GoogleCalendarService.getInstance();

  const initialize = (apiKey: string, clientId: string) => {
    try {
      googleCalendarService.initialize({
        apiKey,
        clientId,
        scope: [
          'https://www.googleapis.com/auth/calendar',
          'https://www.googleapis.com/auth/calendar.events',
        ],
      });
      toast({
        title: "Google Calendar API Initialized",
        description: "API client has been initialized successfully",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Initialization Error",
        description: err.message || "Failed to initialize Google Calendar API",
      });
    }
  };

  useEffect(() => {
    if (options?.apiKey && options?.clientId) {
      initialize(options.apiKey, options.clientId);
    }
  }, [options?.apiKey, options?.clientId]);

  const connect = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await googleCalendarService.signIn();
      const calendarList = await googleCalendarService.getCalendars();
      setCalendars(calendarList);
      setIsConnected(true);
      
      toast({
        title: "Connected",
        description: "Successfully connected to Google Calendar",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: err.message || "Failed to connect to Google Calendar",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await googleCalendarService.signOut();
      setCalendars([]);
      setIsConnected(false);
      
      toast({
        title: "Disconnected",
        description: "Successfully disconnected from Google Calendar",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Disconnect Error",
        description: err.message || "Failed to disconnect from Google Calendar",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getEvents = async (calendarId: string, startDate: Date, endDate: Date) => {
    setIsLoading(true);
    setError(null);

    try {
      const events = await googleCalendarService.getEvents(calendarId, startDate, endDate);
      return events;
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Error Fetching Events",
        description: err.message || "Failed to fetch events from Google Calendar",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const createEvent = async (calendarId: string, event: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const createdEvent = await googleCalendarService.createEvent(calendarId, event);
      toast({
        title: "Event Created",
        description: "Event has been added to Google Calendar",
      });
      return createdEvent;
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Error Creating Event",
        description: err.message || "Failed to create event in Google Calendar",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateEvent = async (calendarId: string, eventId: string, event: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedEvent = await googleCalendarService.updateEvent(calendarId, eventId, event);
      toast({
        title: "Event Updated",
        description: "Event has been updated in Google Calendar",
      });
      return updatedEvent;
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Error Updating Event",
        description: err.message || "Failed to update event in Google Calendar",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEvent = async (calendarId: string, eventId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await googleCalendarService.deleteEvent(calendarId, eventId);
      toast({
        title: "Event Deleted",
        description: "Event has been removed from Google Calendar",
      });
      return true;
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Error Deleting Event",
        description: err.message || "Failed to delete event from Google Calendar",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isConnected,
    isLoading,
    calendars,
    error,
    initialize,
    connect,
    disconnect,
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
  };
};

export default useGoogleCalendar;
