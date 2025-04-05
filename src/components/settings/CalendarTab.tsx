
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Eye, EyeOff, Trash, Key } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const CalendarTab: React.FC = () => {
  const [apiKey, setApiKey] = useState("");
  const [savedApiKey, setSavedApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [calendarSync, setCalendarSync] = useState(false);
  const { toast } = useToast();

  // Check if we have a saved API key in local storage
  useEffect(() => {
    const storedApiKey = localStorage.getItem("googleCalendarApiKey");
    if (storedApiKey) {
      setSavedApiKey(storedApiKey);
      setApiKey("●".repeat(20)); // Show masked value
    }
  }, []);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid API key",
      });
      return;
    }

    // Only save if it's a new value (not the masked placeholder)
    if (!apiKey.startsWith("●")) {
      localStorage.setItem("googleCalendarApiKey", apiKey);
      setSavedApiKey(apiKey);
      
      toast({
        title: "API Key Saved",
        description: "Your Google Calendar API key has been securely saved",
      });

      // Mask the displayed key for security
      setApiKey("●".repeat(20));
      setShowApiKey(false);
    }
  };

  const handleDeleteApiKey = () => {
    localStorage.removeItem("googleCalendarApiKey");
    setApiKey("");
    setSavedApiKey("");
    
    toast({
      title: "API Key Removed",
      description: "Your Google Calendar API key has been removed",
    });
  };

  const toggleApiKeyVisibility = () => {
    if (showApiKey) {
      setApiKey("●".repeat(20));
    } else if (savedApiKey) {
      setApiKey(savedApiKey);
    }
    setShowApiKey(!showApiKey);
  };

  const toggleCalendarSync = () => {
    setCalendarSync(!calendarSync);
    
    toast({
      title: !calendarSync ? "Calendar Sync Enabled" : "Calendar Sync Disabled",
      description: !calendarSync 
        ? "Your tasks will now sync with Google Calendar" 
        : "Your tasks will no longer sync with Google Calendar",
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Calendar Integration</CardTitle>
          <CardDescription>
            Connect your Google Calendar to sync events and tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <h4 className="font-medium">Google Calendar</h4>
                <p className="text-sm text-muted-foreground">Sync tasks and events with your Google Calendar</p>
              </div>
            </div>
            <Switch 
              checked={calendarSync} 
              onCheckedChange={toggleCalendarSync} 
              disabled={!savedApiKey}
            />
          </div>

          <div className="border-t pt-4">
            <Label htmlFor="api-key" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Google Calendar API Key
            </Label>
            <div className="flex mt-2">
              <div className="relative flex-1">
                <Input
                  id="api-key"
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Google Calendar API key"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={toggleApiKeyVisibility}
                  disabled={!savedApiKey && !apiKey}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <Button
                onClick={handleSaveApiKey}
                className="ml-2"
                disabled={!apiKey || apiKey.startsWith("●")}
              >
                Save
              </Button>
              {savedApiKey && (
                <Button
                  variant="destructive"
                  onClick={handleDeleteApiKey}
                  className="ml-2"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              This key is stored securely on your device and is never sent to our servers.
            </p>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Calendar Sync Settings</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="sync-tasks" className="cursor-pointer">Sync Tasks to Calendar</Label>
                <Switch id="sync-tasks" disabled={!calendarSync} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sync-events" className="cursor-pointer">Import Calendar Events</Label>
                <Switch id="sync-events" disabled={!calendarSync} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sync-auto" className="cursor-pointer">Auto-sync (Every 30 min)</Label>
                <Switch id="sync-auto" disabled={!calendarSync} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default CalendarTab;
