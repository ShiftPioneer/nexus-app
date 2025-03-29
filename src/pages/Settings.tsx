
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  
  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully.",
    });
  };

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your personal information and account settings</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-8">
                <User className="h-16 w-16 text-muted-foreground mb-4" />
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Profile Settings Coming Soon</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    This section will allow you to update your profile information, 
                    change your password, and manage account settings.
                  </p>
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
                  <div>
                    <h3 className="text-lg font-medium mb-4">Other Display Options</h3>
                    <p className="text-muted-foreground mb-4">
                      More appearance customization options coming soon!
                    </p>
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
              <CardContent className="flex justify-center py-8">
                <Bell className="h-16 w-16 text-muted-foreground mb-4" />
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Notification Settings Coming Soon</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    This section will allow you to customize your notification preferences,
                    including task reminders, habit tracking alerts, and system notifications.
                  </p>
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
              <CardContent className="flex justify-center py-8">
                <Shield className="h-16 w-16 text-muted-foreground mb-4" />
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Privacy Settings Coming Soon</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    This section will allow you to manage your data privacy settings,
                    export your data, and control how your information is used.
                  </p>
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
