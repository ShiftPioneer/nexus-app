import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
const JournalSection = () => {
  const [focusSessions, setFocusSessions] = useState<any[]>([]);
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
          return sessionDate.getDate() === today.getDate() && sessionDate.getMonth() === today.getMonth() && sessionDate.getFullYear() === today.getFullYear();
        });
        setFocusSessions(todaySessions);
      }
    } catch (error) {
      console.error("Failed to load focus sessions:", error);
    }
  }, []);
  return <Card>
      <CardHeader className="pb-2 bg-slate-950">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Today's Focus</CardTitle>
          <Link to="/focus" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            View All
          </Link>
        </div>
      </CardHeader>
      <CardContent className="bg-slate-950">
        {focusSessions.length > 0 ? <div className="space-y-3">
            {focusSessions.slice(0, 3).map((session: any, index: number) => <div key={session.id || index} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{session.category}</p>
                  <p className="text-xs text-muted-foreground">
                    {session.duration} minutes
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(session.date).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
                </div>
              </div>)}
          </div> : <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">No focus sessions scheduled for today</p>
            <Link to="/focus" className="text-xs text-primary hover:underline">
              Start a focus session
            </Link>
          </div>}
      </CardContent>
    </Card>;
};
export default JournalSection;