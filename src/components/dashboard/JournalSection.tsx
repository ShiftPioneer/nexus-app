import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Brain, Play } from "lucide-react";
import { motion } from "framer-motion";
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
          return sessionDate.getDate() === today.getDate() && sessionDate.getMonth() === today.getMonth() && sessionDate.getFullYear() === today.getFullYear();
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
  return <Card className="border-slate-800 bg-slate-950/40 backdrop-blur-sm h-fit">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Brain className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-slate-100">Focus Hub</CardTitle>
              <p className="text-sm text-slate-400 mt-0.5">Deep work & productivity sessions</p>
            </div>
          </div>
          <Link to="/focus">
             <Button variant="outline" size="sm" className="text-xs px-3 py-1.5 h-7 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {todayMinutes > 0 ? <motion.div className="space-y-4" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        duration: 0.5
      }}>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                <div className="text-2xl font-bold text-purple-400">{todayMinutes}m</div>
                <div className="text-xs text-slate-400">Today's Focus</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                <div className="text-2xl font-bold text-slate-200">{weekMinutes}m</div>
                <div className="text-xs text-slate-400">This Week</div>
              </div>
            </div>

            <Link to="/focus">
              <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white text-sm py-2.5 h-auto shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-200">
                <Play className="h-4 w-4 mr-2" />
                Start a New Session
              </Button>
            </Link>
          </motion.div> : <div className="text-center py-6 flex flex-col items-center justify-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Brain className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">Ready to Focus?</h3>
            <p className="text-sm text-slate-400 mb-4 max-w-xs mx-auto">
              Enter deep work mode and eliminate distractions.
            </p>
            
            <Link to="/focus">
              <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white text-sm py-2.5 h-auto shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-200">
                <Play className="h-4 w-4 mr-2" />
                Start Focus Session
              </Button>
            </Link>
          </div>}
      </CardContent>
    </Card>;
};
export default JournalSection;
