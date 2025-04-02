import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Key, Languages, Bookmark, Send, Globe } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
const Settings = () => {
  const {
    toast
  } = useToast();
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    language: "english",
    timezone: "UTC+0"
  });
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
  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully."
    });
  };
  const updateProfileData = (field: string, value: string) => {
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
  return <AppLayout>
      <div className="animate-fade-in space-y-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 mx-0">
              <SettingsIcon className="h-6 w-6 text-primary" />
              Settings
            </h1>
            <p className="text-muted-foreground my-[10px] mx-0">Manage your account settings and preferences</p>
          </div>
          <Button onClick={handleSave} className="my-[30px] text-right mx-[200px]">Save Changes</Button>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 rounded-md height-[30px] px-[10px] py-0 my-[20px]">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="appearance" className="my-0">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your personal information and account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Button variant="outline">Change Avatar</Button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" value={profileData.name} onChange={e => updateProfileData("name", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={profileData.email} onChange={e => updateProfileData("email", e.target.value)} />
                    </div>
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
        </Tabs>
      </div>
    </AppLayout>;
};
export default Settings;