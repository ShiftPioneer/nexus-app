
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import TagInput from "@/components/ui/tag-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Use safe access to user properties
  const userDisplayName = user?.displayName || "User";
  const userEmail = user?.email || "";
  const userPhotoURL = user?.photoURL || undefined;

  const [userName, setUserName] = useState(userDisplayName);
  const [email, setEmail] = useState(userEmail);
  const [currentPassword, setCurrentPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    desktop: false
  });
  const [appearance, setAppearance] = useState("system");
  const [interests, setInterests] = useState<string[]>(["productivity", "self-improvement"]);
  const [bio, setBio] = useState("Hi there! I'm using Nexus to improve my productivity and reach my goals.");

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved",
      duration: 3000,
    });
  };

  const handleChangePassword = () => {
    toast({
      title: "Password Reset Email Sent",
      description: "Check your inbox for instructions to reset your password",
      duration: 3000,
    });
  };

  const handleToggleNotification = (type: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [type]: !notifications[type]
    });

    toast({
      title: "Notification Settings Updated",
      description: `${type} notifications ${notifications[type] ? "disabled" : "enabled"}`,
      duration: 3000,
    });
  };

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-3 md:inline-flex">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="md:w-1/3">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={userName} 
                      onChange={(e) => setUserName(e.target.value)} 
                    />
                  </div>
                  <div className="md:w-2/3">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      disabled 
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <textarea 
                    id="bio" 
                    className="w-full min-h-[100px] p-2 rounded-md border border-input bg-background" 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="interests" className="mb-1 block">Interests</Label>
                  <TagInput
                    id="interests"
                    placeholder="Add interests..."
                    value={interests}
                    onChange={setInterests}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    These will help personalize your experience
                  </p>
                </div>
                
                <Button onClick={handleSaveProfile}>Save Profile</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Avatar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  {/* Avatar options would go here */}
                  <div className="border-2 border-primary rounded-full p-1">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                      {userDisplayName.charAt(0)}
                    </div>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                    {userDisplayName.charAt(0)}
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-xl font-bold">
                    {userDisplayName.charAt(0)}
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-white text-xl font-bold">
                    {userDisplayName.charAt(0)}
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xl font-bold">
                    {userDisplayName.charAt(0)}
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-600 to-gray-900 flex items-center justify-center text-white text-xl font-bold">
                    {userDisplayName.charAt(0)}
                  </div>
                  <Button variant="outline" className="w-16 h-16 rounded-full flex items-center justify-center">
                    +
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="flex">
                    <Input 
                      id="current-password"
                      type={showPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      className="ml-2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </div>
                </div>
                <Button onClick={handleChangePassword}>Change Password</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant={appearance === "light" ? "default" : "outline"}
                    onClick={() => setAppearance("light")}
                  >
                    Light
                  </Button>
                  <Button 
                    variant={appearance === "dark" ? "default" : "outline"}
                    onClick={() => setAppearance("dark")}
                  >
                    Dark
                  </Button>
                  <Button 
                    variant={appearance === "system" ? "default" : "outline"}
                    onClick={() => setAppearance("system")}
                  >
                    System
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-muted-foreground mb-2">Export your data or delete your account</p>
                  <div className="flex gap-2">
                    <Button variant="outline">Export Data</Button>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Switch 
                      checked={notifications.email} 
                      onCheckedChange={() => handleToggleNotification("email")} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Push Notifications</h3>
                      <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                    </div>
                    <Switch 
                      checked={notifications.push} 
                      onCheckedChange={() => handleToggleNotification("push")} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Desktop Notifications</h3>
                      <p className="text-sm text-muted-foreground">Receive desktop notifications when in browser</p>
                    </div>
                    <Switch 
                      checked={notifications.desktop} 
                      onCheckedChange={() => handleToggleNotification("desktop")} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Notification Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Task Reminders</h3>
                      <p className="text-sm text-muted-foreground">Reminders about upcoming tasks</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Habit Reminders</h3>
                      <p className="text-sm text-muted-foreground">Reminders to complete your daily habits</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Goal Updates</h3>
                      <p className="text-sm text-muted-foreground">Updates on your goal progress</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">System Notifications</h3>
                      <p className="text-sm text-muted-foreground">Updates about the platform</p>
                    </div>
                    <Switch defaultChecked />
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
