
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Brain, Play, TrendingUp, Clock } from "lucide-react";
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
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [weekMinutes, setWeekMinutes] = useState(0);

  useEffect(() => {
    // Try to load focus sessions from localStorage
    try {
      const savedSessions = localStorage.getItem('focusSessions');
      if (savedSessions) {
        const parsedSessions = JSON.parse(savedSessions);
        const today = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        
        // Calculate today's minutes
        const todaySessions = parsedSessions.filter((session: any) => {
          const sessionDate = new Date(session.date);
          return sessionDate.getDate() === today.getDate() && 
                 sessionDate.getMonth() === today.getMonth() && 
                 sessionDate.getFullYear() === today.getFullYear();
        });
        
        // Calculate week's minutes
        const weekSessions = parsedSessions.filter((session: any) => {
          const sessionDate = new Date(session.date);
          return sessionDate >= weekAgo;
        });
        
        const dailyTotal = todaySessions.reduce((sum: number, session: any) => sum + (session.duration || 0), 0);
        const weeklyTotal = weekSessions.reduce((sum: number, session: any) => sum + (session.duration || 0), 0);
        
        setTodayMinutes(dailyTotal);
        setWeekMinutes(weeklyTotal);
      }
    } catch (error) {
      console.error("Failed to load focus sessions:", error);
    }
  }, []);

  return (
    <Card className="border-slate-700/50 bg-slate-950 overflow-hidden h-fit">
      <CardHeader className="pb-4 bg-slate-950">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Brain className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-white">Today's Focus</CardTitle>
              <p className="text-sm text-slate-400 mt-0.5">Deep work and productivity</p>
            </div>
          </div>
          <Link to="/focus">
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs px-3 py-1.5 h-7 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50"
            >
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 bg-slate-950">
        {todayMinutes > 0 ? (
          <div className="space-y-4">
            {/* Simple Stats Display */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
                <div className="text-xl font-bold text-blue-400">{todayMinutes}</div>
                <div className="text-xs text-slate-400">Today</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
                <div className="text-xl font-bold text-emerald-400">{weekMinutes}</div>
                <div className="text-xs text-slate-400">This Week</div>
              </div>
            </div>

            {/* Quick Start Actions */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Link to="/focus">
                  <Button 
                    variant="outline" 
                    className="w-full text-xs border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    25min
                  </Button>
                </Link>
                <Link to="/focus">
                  <Button 
                    variant="outline" 
                    className="w-full text-xs border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/50"
                  >
                    <Brain className="h-3 w-3 mr-1" />
                    Deep Work
                  </Button>
                </Link>
              </div>
              
              <Link to="/focus">
                <Button 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Focus Session
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Simplified Empty State */
          <div className="text-center py-6">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Brain className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-base font-medium text-white mb-2">Ready to Focus?</h3>
            <p className="text-sm text-slate-400 mb-4">
              Start a deep work session and boost your productivity.
            </p>
            
            {/* Quick Start Options */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Link to="/focus">
                  <Button 
                    variant="outline" 
                    className="w-full text-xs border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    25min Focus
                  </Button>
                </Link>
                <Link to="/focus">
                  <Button 
                    variant="outline" 
                    className="w-full text-xs border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/50"
                  >
                    <Brain className="h-3 w-3 mr-1" />
                    Deep Work
                  </Button>
                </Link>
              </div>
              
              <Link to="/focus">
                <Button 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Focus Session
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JournalSection;
