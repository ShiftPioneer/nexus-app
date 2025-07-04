
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings, Clock, Calendar, Bell, Palette, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TimeDesignSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
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

  return (
    <div className="space-y-6">
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
