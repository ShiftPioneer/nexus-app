
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Brain, Clock, Play, TrendingUp, Zap, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface FocusSession {
  id: string;
  category: string;
  duration: number;
  date: string;
  completed?: boolean;
  effectiveness?: number;
}

const JournalSection = () => {
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [todayStats, setTodayStats] = useState({
    totalMinutes: 0,
    sessionsCount: 0,
    avgEffectiveness: 0
  });

  useEffect(() => {
    // Try to load focus sessions from localStorage
    try {
      const savedSessions = localStorage.getItem('focusSessions');
      if (savedSessions) {
        const parsedSessions = JSON.parse(savedSessions);
        // Filter for today's sessions
        const today = new Date();
        const todaySessions = parsedSessions.filter((session: any) => {
          const sessionDate = new Date(session.date);
          return sessionDate.getDate() === today.getDate() && 
                 sessionDate.getMonth() === today.getMonth() && 
                 sessionDate.getFullYear() === today.getFullYear();
        });
        
        setFocusSessions(todaySessions);
        
        // Calculate today's stats
        const totalMinutes = todaySessions.reduce((sum: number, session: any) => sum + (session.duration || 0), 0);
        const avgEffectiveness = todaySessions.length > 0 
          ? todaySessions.reduce((sum: number, session: any) => sum + (session.effectiveness || 0), 0) / todaySessions.length
          : 0;
        
        setTodayStats({
          totalMinutes,
          sessionsCount: todaySessions.length,
          avgEffectiveness
        });
      }
    } catch (error) {
      console.error("Failed to load focus sessions:", error);
    }
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'deep work': return Brain;
      case 'learning': return TrendingUp;
      case 'creative': return Zap;
      default: return Clock;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'deep work': return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case 'learning': return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case 'creative': return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case 'planning': return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="border-slate-300 bg-slate-950 overflow-hidden">
      <CardHeader className="pb-4 bg-slate-950 border-b border-slate-300/20">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Brain className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-white">Today's Focus</CardTitle>
              <p className="text-sm text-slate-400 mt-0.5">Deep work sessions and productivity</p>
            </div>
          </div>
          <Link to="/focus">
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs px-4 py-2 h-8 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50 transition-all duration-200"
            >
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 bg-slate-950">
        {focusSessions.length > 0 ? (
          <div className="space-y-4">
            {/* Today's Stats Summary */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="text-center p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
                <div className="text-lg font-bold text-blue-400">{todayStats.totalMinutes}</div>
                <div className="text-xs text-slate-400">Minutes</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
                <div className="text-lg font-bold text-emerald-400">{todayStats.sessionsCount}</div>
                <div className="text-xs text-slate-400">Sessions</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
                <div className="text-lg font-bold text-orange-400">{Math.round(todayStats.avgEffectiveness)}%</div>
                <div className="text-xs text-slate-400">Focus</div>
              </div>
            </div>

            {/* Focus Sessions List */}
            <div className="space-y-3">
              {focusSessions.slice(0, 3).map((session, index) => {
                const CategoryIcon = getCategoryIcon(session.category);
                return (
                  <div 
                    key={session.id || index}
                    className="group p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                          <CategoryIcon className="h-5 w-5 text-blue-400" />
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white">{session.category}</span>
                            {session.completed && (
                              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
                                Completed
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{session.duration}min</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatTime(session.date)}</span>
                            </div>
                            {session.effectiveness && (
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                <span>{session.effectiveness}%</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Link to="/focus">
                          <Button size="sm" variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                            <Play className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Show More Sessions Link */}
            {focusSessions.length > 3 && (
              <div className="pt-2">
                <Link to="/focus">
                  <Button 
                    variant="ghost" 
                    className="w-full text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
                  >
                    View {focusSessions.length - 3} more session{focusSessions.length - 3 !== 1 ? 's' : ''}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          /* Enhanced Empty State */
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
              <Brain className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Ready to Focus?</h3>
            <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">
              Start a deep work session and boost your productivity with focused time blocks.
            </p>
            
            {/* Quick Start Options */}
            <div className="space-y-3 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <Link to="/focus">
                  <Button 
                    variant="outline" 
                    className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    25min Focus
                  </Button>
                </Link>
                <Link to="/focus">
                  <Button 
                    variant="outline" 
                    className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/50"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Deep Work
                  </Button>
                </Link>
              </div>
            </div>
            
            <Link to="/focus">
              <Button 
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 h-auto font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Focus Session
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JournalSection;
