
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Play, Pause, Volume2, Timer, Zap } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ModernFocusTimerProps {
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

const ModernFocusTimer: React.FC<ModernFocusTimerProps> = ({
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
  const formatTime = () => {
    return `${time.minutes.toString().padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}`;
  };

  const getModeConfig = () => {
    switch (timerMode) {
      case "focus":
        return {
          gradient: "from-emerald-500 to-teal-600",
          bgGradient: "from-emerald-500/10 to-teal-600/10",
          shadowColor: "shadow-emerald-500/20",
          label: "Deep Focus"
        };
      case "shortBreak":
        return {
          gradient: "from-blue-500 to-indigo-600",
          bgGradient: "from-blue-500/10 to-indigo-600/10",
          shadowColor: "shadow-blue-500/20",
          label: "Short Break"
        };
      case "longBreak":
        return {
          gradient: "from-purple-500 to-pink-600",
          bgGradient: "from-purple-500/10 to-pink-600/10",
          shadowColor: "shadow-purple-500/20",
          label: "Long Break"
        };
    }
  };

  const modeConfig = getModeConfig();

  return (
    <div className="lg:col-span-2">
      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-950/90 border-slate-700/50 shadow-2xl">
        {/* Animated background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${modeConfig.bgGradient} opacity-20 animate-pulse`} />
        
        <CardHeader className="relative z-10 text-center border-b border-slate-700/50 bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur-sm">
          <CardTitle className="flex items-center justify-center gap-3 text-xl">
            <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r ${modeConfig.gradient} shadow-lg`}>
              <Timer className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-semibold">Focus Session</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="relative z-10 space-y-8 p-8">
          {/* Mode Selection */}
          <div className="grid grid-cols-3 gap-2 p-2 bg-slate-800/50 rounded-xl border border-slate-700/50">
            {[
              { mode: "focus", label: "Focus", gradient: "from-emerald-500 to-teal-600" },
              { mode: "shortBreak", label: "Short Break", gradient: "from-blue-500 to-indigo-600" },
              { mode: "longBreak", label: "Long Break", gradient: "from-purple-500 to-pink-600" }
            ].map(({ mode, label, gradient }) => (
              <Button
                key={mode}
                variant={timerMode === mode ? "default" : "ghost"}
                className={`
                  relative overflow-hidden transition-all duration-300 rounded-lg
                  ${timerMode === mode 
                    ? `bg-gradient-to-r ${gradient} text-white shadow-lg` 
                    : 'hover:bg-slate-700/50 text-slate-300'
                  }
                `}
                onClick={() => onModeChange(mode as "focus" | "shortBreak" | "longBreak")}
              >
                {label}
              </Button>
            ))}
          </div>

          {/* Timer Circle */}
          <div className="flex justify-center">
            <div className="relative w-72 h-72">
              {/* Outer glow ring */}
              <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${modeConfig.gradient} opacity-20 blur-md animate-pulse`} />
              
              {/* Progress circle */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  className="text-slate-700/50" 
                />
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="url(#gradient)" 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  strokeDasharray="283" 
                  strokeDashoffset={283 - (283 * progress) / 100} 
                  className="transition-all duration-500 ease-out"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={timerMode === "focus" ? "#10b981" : timerMode === "shortBreak" ? "#3b82f6" : "#8b5cf6"} />
                    <stop offset="100%" stopColor={timerMode === "focus" ? "#0d9488" : timerMode === "shortBreak" ? "#4f46e5" : "#ec4899"} />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Timer display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-6xl font-bold text-white mb-2 font-mono tracking-wider">
                  {formatTime()}
                </div>
                <div className={`text-lg font-medium bg-gradient-to-r ${modeConfig.gradient} bg-clip-text text-transparent`}>
                  {modeConfig.label}
                </div>
                <div className="text-sm text-slate-400 mt-2">
                  {isRunning ? "Session in progress..." : "Ready to focus"}
                </div>
              </div>
            </div>
          </div>

          {/* Duration Selection for Focus Mode */}
          {timerMode === "focus" && (
            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-3">
                {[25, 45, 60, 90].map((duration) => (
                  <Button
                    key={duration}
                    variant={timerDuration === duration * 60 ? "default" : "outline"}
                    size="sm"
                    onClick={() => onDurationChange(duration)}
                    className={`
                      transition-all duration-300 border-slate-600
                      ${timerDuration === duration * 60 
                        ? `bg-gradient-to-r ${modeConfig.gradient} text-white shadow-lg border-transparent` 
                        : 'hover:bg-slate-700/50 hover:border-slate-500 text-slate-300'
                      }
                    `}
                  >
                    {duration}m
                  </Button>
                ))}
                <Button variant="outline" size="sm" className="border-slate-600 hover:bg-slate-700/50 hover:border-slate-500 text-slate-300">
                  Custom
                </Button>
              </div>
              
              {/* Category Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Focus Category</label>
                <Select value={category} onValueChange={(val) => onCategoryChange(val as FocusCategory)}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
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
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onResetTimer}
              className="w-12 h-12 rounded-xl border-slate-600 hover:bg-slate-700/50 hover:border-slate-500 text-slate-300"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
            
            <Button 
              onClick={onToggleTimer} 
              size="lg"
              className={`
                px-8 py-4 rounded-xl bg-gradient-to-r ${modeConfig.gradient} 
                hover:shadow-lg ${modeConfig.shadowColor} transition-all duration-300
                text-white font-semibold
              `}
            >
              {isRunning ? (
                <>
                  <Pause className="h-5 w-5 mr-2" />
                  Pause Session
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Start Session
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="w-12 h-12 rounded-xl border-slate-600 hover:bg-slate-700/50 hover:border-slate-500 text-slate-300"
            >
              <Volume2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Motivation Message */}
          <div className="text-center space-y-2 p-4 bg-gradient-to-r from-slate-800/30 to-slate-700/30 rounded-xl border border-slate-700/30">
            <div className="flex items-center justify-center gap-2 text-slate-300">
              <Zap className="h-4 w-4" />
              <span className="font-medium">Stay focused and productive!</span>
            </div>
            <p className="text-slate-400 text-sm">Complete focus sessions to unlock achievements and build momentum.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernFocusTimer;
