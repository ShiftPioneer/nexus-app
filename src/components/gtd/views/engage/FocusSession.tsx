
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PlayCircle, PauseCircle, RotateCcw, Clock } from "lucide-react";

interface FocusSessionProps {
  taskTitle: string;
  isRunning: boolean;
  minutes: number;
  seconds: number;
  progress: number;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onCompleteSession: () => void;
}

const FocusSession: React.FC<FocusSessionProps> = ({
  taskTitle,
  isRunning,
  minutes,
  seconds,
  progress,
  onToggleTimer,
  onResetTimer,
  onCompleteSession
}) => {
  // Format time as MM:SS
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <span>Focus Session</span>
          </div>
          <span className="text-2xl font-mono">{formattedTime}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{taskTitle}</h3>
          
          <Progress value={progress} className="h-2" />
          
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm">Status: <span className={isRunning ? "text-green-500" : "text-yellow-500"}>{isRunning ? "Running" : "Paused"}</span></p>
              <p className="text-xs text-muted-foreground">{progress === 100 ? "Session complete!" : isRunning ? "Stay focused..." : "Resume when ready"}</p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleTimer}
                className={isRunning ? "border-yellow-500 text-yellow-500" : "border-green-500 text-green-500"}
              >
                {isRunning ? (
                  <>
                    <PauseCircle className="h-4 w-4 mr-1" />
                    Pause
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-4 w-4 mr-1" />
                    Resume
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onResetTimer}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
              
              <Button
                onClick={onCompleteSession}
                size="sm"
                disabled={progress < 100}
                className={progress === 100 ? "bg-green-500 hover:bg-green-600" : ""}
              >
                Complete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FocusSession;
