
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, CalendarClock, RefreshCw, PlusCircle } from "lucide-react";
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar';

const GoogleCalendarSettings = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [clientId, setClientId] = useState<string>('');
  const [selectedCalendar, setSelectedCalendar] = useState<string>('');
  const [syncSettings, setSyncSettings] = useState({
    syncTasks: true,
    syncHabits: false,
    syncEvents: true,
    autoSync: true
  });
  
  const { 
    isConnected, 
    isLoading, 
    calendars, 
    connect, 
    disconnect, 
    initialize 
  } = useGoogleCalendar();

  const handleInitialize = () => {
    if (apiKey && clientId) {
      initialize(apiKey, clientId);
    }
  };

  const handleConnect = () => {
    connect();
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleToggleSetting = (setting: keyof typeof syncSettings) => {
    setSyncSettings({
      ...syncSettings,
      [setting]: !syncSettings[setting]
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5" />
          Google Calendar Integration
        </CardTitle>
        <CardDescription>
          Connect and sync your Google Calendar with Nexus
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isConnected ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">Google API Key</Label>
              <Input 
                id="api-key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Google API key"
              />
              <p className="text-xs text-muted-foreground">
                <a 
                  href="https://console.developers.google.com/apis/credentials" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Get your API key from Google Cloud Console</span>
                </a>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="client-id">Google Client ID</Label>
              <Input 
                id="client-id"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Enter your Google Client ID"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleInitialize} disabled={!apiKey || !clientId}>
                Initialize API
              </Button>
              <Button onClick={handleConnect} disabled={isLoading || !apiKey || !clientId}>
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    Connecting...
                  </>
                ) : (
                  "Connect Calendar"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Connection Status</h3>
                <p className="text-sm text-green-500 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  Connected to Google Calendar
                </p>
              </div>
              <Button variant="outline" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="calendar-select">Default Calendar</Label>
                <Select value={selectedCalendar} onValueChange={setSelectedCalendar}>
                  <SelectTrigger id="calendar-select">
                    <SelectValue placeholder="Select a calendar" />
                  </SelectTrigger>
                  <SelectContent>
                    {calendars.map((calendar) => (
                      <SelectItem key={calendar.id} value={calendar.id}>
                        {calendar.summary}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Sync Settings</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sync Tasks</p>
                    <p className="text-sm text-muted-foreground">
                      Add tasks with due dates to your calendar
                    </p>
                  </div>
                  <Switch
                    checked={syncSettings.syncTasks}
                    onCheckedChange={() => handleToggleSetting('syncTasks')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sync Habits</p>
                    <p className="text-sm text-muted-foreground">
                      Add recurring habits to your calendar
                    </p>
                  </div>
                  <Switch
                    checked={syncSettings.syncHabits}
                    onCheckedChange={() => handleToggleSetting('syncHabits')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sync Events</p>
                    <p className="text-sm text-muted-foreground">
                      Add time-blocking events to your calendar
                    </p>
                  </div>
                  <Switch
                    checked={syncSettings.syncEvents}
                    onCheckedChange={() => handleToggleSetting('syncEvents')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-Sync</p>
                    <p className="text-sm text-muted-foreground">
                      Automatically sync changes in realtime
                    </p>
                  </div>
                  <Switch
                    checked={syncSettings.autoSync}
                    onCheckedChange={() => handleToggleSetting('autoSync')}
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <Button>
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync Now
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleCalendarSettings;
