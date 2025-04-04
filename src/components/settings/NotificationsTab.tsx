
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const NotificationsTab = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    desktop: false,
    taskReminders: true,
    habitReminders: true,
    goalUpdates: true,
    systemNotifications: true
  });

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
    <>
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
              <Switch 
                checked={notifications.taskReminders}
                onCheckedChange={() => handleToggleNotification("taskReminders")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Habit Reminders</h3>
                <p className="text-sm text-muted-foreground">Reminders to complete your daily habits</p>
              </div>
              <Switch 
                checked={notifications.habitReminders}
                onCheckedChange={() => handleToggleNotification("habitReminders")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Goal Updates</h3>
                <p className="text-sm text-muted-foreground">Updates on your goal progress</p>
              </div>
              <Switch 
                checked={notifications.goalUpdates}
                onCheckedChange={() => handleToggleNotification("goalUpdates")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">System Notifications</h3>
                <p className="text-sm text-muted-foreground">Updates about the platform</p>
              </div>
              <Switch 
                checked={notifications.systemNotifications}
                onCheckedChange={() => handleToggleNotification("systemNotifications")}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default NotificationsTab;
