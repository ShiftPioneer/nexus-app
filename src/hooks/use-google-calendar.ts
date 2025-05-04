
import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

// Define types for Google Calendar integration
interface CalendarSyncSettings {
  importEvents: boolean;
  exportEvents: boolean;
  autoSync: boolean;
}

const LOCAL_STORAGE_KEY = 'calendarIntegration';

export const useGoogleCalendar = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [syncSettings, setSyncSettings] = useState<CalendarSyncSettings>({
    importEvents: true,
    exportEvents: true,
    autoSync: false,
  });

  // Load saved connection state and settings from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setIsConnected(parsedData.isConnected || false);
        setSyncSettings({
          importEvents: parsedData.syncSettings?.importEvents ?? true,
          exportEvents: parsedData.syncSettings?.exportEvents ?? true,
          autoSync: parsedData.syncSettings?.autoSync ?? false,
        });
      } catch (error) {
        console.error("Failed to load calendar integration settings:", error);
      }
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
      isConnected,
      syncSettings
    }));
  }, [isConnected, syncSettings]);

  // Connect to Google Calendar
  const connectGoogleCalendar = async () => {
    try {
      // In a real implementation, this would trigger OAuth flow
      // For now, we'll simulate a successful connection
      console.log("Connecting to Google Calendar...");
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Set connected state
      setIsConnected(true);
      
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

  // Disconnect from Google Calendar
  const disconnectGoogleCalendar = async () => {
    try {
      // In a real implementation, this would revoke OAuth tokens
      console.log("Disconnecting from Google Calendar...");
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Set disconnected state
      setIsConnected(false);
      
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

  // Sync calendars
  const syncCalendars = async () => {
    try {
      if (!isConnected) {
        throw new Error("Not connected to Google Calendar");
      }
      
      console.log("Syncing calendars with settings:", syncSettings);
      
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Sync Complete",
        description: "Calendar synchronized successfully.",
      });
      
      return true;
    } catch (error) {
      console.error("Error syncing calendars:", error);
      toast({
        title: "Sync Failed",
        description: "Failed to synchronize calendars. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    isConnected,
    syncSettings,
    connectGoogleCalendar,
    disconnectGoogleCalendar,
    updateSyncSetting,
    syncCalendars
  };
};
