
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Square, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface FocusSessionProps {
  taskTitle?: string;
  onComplete?: () => void;
}

const FocusSession: React.FC<FocusSessionProps> = ({ taskTitle, onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [initialTime] = useState(25 * 60);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isActive && !isPaused && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (onComplete) onComplete();
    }

    return () => clearInterval(intervalId);
  }, [isActive, isPaused, timeLeft, onComplete]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setIsActive(false);
    setIsPaused(false);
  };

  const handleReset = () => {
    setTimeLeft(initialTime);
    setIsActive(false);
    setIsPaused(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((initialTime - timeLeft) / initialTime) * 100;
  };

  const getSessionState = () => {
    if (!isActive) return "ready";
    if (isPaused) return "paused";
    return "active";
  };

  const getStateColor = () => {
    const state = getSessionState();
    switch (state) {
      case "active": return "text-green-600 border-green-600";
      case "paused": return "text-lime-600 border-lime-600";
      case "ready": return "text-blue-600 border-blue-600";
      default: return "text-gray-600 border-gray-600";
    }
  };

  return (
    <Card className={cn("transition-all duration-300", getStateColor().includes("border") ? `border-2 ${getStateColor().split(" ")[1]}` : "")}>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          Focus Session
          {taskTitle && (
            <span className="text-sm font-normal text-muted-foreground">
              • {taskTitle}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className={cn("text-6xl font-bold tabular-nums", getStateColor().split(" ")[0])}>
            {formatTime(timeLeft)}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {getSessionState() === "active" && "Focus time"}
            {getSessionState() === "paused" && "Session paused"}
            {getSessionState() === "ready" && "Ready to start"}
          </p>
        </div>

        <Progress 
          value={getProgressPercentage()} 
          className="w-full h-3"
        />

        <div className="flex justify-center gap-3">
          {!isActive ? (
            <Button onClick={handleStart} size="lg" className="bg-green-600 hover:bg-green-700">
              <Play className="h-5 w-5 mr-2" />
              Start
            </Button>
          ) : (
            <>
              <Button onClick={handlePause} variant="outline" size="lg">
                <Pause className="h-5 w-5 mr-2" />
                {isPaused ? "Resume" : "Pause"}
              </Button>
              <Button onClick={handleStop} variant="destructive" size="lg">
                <Square className="h-5 w-5 mr-2" />
                Stop
              </Button>
            </>
          )}
          
          <Button onClick={handleReset} variant="outline" size="lg">
            <RotateCcw className="h-5 w-5 mr-2" />
            Reset
          </Button>
        </div>

        {timeLeft === 0 && (
          <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <p className="text-green-700 dark:text-green-400 font-medium">
              🎉 Focus session completed!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FocusSession;
