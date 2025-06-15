import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Play, Pause, Volume2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
interface FocusTimerProps {
  timerMode: "focus" | "shortBreak" | "longBreak";
  timerDuration: number;
  time: {
    minutes: number;
    seconds: number;
  };
  progress: number;
  category: FocusCategory;
  isRunning: boolean;
  onModeChange: (mode: "focus" | "shortBreak" | "longBreak") => void;
  onDurationChange: (minutes: number) => void;
  onCategoryChange: (category: FocusCategory) => void;
  onToggleTimer: () => void;
  onResetTimer: () => void;
}
const FocusTimer: React.FC<FocusTimerProps> = ({
  timerMode,
  timerDuration,
  time,
  progress,
  category,
  isRunning,
  onModeChange,
  onDurationChange,
  onCategoryChange,
  onToggleTimer,
  onResetTimer
}) => {
  // Format time as MM:SS
  const formatTime = () => {
    return `${time.minutes.toString().padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}`;
  };
  return <Card className="lg:col-span-2 bg-slate-950">
      <CardHeader className="bg-slate-950 rounded-lg">
        <CardTitle className="">Focus Timer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 rounded-lg bg-slate-950">
        {/* Mode selection */}
        <div className="rounded-lg p-1 bg-slate-900">
          <div className="grid grid-cols-3 gap-1">
            <Button variant={timerMode === "focus" ? "default" : "ghost"} className={`w-full ${timerMode === "focus" ? "bg-orange-500 hover:bg-orange-600" : ""}`} onClick={() => onModeChange("focus")}>
              Focus
            </Button>
            <Button variant={timerMode === "shortBreak" ? "default" : "ghost"} className={`w-full ${timerMode === "shortBreak" ? "bg-green-500 hover:bg-green-600" : ""}`} onClick={() => onModeChange("shortBreak")}>
              Short Break
            </Button>
            <Button variant={timerMode === "longBreak" ? "default" : "ghost"} className={`w-full ${timerMode === "longBreak" ? "bg-blue-500 hover:bg-blue-600" : ""}`} onClick={() => onModeChange("longBreak")}>
              Long Break
            </Button>
          </div>
        </div>

        {/* Timer duration selection (only in focus mode) */}
        {timerMode === "focus" && <div className="grid grid-cols-5 gap-2">
            <Button variant={timerDuration === 25 * 60 ? "default" : "outline"} size="sm" onClick={() => onDurationChange(25)} className={timerDuration === 25 * 60 ? "bg-orange-500 hover:bg-orange-600" : ""}>
              25m
            </Button>
            <Button variant={timerDuration === 45 * 60 ? "default" : "outline"} size="sm" onClick={() => onDurationChange(45)} className={timerDuration === 45 * 60 ? "bg-orange-500 hover:bg-orange-600" : ""}>
              45m
            </Button>
            <Button variant={timerDuration === 60 * 60 ? "default" : "outline"} size="sm" onClick={() => onDurationChange(60)} className={timerDuration === 60 * 60 ? "bg-orange-500 hover:bg-orange-600" : ""}>
              60m
            </Button>
            <Button variant={timerDuration === 90 * 60 ? "default" : "outline"} size="sm" onClick={() => onDurationChange(90)} className={timerDuration === 90 * 60 ? "bg-orange-500 hover:bg-orange-600" : ""}>
              90m
            </Button>
            <Button variant="outline" size="sm">
              Custom
            </Button>
          </div>}
        
        {/* Category selection (only in focus mode) */}
        {timerMode === "focus" && <div className="space-y-2">
            <label className="text-sm">Focus Category</label>
            <Select value={category} onValueChange={val => onCategoryChange(val as FocusCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Deep Work">Deep Work</SelectItem>
                <SelectItem value="Study">Study</SelectItem>
                <SelectItem value="Creative">Creative</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>}

        {/* Timer circle */}
        <div className="flex justify-center">
          <div className="relative w-64 h-64">
            {/* Progress circle */}
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/20" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeDasharray="283" strokeDashoffset={283 - 283 * progress / 100} transform="rotate(-90 50 50)" className={timerMode === "focus" ? "text-orange-500" : timerMode === "shortBreak" ? "text-green-500" : "text-blue-500"} />
            </svg>
            
            {/* Timer text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background-DEFAULT text-lime-600">
              <span className="text-5xl font-bold">{formatTime()}</span>
              <span className="text-sm text-muted-foreground mt-1">
                {timerMode === "focus" ? "Focus" : timerMode === "shortBreak" ? "Short Break" : "Long Break"}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="icon" onClick={onResetTimer}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button onClick={onToggleTimer} className="bg-orange-500 hover:bg-orange-600">
            {isRunning ? <>
                <Pause className="h-4 w-4 mr-1" />
                Pause
              </> : <>
                <Play className="h-4 w-4 mr-1" />
                Start
              </>}
          </Button>
          <Button variant="outline" size="icon">
            <Volume2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-center text-muted-foreground">
          <p>Stay focused and productive!</p>
          <p>Complete focus sessions to earn rewards.</p>
        </div>
      </CardContent>
    </Card>;
};
export default FocusTimer;