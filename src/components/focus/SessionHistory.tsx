
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { Clock, Calendar, Target, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FocusSession {
  id: string;
  title: string;
  duration: number; // in minutes
  completed: boolean;
  date: Date;
  technique: string;
  task?: string;
}

interface SessionHistoryProps {
  sessions: FocusSession[];
}

const SessionHistory: React.FC<SessionHistoryProps> = ({ sessions }) => {
  if (sessions.length === 0) {
    return (
      <Card className="bg-accent/10">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-accent" /> 
            Session History
          </CardTitle>
          <CardDescription>
            Record of your previous focus sessions
          </CardDescription>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <h3 className="text-lg font-medium mb-2">No sessions yet</h3>
          <p className="text-muted-foreground">
            Complete your first focus session to see your history
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Calculate total focused time in minutes
  const totalFocusMinutes = sessions.reduce((total, session) => {
    return total + (session.completed ? session.duration : 0);
  }, 0);
  
  // Convert to hours and minutes
  const hours = Math.floor(totalFocusMinutes / 60);
  const minutes = totalFocusMinutes % 60;
  
  // Group sessions by date
  const groupedSessions: {[date: string]: FocusSession[]} = {};
  sessions.forEach(session => {
    const dateStr = format(session.date, 'yyyy-MM-dd');
    if (!groupedSessions[dateStr]) {
      groupedSessions[dateStr] = [];
    }
    groupedSessions[dateStr].push(session);
  });
  
  return (
    <Card className="bg-accent/10">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-accent" /> 
              Session History
            </CardTitle>
            <CardDescription>
              Record of your previous focus sessions
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-lg font-medium">
              {hours > 0 && `${hours}h `}{minutes}m
            </div>
            <div className="text-xs text-muted-foreground">
              Total Focus Time
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-6">
            {Object.keys(groupedSessions)
              .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
              .map(dateStr => (
                <div key={dateStr} className="space-y-2">
                  <div className="flex items-center gap-1 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">
                      {format(new Date(dateStr), 'EEEE, MMMM d')}
                    </h3>
                  </div>
                  
                  {groupedSessions[dateStr].map(session => (
                    <Card key={session.id} className="bg-background">
                      <CardContent className="p-3 flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{session.title}</h4>
                            {session.completed ? (
                              <Badge variant="default" className="bg-green-500">Completed</Badge>
                            ) : (
                              <Badge variant="outline">Incomplete</Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{session.duration} min</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              <span>{session.technique}</span>
                            </div>
                            
                            {session.task && (
                              <div className="flex items-center gap-1">
                                <Target className="h-3 w-3" />
                                <span className="truncate max-w-[120px]">{session.task}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right text-sm text-muted-foreground">
                          {format(session.date, 'h:mm a')}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SessionHistory;
