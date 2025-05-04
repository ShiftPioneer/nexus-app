
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, XCircle, Award } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface FocusSessionHistoryProps {
  sessions: FocusSession[];
}

const FocusSessionHistory: React.FC<FocusSessionHistoryProps> = ({ sessions }) => {
  const [selectedSession, setSelectedSession] = useState<FocusSession | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<"all" | "today" | "week" | "month">("all");
  const { toast } = useToast();

  // Get unique categories from sessions
  const categories = [...new Set(sessions.map(session => session.category))];

  // Filter sessions based on category and date range
  const filteredSessions = sessions.filter(session => {
    // Apply category filter
    if (filterCategory && session.category !== filterCategory) {
      return false;
    }

    // Apply date range filter
    const sessionDate = new Date(session.date);
    const today = new Date();
    
    if (dateRange === "today") {
      return sessionDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
    } 
    
    if (dateRange === "week") {
      const pastWeek = new Date();
      pastWeek.setDate(pastWeek.getDate() - 7);
      return sessionDate >= pastWeek;
    }
    
    if (dateRange === "month") {
      const pastMonth = new Date();
      pastMonth.setMonth(pastMonth.getMonth() - 1);
      return sessionDate >= pastMonth;
    }
    
    return true;
  });

  const handleDeleteSession = (id: string) => {
    // In a real app, this would make an API call to delete the session
    toast({
      title: "Session Deleted",
      description: "The focus session has been removed from your history"
    });
  };

  const handleViewSession = (session: FocusSession) => {
    setSelectedSession(session);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins > 0 ? `${mins}m` : ""}`;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Session History
            </CardTitle>
            
            <div className="flex flex-wrap gap-2">
              <select 
                className="rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={filterCategory || ""}
                onChange={(e) => setFilterCategory(e.target.value || null)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select 
                className="rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {filteredSessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No focus sessions found for the selected filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSessions.map((session) => (
                <div 
                  key={session.id} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 mb-2 sm:mb-0">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${getCategoryColor(session.category)}`} />
                      <h3 className="font-medium">{session.category}</h3>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDuration(session.duration)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {format(new Date(session.date), "MMM d, yyyy")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="h-3.5 w-3.5" />
                        {session.xpEarned} XP
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewSession(session)}
                    >
                      Details
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteSession(session.id)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Session details dialog */}
      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Focus Session Details</DialogTitle>
            <DialogDescription>
              Session from {selectedSession && format(new Date(selectedSession.date), "MMMM d, yyyy")}
            </DialogDescription>
          </DialogHeader>
          
          {selectedSession && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{selectedSession.category}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{formatDuration(selectedSession.duration)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{format(new Date(selectedSession.date), "h:mm a")}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">XP Earned</p>
                  <p className="font-medium">{selectedSession.xpEarned} XP</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Session Performance</h4>
                <div className="h-4 bg-accent rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${Math.min(100, selectedSession.xpEarned / selectedSession.duration * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  {Math.round(selectedSession.xpEarned / selectedSession.duration * 100)}% efficiency
                </p>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Notes</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedSession.notes || "No notes recorded for this session."}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

const getCategoryColor = (category: string): string => {
  switch (category) {
    case "Deep Work":
      return "bg-purple-500";
    case "Study":
      return "bg-blue-500";
    case "Creative":
      return "bg-green-500";
    case "Education":
      return "bg-amber-500";
    default:
      return "bg-gray-500";
  }
};

export default FocusSessionHistory;
