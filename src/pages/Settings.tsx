
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { User, Bell, Brain, Trophy, Shield, Smartphone, Palette, Volume2, Moon, Sun, Globe, Lock, Database, Trash2, Download, ChevronDown, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Theme, useTheme } from "@/components/ui/theme-provider";
import AvatarSelector from "@/components/settings/AvatarSelector";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
const Settings = () => {
  const navigate = useNavigate();
  const {
    user,
    signOut,
    updateUser
  } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const {
    toast
  } = useToast();
  const {
    setTheme
  } = useTheme();

  // Settings state
  const [settings, setSettings] = useState({
    notifications: {
      dailyReminders: true,
      habitReminders: true,
      focusBreaks: true,
      goalDeadlines: true,
      emailNotifications: false,
      pushNotifications: true
    },
    ai: {
      enabled: true,
      suggestionsFrequency: 'daily',
      personalizedTips: true,
      autoGoalSuggestions: true
    },
    gamification: {
      enabled: true,
      showXP: true,
      showBadges: true,
      showLeaderboard: false,
      streakNotifications: true
    },
    appearance: {
      theme: 'system',
      accentColor: 'blue',
      compactMode: false,
      animationsEnabled: true
    },
    privacy: {
      analyticsTracking: true,
      performanceData: true,
      crashReports: true,
      personalizedAds: false
    },
    device: {
      soundEffects: true,
      hapticFeedback: true,
      autoSave: true,
      offlineMode: true
    }
  });
  const [expandedSections, setExpandedSections] = useState({
    personalization: true,
    notifications: false,
    ai: false,
    gamification: false,
    privacy: false,
    account: false,
    device: false
  });
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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
                  <Input id="name" type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} className="bg-slate-900" />
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
                <Select value={settings.appearance.accentColor}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                  </SelectContent>
                </Select>
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
                <Switch checked={settings.notifications.dailyReminders} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-orange-600">Habit Reminders</Label>
                  <p className="text-sm text-muted-foreground">Notifications for habit tracking</p>
                </div>
                <Switch checked={settings.notifications.habitReminders} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-orange-600">Focus Break Alerts</Label>
                  <p className="text-sm text-muted-foreground">Alerts during focus sessions</p>
                </div>
                <Switch checked={settings.notifications.focusBreaks} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-orange-600">Goal Deadlines</Label>
                  <p className="text-sm text-muted-foreground">Reminders for approaching deadlines</p>
                </div>
                <Switch checked={settings.notifications.goalDeadlines} />
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
                <Switch checked={settings.ai.enabled} />
              </div>
              
              <div className="space-y-2">
                <Label className="text-orange-600">Suggestion Frequency</Label>
                <Select value={settings.ai.suggestionsFrequency}>
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
                <Switch checked={settings.ai.personalizedTips} />
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

          {/* Privacy */}
          <SettingSection title="Privacy & Data" icon={Shield} sectionKey="privacy">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-orange-600">Analytics Tracking</Label>
                  <p className="text-sm text-muted-foreground">Help improve the app with usage data</p>
                </div>
                <Switch checked={settings.privacy.analyticsTracking} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-orange-600">Performance Data</Label>
                  <p className="text-sm text-muted-foreground">Share performance metrics</p>
                </div>
                <Switch checked={settings.privacy.performanceData} />
              </div>
              
              <div className="space-y-3 border-t pt-4">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export My Data
                </Button>
                <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete All Data
                </Button>
              </div>
            </div>
          </SettingSection>

          {/* Account */}
          <SettingSection title="Account" icon={Lock} sectionKey="account">
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2 text-orange-600">Account Status</h4>
                <p className="text-sm text-muted-foreground mb-3">Pro Plan - All features unlocked</p>
                <Button variant="outline" size="sm">Manage Subscription</Button>
              </div>
              
              <div className="space-y-3 border-t pt-4">
                <Button variant="outline" className="w-full">
                  Change Password
                </Button>
                <Button variant="destructive" onClick={handleSignOut} className="w-full">
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
                <Switch checked={settings.device.soundEffects} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-orange-600">Auto-save</Label>
                  <p className="text-sm text-muted-foreground">Automatically save your progress</p>
                </div>
                <Switch checked={settings.device.autoSave} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-orange-600">Animations</Label>
                  <p className="text-sm text-muted-foreground">Enable smooth transitions</p>
                </div>
                <Switch checked={settings.appearance.animationsEnabled} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-orange-600">Offline Mode</Label>
                  <p className="text-sm text-muted-foreground">Work without internet connection</p>
                </div>
                <Switch checked={settings.device.offlineMode} />
              </div>
            </div>
          </SettingSection>
        </div>
      </div>
    </ModernAppLayout>;
};
export default Settings;
