
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink } from "lucide-react";

const TimeDesignSettings: React.FC = () => {
  const [googleCalendarConnected, setGoogleCalendarConnected] = useState(false);
  const { toast } = useToast();

  const handleGoogleCalendarConnect = () => {
    // In a real implementation, this would use OAuth 2.0 flow to connect to Google Calendar API
    // For now, we'll simulate a successful connection
    setGoogleCalendarConnected(!googleCalendarConnected);
    
    if (!googleCalendarConnected) {
      toast({
        title: "Google Calendar Connected",
        description: "Your Google Calendar has been successfully connected.",
      });
    } else {
      toast({
        title: "Google Calendar Disconnected",
        description: "Your Google Calendar has been disconnected.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Calendar Integration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="google-calendar" className="font-medium">Connect your Google Calendar to sync activities</Label>
            <p className="text-sm text-muted-foreground mt-1">
              {googleCalendarConnected ? (
                <span className="text-green-500">Connected</span>
              ) : (
                "Not Connected"
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Switch 
              id="google-calendar" 
              checked={googleCalendarConnected} 
              onCheckedChange={handleGoogleCalendarConnect}
            />
            {googleCalendarConnected && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => window.open("https://calendar.google.com", "_blank")}
              >
                <ExternalLink className="h-3 w-3" />
                Open Calendar
              </Button>
            )}
          </div>
        </div>
        
        {googleCalendarConnected && (
          <div className="mt-4 p-4 bg-muted rounded-md">
            <h4 className="font-medium mb-2">Synchronization Options</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="sync-two-way">Two-way Synchronization</Label>
                <Switch id="sync-two-way" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sync-notifications">Sync Notifications</Label>
                <Switch id="sync-notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sync-availability">Sync Availability Status</Label>
                <Switch id="sync-availability" />
              </div>
            </div>
          </div>
        )}
        
        <div className="pt-4 border-t">
          <h3 className="font-medium mb-2">Calendar Settings</h3>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="week-starts">Week Starts On</Label>
              <select id="week-starts" className="rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm ring-offset-background">
                <option>Sunday</option>
                <option>Monday</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="time-format">Time Format</Label>
              <select id="time-format" className="rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm ring-offset-background">
                <option>12-hour (AM/PM)</option>
                <option>24-hour</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="working-hours-start">Working Hours Start</Label>
              <select id="working-hours-start" className="rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm ring-offset-background">
                <option>6:00 AM</option>
                <option>7:00 AM</option>
                <option>8:00 AM</option>
                <option>9:00 AM</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="working-hours-end">Working Hours End</Label>
              <select id="working-hours-end" className="rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm ring-offset-background">
                <option>5:00 PM</option>
                <option>6:00 PM</option>
                <option>7:00 PM</option>
                <option>8:00 PM</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <h3 className="font-medium mb-2">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive email reminders for upcoming activities</p>
              </div>
              <Switch id="email-notifications" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="browser-notifications">Browser Notifications</Label>
                <p className="text-sm text-muted-foreground">Get browser alerts before activities start</p>
              </div>
              <Switch id="browser-notifications" />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button>Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeDesignSettings;
