
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, HelpCircle, Bell, Lock, Palette, Moon, Sun } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Theme, useTheme } from "@/components/ui/theme-provider";
import AvatarSelector from "@/components/settings/AvatarSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  const navigate = useNavigate();
  const { user, signOut, updateUser } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [disabled, setDisabled] = React.useState(false);
  const { setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");
  const [notifications, setNotifications] = useState({
    email: true,
    pushNotifications: true,
    taskReminders: true,
    weeklyDigest: false,
  });

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    try {
      // Load profile data from localStorage
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfileData(parsedProfile);
        setName(parsedProfile.name || '');
        setAvatar(parsedProfile.avatar || '');
        
        // Load notification settings if they exist
        if (parsedProfile.notifications) {
          setNotifications(parsedProfile.notifications);
        }
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
      // Save data to localStorage before signing out
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
        theme: profileData?.theme || 'system',
        notifications: notifications,
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
        theme: profileData?.theme || 'system',
        notifications: notifications,
      };
      localStorage.setItem('userProfile', JSON.stringify(profile));
      setProfileData(profile);

      // Dispatch custom event for profile update
      const event = new CustomEvent('profileUpdated', { detail: profile });
      window.dispatchEvent(event);

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
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
  }, [name, avatar, profileData, notifications]);

  return (
    <AppLayout>
      <div className="container max-w-4xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <SettingsIcon className="h-6 w-6" />
              Settings
            </CardTitle>
            <CardDescription>Manage your account settings and preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
              </TabsList>
              
              {/* Profile Section */}
              <TabsContent value="profile" className="space-y-4">
                <h3 className="text-xl font-semibold">Personal Information</h3>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-shrink-0">
                    <AvatarSelector 
                      currentAvatar={avatar}
                      onAvatarChange={handleAvatarChange}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled
                  />
                </div>
                <Button onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Profile"}
                </Button>
              </TabsContent>
              
              {/* Appearance Section */}
              <TabsContent value="appearance" className="space-y-4">
                <h3 className="text-xl font-semibold">Appearance</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select 
                      disabled={disabled} 
                      value={profileData?.theme as Theme || "system"} 
                      onValueChange={(value: Theme) => {
                        setTheme(value);
                        const profile = { ...profileData, theme: value };
                        localStorage.setItem('userProfile', JSON.stringify(profile));
                        setProfileData(profile);
                        const event = new CustomEvent('profileUpdated', { detail: profile });
                        window.dispatchEvent(event);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light" className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          <span>Light</span>
                        </SelectItem>
                        <SelectItem value="dark" className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          <span>Dark</span>
                        </SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="color-scheme">Color Accent</Label>
                    <div className="grid grid-cols-6 gap-2">
                      {["#FF6500", "#0FA0CE", "#6E59A5", "#4CAF50", "#E91E63", "#9C27B0"].map((color) => (
                        <button
                          key={color}
                          className={`h-8 w-8 rounded-full border-2 ${
                            profileData?.accentColor === color ? "border-white ring-2 ring-offset-2" : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            const profile = { ...profileData, accentColor: color };
                            localStorage.setItem('userProfile', JSON.stringify(profile));
                            setProfileData(profile);
                            const event = new CustomEvent('profileUpdated', { detail: profile });
                            window.dispatchEvent(event);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="compact-mode">Compact Mode</Label>
                      <div className="text-sm text-muted-foreground">
                        Display more content with less spacing
                      </div>
                    </div>
                    <Switch
                      id="compact-mode"
                      checked={profileData?.compactMode || false}
                      onCheckedChange={(checked) => {
                        const profile = { ...profileData, compactMode: checked };
                        localStorage.setItem('userProfile', JSON.stringify(profile));
                        setProfileData(profile);
                        const event = new CustomEvent('profileUpdated', { detail: profile });
                        window.dispatchEvent(event);
                      }}
                    />
                  </div>
                </div>
              </TabsContent>
              
              {/* Notifications Section */}
              <TabsContent value="notifications" className="space-y-4">
                <h3 className="text-xl font-semibold">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <div className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </div>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notifications.email}
                      onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <div className="text-sm text-muted-foreground">
                        Receive notifications on your device
                      </div>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="task-reminders">Task Reminders</Label>
                      <div className="text-sm text-muted-foreground">
                        Get reminded about upcoming tasks
                      </div>
                    </div>
                    <Switch
                      id="task-reminders"
                      checked={notifications.taskReminders}
                      onCheckedChange={(checked) => handleNotificationChange('taskReminders', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="weekly-digest">Weekly Summary</Label>
                      <div className="text-sm text-muted-foreground">
                        Receive weekly progress reports
                      </div>
                    </div>
                    <Switch
                      id="weekly-digest"
                      checked={notifications.weeklyDigest}
                      onCheckedChange={(checked) => handleNotificationChange('weeklyDigest', checked)}
                    />
                  </div>
                  
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Notification Settings"}
                  </Button>
                </div>
              </TabsContent>
              
              {/* Privacy Section */}
              <TabsContent value="privacy" className="space-y-4">
                <h3 className="text-xl font-semibold">Privacy & Security</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <Button variant="outline">Change Password</Button>
                  
                  <div className="flex items-center justify-between pt-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                      <div className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </div>
                    </div>
                    <Switch
                      id="two-factor"
                      checked={false}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="data-sharing">Data Sharing</Label>
                      <div className="text-sm text-muted-foreground">
                        Allow sharing anonymous usage data to improve the app
                      </div>
                    </div>
                    <Switch
                      id="data-sharing"
                      checked={true}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Account Actions Section - Always visible */}
            <section className="space-y-4 pt-6 border-t mt-6">
              <h3 className="text-xl font-semibold">Account Actions</h3>
              <Button variant="destructive" onClick={handleSignOut}>
                Sign Out
              </Button>
            </section>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Settings;
