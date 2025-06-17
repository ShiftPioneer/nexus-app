
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Play, Pause, Volume2, Timer, Target } from "lucide-react";
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
          gradient: "from-emerald-500 via-teal-500 to-cyan-500",
          bgGradient: "from-emerald-500/5 via-teal-500/5 to-cyan-500/5",
          borderGradient: "from-emerald-500/30 via-teal-500/30 to-cyan-500/30",
          shadowColor: "shadow-emerald-500/10",
          label: "Deep Focus",
          color: "#10b981"
        };
      case "shortBreak":
        return {
          gradient: "from-blue-500 via-indigo-500 to-purple-500",
          bgGradient: "from-blue-500/5 via-indigo-500/5 to-purple-500/5",
          borderGradient: "from-blue-500/30 via-indigo-500/30 to-purple-500/30",
          shadowColor: "shadow-blue-500/10",
          label: "Short Break",
          color: "#3b82f6"
        };
      case "longBreak":
        return {
          gradient: "from-purple-500 via-pink-500 to-rose-500",
          bgGradient: "from-purple-500/5 via-pink-500/5 to-rose-500/5",
          borderGradient: "from-purple-500/30 via-pink-500/30 to-rose-500/30",
          shadowColor: "shadow-purple-500/10",
          label: "Long Break",
          color: "#8b5cf6"
        };
    }
  };

  const modeConfig = getModeConfig();

  return (
    <div className="lg:col-span-2">
      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-950/90 to-slate-900/80 border border-slate-700/30 shadow-2xl backdrop-blur-sm">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className={`absolute inset-0 bg-gradient-to-br ${modeConfig.bgGradient}`} />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/5 to-transparent rounded-full blur-3xl" />
        </div>
        
        <CardHeader className="relative z-10 text-center border-b border-slate-700/30 bg-gradient-to-r from-slate-900/30 to-slate-800/30 backdrop-blur-sm">
          <CardTitle className="flex items-center justify-center gap-4">
            <div className={`flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r ${modeConfig.gradient} shadow-lg`}>
              <Timer className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Focus Session</span>
              <p className="text-slate-400 text-sm mt-1">Stay focused and productive</p>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="relative z-10 space-y-10 p-10">
          {/* Mode Selection */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-800/30 rounded-2xl border border-slate-700/30 backdrop-blur-sm">
            {[
              { mode: "focus", label: "Focus", gradient: "from-emerald-500 via-teal-500 to-cyan-500", bgGradient: "from-emerald-500/10 via-teal-500/10 to-cyan-500/10" },
              { mode: "shortBreak", label: "Short Break", gradient: "from-blue-500 via-indigo-500 to-purple-500", bgGradient: "from-blue-500/10 via-indigo-500/10 to-purple-500/10" },
              { mode: "longBreak", label: "Long Break", gradient: "from-purple-500 via-pink-500 to-rose-500", bgGradient: "from-purple-500/10 via-pink-500/10 to-rose-500/10" }
            ].map(({ mode, label, gradient, bgGradient }) => (
              <Button
                key={mode}
                variant={timerMode === mode ? "default" : "ghost"}
                className={`
                  relative overflow-hidden transition-all duration-300 rounded-xl py-3 font-semibold
                  ${timerMode === mode 
                    ? `bg-gradient-to-r ${gradient} text-white shadow-lg border-none` 
                    : 'hover:bg-slate-700/30 text-slate-300 hover:text-white border border-slate-700/30'
                  }
                `}
                onClick={() => onModeChange(mode as "focus" | "shortBreak" | "longBreak")}
              >
                {timerMode === mode && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${bgGradient} opacity-20`} />
                )}
                <span className="relative z-10">{label}</span>
              </Button>
            ))}
          </div>

          {/* Timer Circle */}
          <div className="flex justify-center">
            <div className="relative w-80 h-80">
              {/* Progress circle */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="42" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  className="text-slate-800/50" 
                />
                <circle 
                  cx="50" cy="50" r="42" 
                  fill="none" 
                  stroke={modeConfig.color}
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeDasharray="264" 
                  strokeDashoffset={264 - (264 * progress) / 100} 
                  className="transition-all duration-500 ease-out"
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.3))'
                  }}
                />
              </svg>
              
              {/* Timer display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-7xl font-bold text-white mb-3 font-mono tracking-wide">
                  {formatTime()}
                </div>
                <div className={`text-xl font-semibold bg-gradient-to-r ${modeConfig.gradient} bg-clip-text text-transparent mb-2`}>
                  {modeConfig.label}
                </div>
                <div className="text-sm text-slate-400">
                  {isRunning ? "Session in progress..." : "Ready to focus"}
                </div>
              </div>
            </div>
          </div>

          {/* Duration Selection for Focus Mode */}
          {timerMode === "focus" && (
            <div className="space-y-6">
              <div className="grid grid-cols-5 gap-4">
                {[25, 45, 60, 90].map((duration) => (
                  <Button
                    key={duration}
                    variant={timerDuration === duration * 60 ? "default" : "outline"}
                    className={`
                      transition-all duration-300 border-slate-600/50 rounded-xl py-3
                      ${timerDuration === duration * 60 
                        ? `bg-gradient-to-r ${modeConfig.gradient} text-white shadow-lg border-none` 
                        : 'hover:bg-slate-700/30 hover:border-slate-500/50 text-slate-300 hover:text-white'
                      }
                    `}
                    onClick={() => onDurationChange(duration)}
                  >
                    {duration}m
                  </Button>
                ))}
                <Button 
                  variant="outline" 
                  className="border-slate-600/50 hover:bg-slate-700/30 hover:border-slate-500/50 text-slate-300 hover:text-white rounded-xl py-3"
                >
                  Custom
                </Button>
              </div>
              
              {/* Category Selection */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Focus Category
                </label>
                <Select value={category} onValueChange={(val) => onCategoryChange(val as FocusCategory)}>
                  <SelectTrigger className="bg-slate-800/30 border-slate-600/50 text-white rounded-xl backdrop-blur-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
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
          <div className="flex justify-center items-center gap-6">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onResetTimer}
              className="w-14 h-14 rounded-2xl border-slate-600/50 hover:bg-slate-700/30 hover:border-slate-500/50 text-slate-300 hover:text-white transition-all duration-300"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
            
            <Button 
              onClick={onToggleTimer} 
              size="lg"
              className={`
                px-10 py-4 rounded-2xl bg-gradient-to-r ${modeConfig.gradient} 
                hover:shadow-lg transition-all duration-300 hover:scale-105
                text-white font-bold text-lg border-none
              `}
            >
              {isRunning ? (
                <>
                  <Pause className="h-6 w-6 mr-3" />
                  Pause Session
                </>
              ) : (
                <>
                  <Play className="h-6 w-6 mr-3" />
                  Start Session
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="w-14 h-14 rounded-2xl border-slate-600/50 hover:bg-slate-700/30 hover:border-slate-500/50 text-slate-300 hover:text-white transition-all duration-300"
            >
              <Volume2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Motivation Message */}
          <div className="text-center space-y-3 p-6 bg-gradient-to-r from-slate-800/20 to-slate-700/20 rounded-2xl border border-slate-700/20 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-3 text-slate-300">
              <Target className="h-5 w-5" />
              <span className="font-semibold text-lg">Stay focused and productive!</span>
            </div>
            <p className="text-slate-400">Complete focus sessions to unlock achievements and build unstoppable momentum.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernFocusTimer;
