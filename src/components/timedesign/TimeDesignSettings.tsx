import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings, Clock, Calendar, Bell, Palette, Save, Check, X, RefreshCw, ExternalLink, Loader2, History } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useGoogleCalendar } from "@/hooks/use-google-calendar";
import { useSupabaseTimeDesignStorage } from "@/hooks/use-supabase-timedesign-storage";

interface TimeDesignSettingsProps {
  onImportEvents?: (events: any[]) => void;
}

const TimeDesignSettings: React.FC<TimeDesignSettingsProps> = ({ onImportEvents }) => {
  const { toast } = useToast();
  const {
    isConnected,
    isLinked,
    connectionStatus,
    isSyncing,
    lastSyncTime,
    syncSettings,
    connectGoogleCalendar,
    linkGoogleCalendar,
    disconnectGoogleCalendar,
    updateSyncSetting,
    fetchGoogleEvents,
    pushEventsToGoogle,
  } = useGoogleCalendar();
  
  const { activities, saveActivity } = useSupabaseTimeDesignStorage();
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Load settings from localStorage on component mount
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('timeDesignSettings');
    return saved ? JSON.parse(saved) : {
      workingHours: {
        enabled: true,
        start: "09:00",
        end: "17:00"
      },
      notifications: {
        enabled: true,
        beforeActivity: 15,
        dailyPlanning: true,
        weeklyReview: true
      },
      calendar: {
        defaultView: "week",
        weekStartsOn: "monday",
        showWeekends: true,
        timeSlotDuration: 30
      },
      appearance: {
        theme: "system",
        colorScheme: "default",
        showActivityColors: true,
        compactMode: false
      },
      automation: {
        autoSchedule: false,
        smartSuggestions: true,
        breakReminders: true,
        focusMode: false
      }
    };
  });

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    localStorage.setItem('timeDesignSettings', JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Your Time Design preferences have been updated successfully.",
    });
  };

  const handleConnectGoogle = async () => {
    setIsConnecting(true);
    try {
      // If already linked but not sync-ready, force an OAuth connect to obtain provider tokens.
      if (connectionStatus === "linked") {
        await connectGoogleCalendar();
      } else {
        await linkGoogleCalendar();
      }
    } catch {
      // Error handled in hook
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectGoogle = async () => {
    try {
      await disconnectGoogleCalendar();
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleSyncNow = async () => {
    try {
      const events = await fetchGoogleEvents();
      
      // Convert Google Calendar events to TimeActivity format and save
      let importedCount = 0;
      for (const event of events) {
        if (!event.isAllDay && event.startDateTime && event.endDateTime) {
          const startDate = new Date(event.startDateTime);
          const endDate = new Date(event.endDateTime);
          
          const activity: TimeActivity = {
            id: '', // Will be generated
            title: event.title,
            description: event.description || '',
            category: 'work', // Default category
            color: 'purple', // Default color
            startDate: startDate,
            endDate: endDate,
            startTime: startDate.toTimeString().slice(0, 5),
            endTime: endDate.toTimeString().slice(0, 5),
            syncWithGoogleCalendar: true,
          };
          
          await saveActivity(activity);
          importedCount++;
        }
      }
      
      toast({
        title: "Sync Complete",
        description: `Imported ${importedCount} events from Google Calendar.`,
      });
      
      if (onImportEvents) {
        onImportEvents(events);
      }
    } catch (error: any) {
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync with Google Calendar.",
        variant: "destructive",
      });
    }
  };

  const handleExportToGoogle = async () => {
    try {
      const eventsToExport = activities
        .filter(a => !a.syncWithGoogleCalendar)
        .map(activity => {
          const startDate = new Date(activity.startDate);
          const endDate = new Date(activity.endDate);
          const [startHour, startMin] = activity.startTime.split(':').map(Number);
          const [endHour, endMin] = activity.endTime.split(':').map(Number);
          
          startDate.setHours(startHour, startMin, 0, 0);
          endDate.setHours(endHour, endMin, 0, 0);
          
          return {
            title: activity.title,
            description: activity.description || '',
            startDateTime: startDate.toISOString(),
            endDateTime: endDate.toISOString(),
          };
        });

      if (eventsToExport.length === 0) {
        toast({
          title: "Nothing to Export",
          description: "No new activities to export to Google Calendar.",
        });
        return;
      }

      const results = await pushEventsToGoogle(eventsToExport);
      const successCount = results.filter((r: any) => r.success).length;
      
      toast({
        title: "Export Complete",
        description: `Exported ${successCount} of ${eventsToExport.length} activities to Google Calendar.`,
      });
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export to Google Calendar.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Google Calendar Integration */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Calendar className="h-5 w-5 text-primary" />
            Google Calendar Integration
          </CardTitle>
          <CardDescription className="text-slate-400">
            Connect your Google Calendar to sync events with the app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-200">Connection Status</p>
              <p className="text-sm text-slate-400">
                {connectionStatus === "connected"
                  ? "Connected to Google Calendar"
                  : connectionStatus === "linked"
                    ? "Linked (reconnect to enable sync)"
                    : "Not connected"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {connectionStatus === "connected" ? (
                <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">
                  <Check className="h-3 w-3 mr-1" /> Connected
                </Badge>
              ) : connectionStatus === "linked" ? (
                <Badge variant="outline" className="bg-amber-500/20 text-amber-300 border-amber-500/50">
                  <Check className="h-3 w-3 mr-1" /> Linked
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-slate-500/20 text-slate-400 border-slate-500/50">
                  <X className="h-3 w-3 mr-1" /> Not Connected
                </Badge>
              )}
            </div>
          </div>

          {isConnected && lastSyncTime && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <History className="h-4 w-4 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-slate-200">Last synced</p>
                <p className="text-xs text-slate-400">
                  {formatDistanceToNow(lastSyncTime, { addSuffix: true })}
                </p>
              </div>
              <p className="text-xs text-slate-500">
                {lastSyncTime.toLocaleString()}
              </p>
            </div>
          )}

          {isConnected && (
            <>
              <Separator className="bg-slate-700" />
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-slate-200">Sync Settings</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm text-slate-200">Import events from Google</label>
                    <p className="text-xs text-slate-400">Pull events from Google Calendar into this app</p>
                  </div>
                  <Switch 
                    checked={syncSettings.importEvents}
                    onCheckedChange={(value) => updateSyncSetting("importEvents", value)}
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-600"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm text-slate-200">Export events to Google</label>
                    <p className="text-xs text-slate-400">Push activities from this app to Google Calendar</p>
                  </div>
                  <Switch 
                    checked={syncSettings.exportEvents}
                    onCheckedChange={(value) => updateSyncSetting("exportEvents", value)}
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-600"
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between gap-2">
          {isConnected ? (
            <>
              <Button 
                variant="outline" 
                onClick={handleDisconnectGoogle}
                className="border-slate-600 text-slate-200 hover:bg-slate-800"
              >
                Disconnect
              </Button>
              <div className="flex gap-2">
                {syncSettings.exportEvents && (
                  <Button
                    variant="outline"
                    onClick={handleExportToGoogle}
                    disabled={isSyncing}
                    className="border-slate-600 text-slate-200 hover:bg-slate-800"
                  >
                    {isSyncing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <ExternalLink className="h-4 w-4 mr-2" />
                    )}
                    Export to Google
                  </Button>
                )}
                <Button
                  onClick={handleSyncNow}
                  disabled={isSyncing}
                  className="bg-gradient-to-r from-primary via-orange-500 to-red-500"
                >
                  {isSyncing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  {isSyncing ? "Syncing..." : "Sync Now"}
                </Button>
              </div>
            </>
          ) : (
            <Button
              className="w-full bg-gradient-to-r from-primary via-orange-500 to-red-500"
              onClick={handleConnectGoogle}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Calendar className="h-4 w-4 mr-2" />
              )}
              {isConnecting
                ? "Connecting..."
                : connectionStatus === "linked"
                  ? "Reconnect Google (Enable Sync)"
                  : "Connect Google Calendar"}
            </Button>
          )}
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Working Hours */}
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Clock className="h-5 w-5 text-primary" />
              Working Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="working-hours" className="text-slate-200">Enable working hours</Label>
              <Switch
                id="working-hours"
                checked={settings.workingHours.enabled}
                onCheckedChange={(checked) => handleSettingChange('workingHours', 'enabled', checked)}
                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-600"
              />
            </div>
            
            {settings.workingHours.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-200">Start Time</Label>
                  <Input
                    type="time"
                    value={settings.workingHours.start}
                    onChange={(e) => handleSettingChange('workingHours', 'start', e.target.value)}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-200">End Time</Label>
                  <Input
                    type="time"
                    value={settings.workingHours.end}
                    onChange={(e) => handleSettingChange('workingHours', 'end', e.target.value)}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-slate-200">Enable notifications</Label>
              <Switch
                checked={settings.notifications.enabled}
                onCheckedChange={(checked) => handleSettingChange('notifications', 'enabled', checked)}
                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-600"
              />
            </div>
            
            {settings.notifications.enabled && (
              <>
                <div className="space-y-2">
                  <Label className="text-slate-200">Remind before activity (minutes)</Label>
                  <Select
                    value={settings.notifications.beforeActivity.toString()}
                    onValueChange={(value) => handleSettingChange('notifications', 'beforeActivity', parseInt(value))}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="5" className="text-white">5 minutes</SelectItem>
                      <SelectItem value="10" className="text-white">10 minutes</SelectItem>
                      <SelectItem value="15" className="text-white">15 minutes</SelectItem>
                      <SelectItem value="30" className="text-white">30 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-slate-200">Daily planning reminder</Label>
                  <Switch
                    checked={settings.notifications.dailyPlanning}
                    onCheckedChange={(checked) => handleSettingChange('notifications', 'dailyPlanning', checked)}
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-600"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-slate-200">Weekly review reminder</Label>
                  <Switch
                    checked={settings.notifications.weeklyReview}
                    onCheckedChange={(checked) => handleSettingChange('notifications', 'weeklyReview', checked)}
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-600"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calendar Settings */}
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Calendar className="h-5 w-5 text-primary" />
              Calendar Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-200">Default View</Label>
              <Select
                value={settings.calendar.defaultView}
                onValueChange={(value) => handleSettingChange('calendar', 'defaultView', value)}
              >
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="day" className="text-white">Day View</SelectItem>
                  <SelectItem value="week" className="text-white">Week View</SelectItem>
                  <SelectItem value="month" className="text-white">Month View</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-200">Week Starts On</Label>
              <Select
                value={settings.calendar.weekStartsOn}
                onValueChange={(value) => handleSettingChange('calendar', 'weekStartsOn', value)}
              >
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="sunday" className="text-white">Sunday</SelectItem>
                  <SelectItem value="monday" className="text-white">Monday</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-slate-200">Show weekends</Label>
              <Switch
                checked={settings.calendar.showWeekends}
                onCheckedChange={(checked) => handleSettingChange('calendar', 'showWeekends', checked)}
                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-600"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-200">Time Slot Duration</Label>
              <Select
                value={settings.calendar.timeSlotDuration.toString()}
                onValueChange={(value) => handleSettingChange('calendar', 'timeSlotDuration', parseInt(value))}
              >
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="15" className="text-white">15 minutes</SelectItem>
                  <SelectItem value="30" className="text-white">30 minutes</SelectItem>
                  <SelectItem value="60" className="text-white">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Automation & AI */}
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Settings className="h-5 w-5 text-primary" />
              Automation & AI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-slate-200">Auto-schedule tasks</Label>
                <p className="text-xs text-slate-400">Automatically find time slots for your tasks</p>
              </div>
              <Switch
                checked={settings.automation.autoSchedule}
                onCheckedChange={(checked) => handleSettingChange('automation', 'autoSchedule', checked)}
                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-600"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-slate-200">Smart suggestions</Label>
                <p className="text-xs text-slate-400">Get AI-powered scheduling recommendations</p>
              </div>
              <Switch
                checked={settings.automation.smartSuggestions}
                onCheckedChange={(checked) => handleSettingChange('automation', 'smartSuggestions', checked)}
                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-600"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-slate-200">Break reminders</Label>
                <p className="text-xs text-slate-400">Remind me to take regular breaks</p>
              </div>
              <Switch
                checked={settings.automation.breakReminders}
                onCheckedChange={(checked) => handleSettingChange('automation', 'breakReminders', checked)}
                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-600"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-slate-200">Focus mode</Label>
                <p className="text-xs text-slate-400">Block distracting websites during work</p>
              </div>
              <Switch
                checked={settings.automation.focusMode}
                onCheckedChange={(checked) => handleSettingChange('automation', 'focusMode', checked)}
                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-600"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appearance Settings */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Palette className="h-5 w-5 text-primary" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-slate-200">Theme</Label>
              <Select
                value={settings.appearance.theme}
                onValueChange={(value) => handleSettingChange('appearance', 'theme', value)}
              >
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="light" className="text-white">Light</SelectItem>
                  <SelectItem value="dark" className="text-white">Dark</SelectItem>
                  <SelectItem value="system" className="text-white">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-200">Color Scheme</Label>
              <Select
                value={settings.appearance.colorScheme}
                onValueChange={(value) => handleSettingChange('appearance', 'colorScheme', value)}
              >
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="default" className="text-white">Default</SelectItem>
                  <SelectItem value="blue" className="text-white">Blue</SelectItem>
                  <SelectItem value="green" className="text-white">Green</SelectItem>
                  <SelectItem value="purple" className="text-white">Purple</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Label className="text-slate-200">Show activity colors</Label>
            <Switch
              checked={settings.appearance.showActivityColors}
              onCheckedChange={(checked) => handleSettingChange('appearance', 'showActivityColors', checked)}
              className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-600"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label className="text-slate-200">Compact mode</Label>
            <Switch
              checked={settings.appearance.compactMode}
              onCheckedChange={(checked) => handleSettingChange('appearance', 'compactMode', checked)}
              className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-600"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSaveSettings}
          className="bg-gradient-to-r from-primary via-orange-500 to-red-500 hover:from-primary/90 hover:via-orange-500/90 hover:to-red-500/90 text-white shadow-xl shadow-primary/25"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default TimeDesignSettings;
