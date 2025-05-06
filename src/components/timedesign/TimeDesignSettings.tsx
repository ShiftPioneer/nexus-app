
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, Calendar, CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const TimeDesignSettings: React.FC = () => {
  const [googleCalendarConnected, setGoogleCalendarConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Check if Google Calendar is already connected
  useEffect(() => {
    // In a real app, this would fetch from your database
    const savedState = localStorage.getItem('googleCalendarConnected');
    if (savedState) {
      setGoogleCalendarConnected(savedState === 'true');
    }
  }, []);

  const handleGoogleCalendarConnect = async () => {
    // In a real implementation, this would use OAuth 2.0 flow to connect to Google Calendar API
    setIsConnecting(true);
    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newConnectionState = !googleCalendarConnected;
      setGoogleCalendarConnected(newConnectionState);
      localStorage.setItem('googleCalendarConnected', String(newConnectionState));
      if (newConnectionState) {
        toast({
          title: "Google Calendar Connected",
          description: "Your Google Calendar has been successfully connected."
        });
      } else {
        toast({
          title: "Google Calendar Disconnected",
          description: "Your Google Calendar has been disconnected.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Google Calendar. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Google Calendar Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="google-calendar" className="font-medium">Connect your Google Calendar to sync activities</Label>
            <p className="text-sm text-muted-foreground mt-1">
              {googleCalendarConnected ? (
                <span className="flex items-center gap-1 text-green-500">
                  <CheckCircle className="h-4 w-4" /> Connected
                </span>
              ) : "Not Connected"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant={isConnecting ? "outline" : googleCalendarConnected ? "default" : "outline"} 
              size="sm" 
              onClick={handleGoogleCalendarConnect} 
              disabled={isConnecting} 
              className="min-w-[120px] flex items-center justify-center gap-2"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : googleCalendarConnected ? "Disconnect" : "Connect"}
            </Button>
            
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
          <div className="mt-4 p-4 rounded-md bg-slate-950">
            <h4 className="font-medium mb-2">Synchronization Options</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sync-two-way">Two-way Synchronization</Label>
                  <p className="text-xs text-muted-foreground">
                    Changes in either calendar will sync to the other
                  </p>
                </div>
                <Switch id="sync-two-way" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sync-notifications">Sync Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive notifications for synced calendar events
                  </p>
                </div>
                <Switch id="sync-notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sync-availability">Sync Availability Status</Label>
                  <p className="text-xs text-muted-foreground">
                    Show your busy/free status from Google Calendar
                  </p>
                </div>
                <Switch id="sync-availability" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-block">Auto-block Focus Time</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically block focus time on your Google Calendar
                  </p>
                </div>
                <Switch id="auto-block" />
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium mb-2">Calendar Selection</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Primary Calendar</Label>
                    <p className="text-xs text-muted-foreground">
                      {user?.email || "Your primary calendar"}
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Work Calendar</Label>
                    <p className="text-xs text-muted-foreground">Work events</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Personal Calendar</Label>
                    <p className="text-xs text-muted-foreground">Personal events</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Sync Now
              </Button>
            </div>
          </div>
        )}
        
        <div className="pt-4 border-t">
          <h3 className="font-medium mb-2">Calendar Settings</h3>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="week-starts">Week Starts On</Label>
              <Select defaultValue="Sunday">
                <SelectTrigger id="week-starts" className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sunday">Sunday</SelectItem>
                  <SelectItem value="Monday">Monday</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="time-format">Time Format</Label>
              <Select defaultValue="12-hour">
                <SelectTrigger id="time-format" className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12-hour">12-hour (AM/PM)</SelectItem>
                  <SelectItem value="24-hour">24-hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="working-hours-start">Working Hours Start</Label>
              <Select defaultValue="9:00">
                <SelectTrigger id="working-hours-start" className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6:00">6:00 AM</SelectItem>
                  <SelectItem value="7:00">7:00 AM</SelectItem>
                  <SelectItem value="8:00">8:00 AM</SelectItem>
                  <SelectItem value="9:00">9:00 AM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="working-hours-end">Working Hours End</Label>
              <Select defaultValue="5:00">
                <SelectTrigger id="working-hours-end" className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5:00">5:00 PM</SelectItem>
                  <SelectItem value="6:00">6:00 PM</SelectItem>
                  <SelectItem value="7:00">7:00 PM</SelectItem>
                  <SelectItem value="8:00">8:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <h3 className="font-medium mb-2">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email reminders for upcoming activities
                </p>
              </div>
              <Switch id="email-notifications" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="browser-notifications">Browser Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get browser alerts before activities start
                </p>
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
