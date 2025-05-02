
import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Key, Languages, Bookmark, Send, Globe, CalendarCheck2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AvatarSelector from "@/components/settings/AvatarSelector";
import TagInput from "@/components/ui/tag-input";
import { useAuth } from "@/contexts/AuthContext";

const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Default profile data
  const defaultProfileData = {
    name: "",
    email: "",
    language: "english",
    timezone: "UTC+0",
    avatar: "/lovable-uploads/711b54f0-9fd8-47e2-b63e-704304865ed3.png",
    interests: ["productivity", "technology", "health"],
    bio: "Passionate about personal development and productivity.",
  };
  
  const [profileData, setProfileData] = useState(defaultProfileData);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    taskReminders: true,
    habitTracking: true,
    weeklyReport: true
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: false,
    shareProgress: false,
    dataCollection: true
  });
  
  const [calendarSettings, setCalendarSettings] = useState({
    googleCalendarSync: false,
    syncTasksToCalendar: true,
    syncEventsToTasks: true,
    syncFrequency: "hourly",
    autoAddNewEvents: true,
    calendarId: ""
  });

  // Load user profile data on component mount
  useEffect(() => {
    // Initialize with user email if available
    if (user) {
      setProfileData(prev => ({
        ...prev,
        email: user.email || ''
      }));
    }
    
    // Try to load from localStorage
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfileData(prev => ({
          ...prev,
          ...parsedProfile
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
    
    // Try to load stored settings
    try {
      const savedNotifications = localStorage.getItem('notificationSettings');
      if (savedNotifications) {
        setNotificationSettings(JSON.parse(savedNotifications));
      }
      
      const savedPrivacy = localStorage.getItem('privacySettings');
      if (savedPrivacy) {
        setPrivacySettings(JSON.parse(savedPrivacy));
      }
      
      const savedCalendar = localStorage.getItem('calendarSettings');
      if (savedCalendar) {
        setCalendarSettings(JSON.parse(savedCalendar));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, [user]);
  
  const handleSave = () => {
    // Save all settings to localStorage
    try {
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
      localStorage.setItem('privacySettings', JSON.stringify(privacySettings));
      localStorage.setItem('calendarSettings', JSON.stringify(calendarSettings));
      
      // Dispatch event to update components that use the profile data
      const event = new CustomEvent('profileUpdated', { detail: profileData });
      window.dispatchEvent(event);
      
      toast({
        title: "Settings Saved",
        description: "Your settings have been saved successfully."
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      });
    }
  };
  
  const updateProfileData = (field: string, value: string | string[]) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const toggleNotification = (setting: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };
  
  const togglePrivacySetting = (setting: string) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };
  
  const updateCalendarSetting = (setting: string, value: any) => {
    setCalendarSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  const handleAvatarChange = (avatar: string) => {
    updateProfileData("avatar", avatar);
  };
  
  const handleConnectGoogleCalendar = () => {
    if (calendarSettings.googleCalendarSync) {
      // Disconnect Google Calendar
      setCalendarSettings(prev => ({
        ...prev,
        googleCalendarSync: false,
        calendarId: ""
      }));
      
      toast({
        title: "Google Calendar Disconnected",
        description: "Your Google Calendar has been disconnected successfully."
      });
    } else {
      // In a real app, this would initiate the OAuth flow
      // For now, we'll simulate connecting
      setCalendarSettings(prev => ({
        ...prev,
        googleCalendarSync: true,
        calendarId: "primary"
      }));
      
      toast({
        title: "Google Calendar Connected",
        description: "Your Google Calendar has been connected successfully!"
      });
    }
  };
  
  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <SettingsIcon className="h-6 w-6 text-primary" />
              Settings
            </h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5 rounded-md">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your personal information and account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <AvatarSelector 
                    currentAvatar={profileData.avatar} 
                    onAvatarChange={handleAvatarChange}
                  />
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        value={profileData.name} 
                        onChange={e => updateProfileData("name", e.target.value)} 
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={profileData.email} 
                        onChange={e => updateProfileData("email", e.target.value)} 
                        disabled={!!user?.email}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input 
                      id="bio" 
                      value={profileData.bio} 
                      onChange={e => updateProfileData("bio", e.target.value)}
                      placeholder="Tell us about yourself"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interests">Interests</Label>
                    <TagInput
                      id="interests"
                      value={profileData.interests}
                      onChange={(tags) => updateProfileData("interests", tags)}
                      placeholder="Add interests..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Add tags that represent your interests (press Enter or comma to add)
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select value={profileData.language} onValueChange={value => updateProfileData("language", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="german">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select value={profileData.timezone} onValueChange={value => updateProfileData("timezone", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                          <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                          <SelectItem value="UTC+0">Greenwich Mean Time (UTC+0)</SelectItem>
                          <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
                          <SelectItem value="UTC+8">China Standard Time (UTC+8)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Account Preferences</CardTitle>
                <CardDescription>Configure your account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="plan">Current Plan</Label>
                    <p className="text-sm text-muted-foreground">Pro Plan - $9.99/month</p>
                  </div>
                  <Button variant="outline">Upgrade</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="delete-account">Delete Account</Label>
                    <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize your interface theme and display preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Theme</h3>
                    <div className="flex items-center gap-4">
                      <span>Toggle between light and dark mode: </span>
                      <ThemeToggle />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Layout Preferences</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="compact-view">Compact View</Label>
                          <p className="text-sm text-muted-foreground">
                            Reduce padding and spacing throughout the app
                          </p>
                        </div>
                        <Switch id="compact-view" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="sidebar-position">Sidebar Position</Label>
                          <p className="text-sm text-muted-foreground">
                            Choose where the sidebar is located
                          </p>
                        </div>
                        <Select defaultValue="left">
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Position" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="color-accent">Accent Color</Label>
                          <p className="text-sm text-muted-foreground">
                            Choose the app's primary accent color
                          </p>
                        </div>
                        <Select defaultValue="blue">
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Color" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="blue">Blue</SelectItem>
                            <SelectItem value="orange">Orange</SelectItem>
                            <SelectItem value="green">Green</SelectItem>
                            <SelectItem value="purple">Purple</SelectItem>
                            <SelectItem value="red">Red</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Channels</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                      </div>
                      <Switch id="email-notifications" checked={notificationSettings.email} onCheckedChange={() => toggleNotification('email')} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Get alerts on your device</p>
                      </div>
                      <Switch id="push-notifications" checked={notificationSettings.push} onCheckedChange={() => toggleNotification('push')} />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Types</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="task-reminders">Task Reminders</Label>
                        <p className="text-sm text-muted-foreground">Get reminded about upcoming tasks</p>
                      </div>
                      <Switch id="task-reminders" checked={notificationSettings.taskReminders} onCheckedChange={() => toggleNotification('taskReminders')} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="habit-tracking">Habit Tracking</Label>
                        <p className="text-sm text-muted-foreground">Get notified about habits to complete</p>
                      </div>
                      <Switch id="habit-tracking" checked={notificationSettings.habitTracking} onCheckedChange={() => toggleNotification('habitTracking')} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="weekly-report">Weekly Report</Label>
                        <p className="text-sm text-muted-foreground">Receive a weekly summary of your progress</p>
                      </div>
                      <Switch id="weekly-report" checked={notificationSettings.weeklyReport} onCheckedChange={() => toggleNotification('weeklyReport')} />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Quiet Hours</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="quiet-start">Start Time</Label>
                      <Select defaultValue="22:00">
                        <SelectTrigger>
                          <SelectValue placeholder="Start time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="20:00">8:00 PM</SelectItem>
                          <SelectItem value="21:00">9:00 PM</SelectItem>
                          <SelectItem value="22:00">10:00 PM</SelectItem>
                          <SelectItem value="23:00">11:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quiet-end">End Time</Label>
                      <Select defaultValue="07:00">
                        <SelectTrigger>
                          <SelectValue placeholder="End time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="06:00">6:00 AM</SelectItem>
                          <SelectItem value="07:00">7:00 AM</SelectItem>
                          <SelectItem value="08:00">8:00 AM</SelectItem>
                          <SelectItem value="09:00">9:00 AM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Manage your data and privacy preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Profile Privacy</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="public-profile">Public Profile</Label>
                        <p className="text-sm text-muted-foreground">Make your profile visible to others</p>
                      </div>
                      <Switch id="public-profile" checked={privacySettings.publicProfile} onCheckedChange={() => togglePrivacySetting('publicProfile')} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="share-progress">Share Progress</Label>
                        <p className="text-sm text-muted-foreground">Allow others to see your goal progress</p>
                      </div>
                      <Switch id="share-progress" checked={privacySettings.shareProgress} onCheckedChange={() => togglePrivacySetting('shareProgress')} />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Data Management</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="data-collection">Data Collection</Label>
                        <p className="text-sm text-muted-foreground">Allow us to collect anonymous usage data</p>
                      </div>
                      <Switch id="data-collection" checked={privacySettings.dataCollection} onCheckedChange={() => togglePrivacySetting('dataCollection')} />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button variant="outline" className="mr-2">Export Data</Button>
                    <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                      Clear All Data
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Connected Accounts</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Globe className="h-6 w-6" />
                        <div>
                          <p className="font-medium">Google</p>
                          <p className="text-sm text-muted-foreground">Calendar and contact sync</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Bookmark className="h-6 w-6" />
                        <div>
                          <p className="font-medium">Apple</p>
                          <p className="text-sm text-muted-foreground">Health and activity data</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarCheck2 className="h-5 w-5 text-primary" />
                  Calendar Integration
                </CardTitle>
                <CardDescription>Connect and synchronize with external calendar services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-md bg-red-100 dark:bg-red-900/30">
                      <CalendarCheck2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">Google Calendar</h4>
                      <p className="text-sm text-muted-foreground">Connect your Google Calendar account</p>
                    </div>
                  </div>
                  <Button 
                    variant={calendarSettings.googleCalendarSync ? "default" : "outline"} 
                    onClick={handleConnectGoogleCalendar}
                  >
                    {calendarSettings.googleCalendarSync ? "Disconnect" : "Connect"}
                  </Button>
                </div>
                
                {calendarSettings.googleCalendarSync && (
                  <div className="bg-muted/50 p-4 rounded-md">
                    <p className="text-sm mb-2">Connected Calendar ID:</p>
                    <Input 
                      value={calendarSettings.calendarId} 
                      onChange={e => updateCalendarSetting("calendarId", e.target.value)}
                      placeholder="primary"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Use "primary" for your main calendar, or the specific calendar ID from Google Calendar
                    </p>
                  </div>
                )}
                
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-medium">Sync Settings</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sync-tasks">Sync Tasks to Calendar</Label>
                        <p className="text-sm text-muted-foreground">Add your tasks to your connected calendar</p>
                      </div>
                      <Switch 
                        id="sync-tasks" 
                        disabled={!calendarSettings.googleCalendarSync} 
                        checked={calendarSettings.syncTasksToCalendar}
                        onCheckedChange={(checked) => updateCalendarSetting("syncTasksToCalendar", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sync-events">Import Calendar Events as Tasks</Label>
                        <p className="text-sm text-muted-foreground">Calendar events appear in your task list</p>
                      </div>
                      <Switch 
                        id="sync-events" 
                        disabled={!calendarSettings.googleCalendarSync}
                        checked={calendarSettings.syncEventsToTasks}
                        onCheckedChange={(checked) => updateCalendarSetting("syncEventsToTasks", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-add-events">Auto Add New Events</Label>
                        <p className="text-sm text-muted-foreground">Automatically create tasks for new calendar events</p>
                      </div>
                      <Switch 
                        id="auto-add-events" 
                        disabled={!calendarSettings.googleCalendarSync || !calendarSettings.syncEventsToTasks}
                        checked={calendarSettings.autoAddNewEvents}
                        onCheckedChange={(checked) => updateCalendarSetting("autoAddNewEvents", checked)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sync-frequency">Sync Frequency</Label>
                      <Select 
                        id="sync-frequency"
                        disabled={!calendarSettings.googleCalendarSync} 
                        value={calendarSettings.syncFrequency}
                        onValueChange={(value) => updateCalendarSetting("syncFrequency", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realtime">Real-time</SelectItem>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {calendarSettings.googleCalendarSync && (
                    <div className="mt-6 space-y-2">
                      <Button variant="outline" className="w-full">
                        Visit Google Calendar
                      </Button>
                      <Button variant="secondary" className="w-full">
                        Manual Sync Now
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Third-Party Integrations</CardTitle>
                <CardDescription>Connect with other productivity tools and services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900/30">
                        <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M10.5 14l4-4l-4-4v8zM19 3H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Notion</h4>
                        <p className="text-sm text-muted-foreground">Import and export data with Notion</p>
                      </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-md bg-purple-100 dark:bg-purple-900/30">
                        <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 3H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-7h2v7zm0-8h-2V7h2v2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Todoist</h4>
                        <p className="text-sm text-muted-foreground">Sync tasks with Todoist</p>
                      </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-md bg-green-100 dark:bg-green-900/30">
                        <svg className="h-6 w-6 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                          <path d="M14 9h-4v2h2v4h2V9z" />
                          <path d="M10 7h4v2h-4z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Evernote</h4>
                        <p className="text-sm text-muted-foreground">Import notes from Evernote</p>
                      </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
