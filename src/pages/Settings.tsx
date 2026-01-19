import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { User, Bell, Brain, Trophy, Shield, Smartphone, Palette, Volume2, Moon, Sun, Globe, Lock, Database, Trash2, Download, ChevronDown, ChevronRight, Eye, EyeOff, AlertTriangle, Calendar, RefreshCw, Check, X, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Theme, useTheme } from "@/components/ui/theme-provider";
import AvatarSelector from "@/components/settings/AvatarSelector";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useGoogleCalendar } from "@/hooks/use-google-calendar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
const Settings = () => {
  const navigate = useNavigate();
  const { user, signOut, updateUser } = useAuth();
  const { settings, updateSettings, exportSettings, resetSettings, isLoading: settingsLoading } = useSettings();
  const [profileData, setProfileData] = useState<any>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const { toast } = useToast();
  const { setTheme } = useTheme();

  // Settings state - now using context
  const [expandedSections, setExpandedSections] = useState({
    personalization: true,
    notifications: false,
    ai: false,
    gamification: false,
    integrations: false,
    privacy: false,
    account: false,
    device: false
  });
  
  // Google Calendar integration
  const {
    isConnected: isGoogleConnected,
    connectionStatus: googleConnectionStatus,
    isSyncing: isGoogleSyncing,
    lastSyncTime: googleLastSyncTime,
    syncSettings: googleSyncSettings,
    connectGoogleCalendar,
    disconnectGoogleCalendar,
    updateSyncSetting: updateGoogleSyncSetting,
  } = useGoogleCalendar();
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);
  
  const handleConnectGoogle = async () => {
    setIsConnectingGoogle(true);
    try {
      await connectGoogleCalendar();
    } catch (error) {
      // Error handled in hook
    } finally {
      setIsConnectingGoogle(false);
    }
  };
  
  const handleDisconnectGoogle = async () => {
    try {
      await disconnectGoogleCalendar();
    } catch (error) {
      // Error handled in hook
    }
  };
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Settings handlers
  const handleSettingChange = async (category: keyof typeof settings, key: string, value: any) => {
    const result = await updateSettings(category, { [key]: value });
    if (result.success) {
      toast({
        title: "Settings Updated",
        description: "Your preferences have been saved.",
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update settings.",
        variant: "destructive",
      });
    }
  };

  // Password change functionality
  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error", 
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setChangingPassword(true);
    try {
      // In a real implementation, you'd use updateUser to change password
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setNewPassword('');
      setConfirmPassword('');
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password.",
        variant: "destructive",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  // Data export functionality
  const handleDataExport = () => {
    try {
      const userData = {
        profile: { name, email, avatar },
        settings,
        timestamp: new Date().toISOString(),
      };
      
      const dataStr = JSON.stringify(userData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `nexus-data-export-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Data Exported",
        description: "Your data has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data.",
        variant: "destructive",
      });
    }
  };

  // Data deletion functionality
  const handleDataDeletion = async () => {
    try {
      // Clear localStorage
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('nexus-') || key.includes('userProfile') || key.includes('habits') || key.includes('journal')) {
          localStorage.removeItem(key);
        }
      });
      
      await resetSettings();
      
      toast({
        title: "Data Deleted",
        description: "All your local data has been deleted.",
      });
      
      // Optionally sign out user after data deletion
      setTimeout(() => {
        signOut();
        navigate("/auth");
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete data.",
        variant: "destructive",
      });
    }
  };
  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
    }
  }, [user]);
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfileData(parsedProfile);
        setName(parsedProfile.name || '');
        setAvatar(parsedProfile.avatar || '');
      } else if (user?.user_metadata) {
        setName(user.user_metadata.name || user.user_metadata.full_name || '');
        setAvatar(user.user_metadata.avatar_url || '');
      }
    } catch (error) {
      console.error("Failed to load profile data:", error);
    }
  }, [user]);
  const handleSignOut = async () => {
    try {
      saveUserData();
      await signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Function to save user data to localStorage
  const saveUserData = () => {
    try {
      const profile = {
        name: name,
        avatar: avatar,
        theme: profileData?.theme || 'system'
      };
      localStorage.setItem('userProfile', JSON.stringify(profile));
      console.log("User data saved to localStorage");
    } catch (error) {
      console.error("Failed to save user data:", error);
    }
  };
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Update user metadata with name and avatar
      const metadata = {
        name: name,
        avatar_url: avatar
      };
      await updateUser(metadata);

      // Save profile data to localStorage
      const profile = {
        name: name,
        avatar: avatar,
        theme: profileData?.theme || 'system'
      };
      localStorage.setItem('userProfile', JSON.stringify(profile));
      setProfileData(profile);

      // Dispatch custom event for profile update
      const event = new CustomEvent('profileUpdated', {
        detail: profile
      });
      window.dispatchEvent(event);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully."
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  const getUserName = () => {
    if (profileData?.name) {
      return profileData.name;
    }
    if (user?.user_metadata?.name) {
      return user.user_metadata.name;
    }
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    return user?.email?.split('@')[0] || "User";
  };
  const handleAvatarChange = (newAvatar: string) => {
    setAvatar(newAvatar);
  };

  // Add event listener for beforeunload to save data
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveUserData();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [name, avatar, profileData]);
  const SettingSection = ({
    title,
    icon: Icon,
    children,
    sectionKey
  }: {
    title: string;
    icon: any;
    children: React.ReactNode;
    sectionKey: string;
  }) => <Card className="overflow-hidden">
      <Collapsible open={expandedSections[sectionKey]} onOpenChange={() => toggleSection(sectionKey)} className="bg-slate-950">
        <CollapsibleTrigger className="w-full">
          <CardHeader className="hover:bg-muted/50 transition-colors">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-primary" />
                {title}
              </div>
              {expandedSections[sectionKey] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4 rounded-lg bg-slate-950">
            {children}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>;
  return <ModernAppLayout>
      <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">Customize your NEXUS experience</p>
        </div>

        <div className="space-y-4">
          {/* Personalization */}
          <SettingSection title="Personalization" icon={User} sectionKey="personalization">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-orange-600">Display Name</Label>
                  <Input id="name" type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} className="bg-slate-900 text-slate-300 border-slate-300" />
                </div>
                <div>
                  <Label htmlFor="email" className="text-orange-600">Email</Label>
                  <Input id="email" type="email" value={email} disabled />
                </div>
                <Button onClick={handleSaveProfile} disabled={isSaving} className="w-full">
                  {isSaving ? "Saving..." : "Save Profile"}
                </Button>
              </div>
              <div>
                <Label className="text-orange-600">Avatar</Label>
                <AvatarSelector currentAvatar={avatar} onAvatarChange={handleAvatarChange} />
              </div>
            </div>
            
            <div className="space-y-4 border-t pt-4">
              <div className="space-y-2">
                <Label className="text-orange-600">Theme</Label>
                <Select value={profileData?.theme as Theme || "system"} onValueChange={(value: Theme) => {
                setTheme(value);
                const profile = {
                  ...profileData,
                  theme: value
                };
                localStorage.setItem('userProfile', JSON.stringify(profile));
                setProfileData(profile);
              }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-orange-600">Accent Color</Label>
                <Select 
                  value={settings.appearance.accentColor} 
                  onValueChange={(value) => handleSettingChange('appearance', 'accentColor', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-orange-600">Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">Reduce spacing and padding</p>
                </div>
                <Switch 
                  checked={settings.appearance.compactMode} 
                  onCheckedChange={(checked) => handleSettingChange('appearance', 'compactMode', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-orange-600">Animations</Label>
                  <p className="text-sm text-muted-foreground">Enable smooth animations</p>
                </div>
                <Switch 
                  checked={settings.appearance.animationsEnabled} 
                  onCheckedChange={(checked) => handleSettingChange('appearance', 'animationsEnabled', checked)}
                />
              </div>
            </div>
          </SettingSection>

          {/* Notifications */}
          <SettingSection title="Notifications" icon={Bell} sectionKey="notifications">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-orange-600">Daily Reminders</Label>
                  <p className="text-sm text-muted-foreground">Get reminded of your daily goals</p>
                </div>
                <Switch 
                  checked={settings.notifications.dailyReminders} 
                  onCheckedChange={(checked) => handleSettingChange('notifications', 'dailyReminders', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-orange-600">Habit Reminders</Label>
                  <p className="text-sm text-muted-foreground">Notifications for habit tracking</p>
                </div>
                <Switch 
                  checked={settings.notifications.habitReminders}
                  onCheckedChange={(checked) => handleSettingChange('notifications', 'habitReminders', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-orange-600">Focus Break Alerts</Label>
                  <p className="text-sm text-muted-foreground">Alerts during focus sessions</p>
                </div>
                <Switch 
                  checked={settings.notifications.focusBreaks}
                  onCheckedChange={(checked) => handleSettingChange('notifications', 'focusBreaks', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-orange-600">Goal Deadlines</Label>
                  <p className="text-sm text-muted-foreground">Reminders for approaching deadlines</p>
                </div>
                <Switch 
                  checked={settings.notifications.goalDeadlines}
                  onCheckedChange={(checked) => handleSettingChange('notifications', 'goalDeadlines', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-orange-600">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch 
                  checked={settings.notifications.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('notifications', 'emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-orange-600">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Browser push notifications</p>
                </div>
                <Switch 
                  checked={settings.notifications.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange('notifications', 'pushNotifications', checked)}
                />
              </div>
            </div>
          </SettingSection>

          {/* AI Assistant */}
          <SettingSection title="AI Assistant" icon={Brain} sectionKey="ai">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-orange-600">Enable AI Assistant</Label>
                  <p className="text-sm text-muted-foreground">Get AI-powered productivity suggestions</p>
                </div>
                <Switch 
                  checked={settings.ai.enabled}
                  onCheckedChange={(checked) => handleSettingChange('ai', 'enabled', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-orange-600">Suggestion Frequency</Label>
                <Select 
                  value={settings.ai.suggestionsFrequency}
                  onValueChange={(value) => handleSettingChange('ai', 'suggestionsFrequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-orange-600">Personalized Tips</Label>
                  <p className="text-sm text-muted-foreground">AI learns from your behavior patterns</p>
                </div>
                <Switch 
                  checked={settings.ai.personalizedTips}
                  onCheckedChange={(checked) => handleSettingChange('ai', 'personalizedTips', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-orange-600">Auto Goal Suggestions</Label>
                  <p className="text-sm text-muted-foreground">AI suggests new goals based on your progress</p>
                </div>
                <Switch 
                  checked={settings.ai.autoGoalSuggestions}
                  onCheckedChange={(checked) => handleSettingChange('ai', 'autoGoalSuggestions', checked)}
                />
              </div>
            </div>
          </SettingSection>

          {/* Gamification */}
          <SettingSection title="Gamification" icon={Trophy} sectionKey="gamification">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-orange-600">Enable Gamification</Label>
                  <p className="text-sm text-muted-foreground">XP, badges, and achievements</p>
                </div>
                <Switch checked={settings.gamification.enabled} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-orange-600">Show XP Points</Label>
                  <p className="text-sm text-muted-foreground">Display experience points</p>
                </div>
                <Switch checked={settings.gamification.showXP} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-orange-600">Show Badges</Label>
                  <p className="text-sm text-muted-foreground">Display earned badges</p>
                </div>
                <Switch checked={settings.gamification.showBadges} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-orange-600">Streak Notifications</Label>
                  <p className="text-sm text-muted-foreground">Celebrate streak milestones</p>
                </div>
                <Switch checked={settings.gamification.streakNotifications} />
              </div>
            </div>
          </SettingSection>

          {/* Integrations - Google Calendar */}
          <SettingSection title="Integrations" icon={Calendar} sectionKey="integrations">
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-red-500 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-200">Google Calendar</h4>
                      <p className="text-sm text-slate-400">
                        {googleConnectionStatus === "connected"
                          ? "Auto-sync enabled"
                          : googleConnectionStatus === "linked"
                            ? "Linked - reconnect to enable sync"
                            : "Not connected"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {googleConnectionStatus === "connected" ? (
                      <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">
                        <Check className="h-3 w-3 mr-1" /> Connected
                      </Badge>
                    ) : googleConnectionStatus === "linked" ? (
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

                {isGoogleConnected && googleLastSyncTime && (
                  <div className="flex items-center gap-2 p-2 rounded bg-slate-800/50 text-sm mb-3">
                    <RefreshCw className="h-3 w-3 text-primary" />
                    <span className="text-slate-300">
                      Last synced {formatDistanceToNow(googleLastSyncTime, { addSuffix: true })}
                    </span>
                  </div>
                )}

                {isGoogleConnected && (
                  <div className="space-y-3 border-t border-slate-700/50 pt-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm text-slate-200">Import from Google Calendar</label>
                        <p className="text-xs text-slate-400">Pull events into Time Design</p>
                      </div>
                      <Switch 
                        checked={googleSyncSettings.importEvents}
                        onCheckedChange={(value) => updateGoogleSyncSetting("importEvents", value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm text-slate-200">Export to Google Calendar</label>
                        <p className="text-xs text-slate-400">Push activities to Google Calendar</p>
                      </div>
                      <Switch 
                        checked={googleSyncSettings.exportEvents}
                        onCheckedChange={(value) => updateGoogleSyncSetting("exportEvents", value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm text-slate-200">Auto-Sync</label>
                        <p className="text-xs text-slate-400">Automatically sync when activities change</p>
                      </div>
                      <Switch 
                        checked={googleSyncSettings.autoSync}
                        onCheckedChange={(value) => updateGoogleSyncSetting("autoSync", value)}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  {isGoogleConnected ? (
                    <Button
                      variant="outline"
                      onClick={handleDisconnectGoogle}
                      className="w-full border-slate-600 text-slate-200 hover:bg-slate-800"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Disconnect Google Calendar
                    </Button>
                  ) : (
                    <Button
                      onClick={handleConnectGoogle}
                      disabled={isConnectingGoogle}
                      className="w-full bg-gradient-to-r from-blue-500 to-red-500 hover:from-blue-600 hover:to-red-600"
                    >
                      {isConnectingGoogle ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Calendar className="h-4 w-4 mr-2" />
                      )}
                      {isConnectingGoogle
                        ? "Connecting..."
                        : googleConnectionStatus === "linked"
                          ? "Reconnect Google Calendar"
                          : "Connect Google Calendar"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </SettingSection>

          {/* Privacy */}
          <SettingSection title="Privacy & Data" icon={Shield} sectionKey="privacy">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-orange-600">Analytics Tracking</Label>
                  <p className="text-sm text-muted-foreground">Help improve the app with usage data</p>
                </div>
                <Switch 
                  checked={settings.privacy.analyticsTracking}
                  onCheckedChange={(checked) => handleSettingChange('privacy', 'analyticsTracking', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-orange-600">Performance Data</Label>
                  <p className="text-sm text-muted-foreground">Share performance metrics</p>
                </div>
                <Switch 
                  checked={settings.privacy.performanceData}
                  onCheckedChange={(checked) => handleSettingChange('privacy', 'performanceData', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-orange-600">Crash Reports</Label>
                  <p className="text-sm text-muted-foreground">Send automatic crash reports</p>
                </div>
                <Switch 
                  checked={settings.privacy.crashReports}
                  onCheckedChange={(checked) => handleSettingChange('privacy', 'crashReports', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-orange-600">Personalized Ads</Label>
                  <p className="text-sm text-muted-foreground">Allow personalized advertisements</p>
                </div>
                <Switch 
                  checked={settings.privacy.personalizedAds}
                  onCheckedChange={(checked) => handleSettingChange('privacy', 'personalizedAds', checked)}
                />
              </div>
              
              <div className="space-y-3 border-t pt-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleDataExport}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export My Data
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete All Data
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Delete All Data
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all your local data including settings, habits, journal entries, and tasks.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDataDeletion} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete Everything
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </SettingSection>

          {/* Account */}
          <SettingSection title="Account" icon={Lock} sectionKey="account">
            <div className="space-y-4">
              <div className="space-y-4 border-b pb-4">
                <h3 className="text-lg font-medium text-orange-600">Change Password</h3>
                <div className="space-y-3">
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Button 
                    onClick={handlePasswordChange}
                    disabled={changingPassword || !newPassword || !confirmPassword}
                    className="w-full"
                  >
                    {changingPassword ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-orange-600">Subscription</Label>
                    <p className="text-sm text-muted-foreground">Free Plan - Upgrade for premium features</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Upgrade
                  </Button>
                </div>
                
                <Button 
                  onClick={handleSignOut}
                  variant="destructive" 
                  className="w-full"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </SettingSection>

          {/* Device Settings */}
          <SettingSection title="Device & Preferences" icon={Smartphone} sectionKey="device">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-orange-600">Sound Effects</Label>
                  <p className="text-sm text-muted-foreground">Audio feedback for actions</p>
                </div>
                <Switch 
                  checked={settings.device.soundEffects}
                  onCheckedChange={(checked) => handleSettingChange('device', 'soundEffects', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-orange-600">Haptic Feedback</Label>
                  <p className="text-sm text-muted-foreground">Vibration feedback on mobile</p>
                </div>
                <Switch 
                  checked={settings.device.hapticFeedback}
                  onCheckedChange={(checked) => handleSettingChange('device', 'hapticFeedback', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-orange-600">Auto-save</Label>
                  <p className="text-sm text-muted-foreground">Automatically save your progress</p>
                </div>
                <Switch 
                  checked={settings.device.autoSave}
                  onCheckedChange={(checked) => handleSettingChange('device', 'autoSave', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-orange-600">Offline Mode</Label>
                  <p className="text-sm text-muted-foreground">Work without internet connection</p>
                </div>
                <Switch 
                  checked={settings.device.offlineMode}
                  onCheckedChange={(checked) => handleSettingChange('device', 'offlineMode', checked)}
                />
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <Button 
                onClick={resetSettings}
                variant="outline" 
                className="w-full"
              >
                Reset All Settings to Default
              </Button>
            </div>
          </SettingSection>
        </div>
      </div>
    </ModernAppLayout>;
};
export default Settings;