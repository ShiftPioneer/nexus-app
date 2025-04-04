
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import GoogleCalendarSettings from "@/components/settings/GoogleCalendarSettings";

const TimeDesignSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <GoogleCalendarSettings />
      
      <Card>
        <CardHeader>
          <CardTitle>Calendar Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
      
      <div className="flex justify-end pt-4">
        <Button>Save Settings</Button>
      </div>
    </div>
  );
};

export default TimeDesignSettings;
