import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, Calendar, CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
const TimeDesignSettings: React.FC = () => {
  const [googleCalendarConnected, setGoogleCalendarConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [weekStartsOn, setWeekStartsOn] = useState("Sunday");
  const [timeFormat, setTimeFormat] = useState("12-hour (AM/PM)");
  const [workingHoursStart, setWorkingHoursStart] = useState("9:00 AM");
  const [workingHoursEnd, setWorkingHoursEnd] = useState("5:00 PM");
  const {
    toast
  } = useToast();
  const {
    user
  } = useAuth();

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
  return <Card className="bg-slate-950">
      <CardHeader className="bg-slate-950 rounded-lg">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Google Calendar Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 bg-slate-950 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="google-calendar" className="font-medium text-orange-600">Connect your Google Calendar to sync activities</Label>
            <p className="text-sm text-muted-foreground mt-1">
              {googleCalendarConnected ? <span className="flex items-center gap-1 text-green-500">
                  <CheckCircle className="h-4 w-4" /> Connected
                </span> : "Not Connected"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={isConnecting ? "outline" : googleCalendarConnected ? "default" : "outline"} size="sm" onClick={handleGoogleCalendarConnect} disabled={isConnecting} className="min-w-[120px] flex items-center justify-center gap-2">
              {isConnecting ? <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connecting...
                </> : googleCalendarConnected ? "Disconnect" : "Connect"}
            </Button>
            
            {googleCalendarConnected && <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => window.open("https://calendar.google.com", "_blank")}>
                <ExternalLink className="h-3 w-3" />
                Open Calendar
              </Button>}
          </div>
        </div>
        
        {googleCalendarConnected && <div className="mt-4 p-4 rounded-md bg-slate-950">
            <h4 className="font-medium mb-2">Synchronization Options</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-orange-600">
                  <Label htmlFor="sync-two-way">Two-way Synchronization</Label>
                  <p className="text-xs text-muted-foreground">
                    Changes in either calendar will sync to the other
                  </p>
                </div>
                <Switch id="sync-two-way" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sync-notifications" className="text-orange-600">Sync Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive notifications for synced calendar events
                  </p>
                </div>
                <Switch id="sync-notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sync-availability" className="text-orange-600">Sync Availability Status</Label>
                  <p className="text-xs text-muted-foreground">
                    Show your busy/free status from Google Calendar
                  </p>
                </div>
                <Switch id="sync-availability" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-block" className="text-orange-600">Auto-block Focus Time</Label>
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
                    <Label className="text-orange-600">Primary Calendar</Label>
                    <p className="text-xs text-muted-foreground">
                      {user?.email || "Your primary calendar"}
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-orange-600">Work Calendar</Label>
                    <p className="text-xs text-muted-foreground">Work events</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-orange-600">Personal Calendar</Label>
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
          </div>}
        
        <div className="pt-4 border-t">
          <h3 className="font-medium mb-2">Calendar Settings</h3>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="week-starts" className="text-orange-600">Week Starts On</Label>
              <Select value={weekStartsOn} onValueChange={setWeekStartsOn}>
                <SelectTrigger className="w-auto min-w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sunday">Sunday</SelectItem>
                  <SelectItem value="Monday">Monday</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="time-format" className="text-orange-600">Time Format</Label>
              <Select value={timeFormat} onValueChange={setTimeFormat}>
                <SelectTrigger className="w-auto min-w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12-hour (AM/PM)">12-hour (AM/PM)</SelectItem>
                  <SelectItem value="24-hour">24-hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="working-hours-start" className="text-orange-600">Working Hours Start</Label>
              <Select value={workingHoursStart} onValueChange={setWorkingHoursStart}>
                <SelectTrigger className="w-auto min-w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6:00 AM">6:00 AM</SelectItem>
                  <SelectItem value="7:00 AM">7:00 AM</SelectItem>
                  <SelectItem value="8:00 AM">8:00 AM</SelectItem>
                  <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="working-hours-end" className="text-orange-600">Working Hours End</Label>
              <Select value={workingHoursEnd} onValueChange={setWorkingHoursEnd}>
                <SelectTrigger className="w-auto min-w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5:00 PM">5:00 PM</SelectItem>
                  <SelectItem value="6:00 PM">6:00 PM</SelectItem>
                  <SelectItem value="7:00 PM">7:00 PM</SelectItem>
                  <SelectItem value="8:00 PM">8:00 PM</SelectItem>
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
                <Label htmlFor="email-notifications" className="bg-secondary-DEFAULT text-orange-600">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email reminders for upcoming activities
                </p>
              </div>
              <Switch id="email-notifications" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="browser-notifications" className="text-orange-600">Browser Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get browser alerts before activities start
                </p>
              </div>
              <Switch id="browser-notifications" />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button className="bg-primary-DEFAULT">Save Settings</Button>
        </div>
      </CardContent>
    </Card>;
};
export default TimeDesignSettings;