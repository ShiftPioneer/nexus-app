
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Check, X, ExternalLink } from 'lucide-react';

interface GoogleCalendarConnectProps {
  onConnect: () => Promise<void>;
  onDisconnect: () => Promise<void>;
  isConnected: boolean;
  syncSettings: {
    importEvents: boolean;
    exportEvents: boolean;
    autoSync: boolean;
  };
  onSyncSettingsChange: (key: string, value: boolean) => void;
}

const GoogleCalendarConnect: React.FC<GoogleCalendarConnectProps> = ({
  onConnect,
  onDisconnect,
  isConnected,
  syncSettings,
  onSyncSettingsChange
}) => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await onConnect();
      toast({
        title: "Success!",
        description: "Connected to Google Calendar successfully.",
      });
    } catch (error) {
      console.error("Failed to connect to Google Calendar:", error);
      toast({
        title: "Connection Failed",
        description: "Unable to connect to Google Calendar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await onDisconnect();
      toast({
        title: "Disconnected",
        description: "Google Calendar disconnected successfully.",
      });
    } catch (error) {
      console.error("Failed to disconnect from Google Calendar:", error);
      toast({
        title: "Error",
        description: "Unable to disconnect from Google Calendar. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Google Calendar Integration
        </CardTitle>
        <CardDescription>
          Connect your Google Calendar to sync events with the app
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Connection Status</p>
            <p className="text-sm text-muted-foreground">
              {isConnected ? "Connected to Google Calendar" : "Not connected"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <span className="flex items-center text-green-500">
                <Check className="h-4 w-4 mr-1" /> Connected
              </span>
            ) : (
              <span className="flex items-center text-muted-foreground">
                <X className="h-4 w-4 mr-1" /> Not Connected
              </span>
            )}
          </div>
        </div>

        {isConnected && (
          <>
            <div className="space-y-3 pt-3">
              <h4 className="text-sm font-medium">Sync Settings</h4>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="import-events" className="text-sm">Import events from Google</label>
                  <p className="text-xs text-muted-foreground">Pull events from Google Calendar into this app</p>
                </div>
                <Switch 
                  id="import-events" 
                  checked={syncSettings.importEvents}
                  onCheckedChange={(value) => onSyncSettingsChange("importEvents", value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="export-events" className="text-sm">Export events to Google</label>
                  <p className="text-xs text-muted-foreground">Push events from this app to Google Calendar</p>
                </div>
                <Switch 
                  id="export-events" 
                  checked={syncSettings.exportEvents}
                  onCheckedChange={(value) => onSyncSettingsChange("exportEvents", value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="auto-sync" className="text-sm">Auto-sync</label>
                  <p className="text-xs text-muted-foreground">Automatically sync changes in both directions</p>
                </div>
                <Switch 
                  id="auto-sync" 
                  checked={syncSettings.autoSync}
                  onCheckedChange={(value) => onSyncSettingsChange("autoSync", value)}
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {isConnected ? (
          <>
            <Button variant="outline" onClick={handleDisconnect}>
              Disconnect
            </Button>
            <Button>
              Sync Now
            </Button>
          </>
        ) : (
          <Button 
            className="w-full"
            onClick={handleConnect}
            disabled={isConnecting}
          >
            <Calendar className="h-4 w-4 mr-2" />
            {isConnecting ? "Connecting..." : "Connect Google Calendar"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default GoogleCalendarConnect;
