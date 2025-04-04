
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import useGoogleCalendar from '@/hooks/use-google-calendar';
import { CalendarPlus, CalendarCheck, CalendarClock, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CalendarSyncSettings = () => {
  const { 
    isInitialized, 
    isInitializing,
    error, 
    calendars,
    syncConfig,
    initializeGoogleCalendar,
    updateSyncConfig
  } = useGoogleCalendar({ autoInit: false });
  
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();
  
  // Categories that can be synced with Google Calendar
  const syncCategories = [
    { id: 'tasks', label: 'Tasks', icon: <CalendarCheck className="h-4 w-4" /> },
    { id: 'habits', label: 'Habits', icon: <CalendarClock className="h-4 w-4" /> },
    { id: 'events', label: 'Events', icon: <CalendarPlus className="h-4 w-4" /> },
  ];
  
  const handleConnect = () => {
    initializeGoogleCalendar();
  };
  
  const handleToggleSync = (enabled: boolean) => {
    updateSyncConfig({ enabled });
    
    if (enabled) {
      toast({
        title: "Calendar Sync Enabled",
        description: "Your events will now sync with Google Calendar",
        duration: 3000,
      });
    } else {
      toast({
        title: "Calendar Sync Disabled",
        description: "Events will no longer sync with Google Calendar",
        duration: 3000,
      });
    }
  };
  
  const handleSelectCalendar = (calendarId: string) => {
    updateSyncConfig({ calendarId });
  };
  
  const handleSelectDirection = (syncDirection: 'push' | 'pull' | 'both') => {
    updateSyncConfig({ syncDirection });
  };
  
  const handleToggleCategory = (category: string, checked: boolean) => {
    const updatedCategories = checked 
      ? [...syncConfig.syncCategories, category]
      : syncConfig.syncCategories.filter(c => c !== category);
      
    updateSyncConfig({ syncCategories: updatedCategories });
  };
  
  const handleSyncNow = async () => {
    setSyncing(true);
    // This would trigger an immediate sync in a real implementation
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate sync
    toast({
      title: "Sync Complete",
      description: "Your calendar has been synchronized",
      duration: 3000,
    });
    setSyncing(false);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarCheck className="h-5 w-5" />
          Google Calendar Sync
        </CardTitle>
        <CardDescription>
          Synchronize your tasks, habits, and events with Google Calendar
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isInitialized ? (
          <div className="bg-muted/50 p-6 rounded-lg text-center">
            <p className="mb-4">Connect your Google Calendar to enable two-way synchronization</p>
            <Button 
              onClick={handleConnect} 
              disabled={isInitializing}
              className="w-full sm:w-auto"
            >
              {isInitializing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>Connect Google Calendar</>
              )}
            </Button>
            {error && (
              <p className="text-sm text-destructive mt-2">{error}</p>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="calendar-sync" className="text-base font-medium">Enable Calendar Sync</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically sync your activities with Google Calendar
                </p>
              </div>
              <Switch
                id="calendar-sync"
                checked={syncConfig.enabled}
                onCheckedChange={handleToggleSync}
              />
            </div>
            
            {syncConfig.enabled && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="calendar-selection">Select Calendar</Label>
                  <Select 
                    value={syncConfig.calendarId} 
                    onValueChange={handleSelectCalendar}
                  >
                    <SelectTrigger id="calendar-selection">
                      <SelectValue placeholder="Select a calendar" />
                    </SelectTrigger>
                    <SelectContent>
                      {calendars.map(calendar => (
                        <SelectItem key={calendar.id} value={calendar.id}>
                          {calendar.summary}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sync-direction">Sync Direction</Label>
                  <Select 
                    value={syncConfig.syncDirection} 
                    onValueChange={(val: any) => handleSelectDirection(val)}
                  >
                    <SelectTrigger id="sync-direction">
                      <SelectValue placeholder="Select sync direction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="push">App → Google Calendar (One-way)</SelectItem>
                      <SelectItem value="pull">Google Calendar → App (One-way)</SelectItem>
                      <SelectItem value="both">Two-way Synchronization</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Choose how you want to sync your calendars
                  </p>
                </div>
                
                <div>
                  <Label className="mb-2 block">What to Sync</Label>
                  <div className="space-y-2">
                    {syncCategories.map(category => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`category-${category.id}`} 
                          checked={syncConfig.syncCategories.includes(category.id)}
                          onCheckedChange={(checked) => 
                            handleToggleCategory(category.id, checked === true)
                          }
                        />
                        <Label 
                          htmlFor={`category-${category.id}`}
                          className="flex items-center text-sm font-normal"
                        >
                          {category.icon}
                          <span className="ml-2">{category.label}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
      
      {isInitialized && syncConfig.enabled && (
        <CardFooter className="justify-between flex-wrap gap-2">
          <p className="text-sm text-muted-foreground">
            Last synced: {syncConfig.lastSyncTime 
              ? new Date(syncConfig.lastSyncTime).toLocaleString() 
              : 'Never'
            }
          </p>
          <Button 
            onClick={handleSyncNow} 
            disabled={syncing}
          >
            {syncing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>Sync Now</>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default CalendarSyncSettings;
