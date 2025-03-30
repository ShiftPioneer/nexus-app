
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

interface FocusSessionHistoryProps {
  sessions: FocusSession[];
}

const FocusSessionHistory: React.FC<FocusSessionHistoryProps> = ({ sessions }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Focus Sessions</CardTitle>
        <CardDescription>Your past productivity sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session) => (
            <div 
              key={session.id} 
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">{session.category}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(session.date, "PPp")}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{session.duration} min</div>
                <div className="text-sm font-medium bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                  {session.xpEarned} XP
                </div>
              </div>
            </div>
          ))}

          {sessions.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              No sessions recorded yet. Start a focus session to see your history.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FocusSessionHistory;
