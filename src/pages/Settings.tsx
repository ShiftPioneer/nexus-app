
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
import { Settings as SettingsIcon, HelpCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Theme, useTheme } from "@/components/ui/theme-provider";
import AvatarSelector from "@/components/settings/AvatarSelector";

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

  return (
    <AppLayout>
      <div className="container max-w-4xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Settings</CardTitle>
            <CardDescription>Manage your account settings and preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Section */}
            <section className="space-y-4">
              <h3 className="text-xl font-semibold">Profile</h3>
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
            </section>

            {/* Appearance Section */}
            <section className="space-y-4">
              <h3 className="text-xl font-semibold">Appearance</h3>
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
                  <SelectTrigger>
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </section>

            {/* Account Actions Section */}
            <section className="space-y-4">
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
