
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, XCircle, Award, Trash2, Filter } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FocusSessionHistoryProps {
  sessions: FocusSession[];
  onDeleteSession?: (sessionId: string) => void;
}

const FocusSessionHistory: React.FC<FocusSessionHistoryProps> = ({
  sessions,
  onDeleteSession
}) => {
  const [selectedSession, setSelectedSession] = useState<FocusSession | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<"all" | "today" | "week" | "month">("all");
  const { toast } = useToast();

  const categories = [...new Set(sessions.map(session => session.category))];

  const filteredSessions = sessions.filter(session => {
    if (filterCategory && session.category !== filterCategory) {
      return false;
    }

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
    if (onDeleteSession) {
      onDeleteSession(id);
    } else {
      toast({
        title: "Session Deleted",
        description: "The focus session has been removed from your history"
      });
    }
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

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "Deep Work": return "bg-purple-500";
      case "Study": return "bg-blue-500";
      case "Creative": return "bg-green-500";
      case "Education": return "bg-amber-500";
      default: return "bg-slate-500";
    }
  };

  return (
    <>
      <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-white">
              <Clock className="h-5 w-5 text-primary" />
              Session History
            </CardTitle>
            
            <div className="flex flex-wrap gap-2">
              <Select value={filterCategory || ""} onValueChange={(value) => setFilterCategory(value || null)}>
                <SelectTrigger className="w-40 bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="" className="text-white">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category} className="text-white">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={dateRange} onValueChange={(value) => setDateRange(value as any)}>
                <SelectTrigger className="w-32 bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="all" className="text-white">All Time</SelectItem>
                  <SelectItem value="today" className="text-white">Today</SelectItem>
                  <SelectItem value="week" className="text-white">This Week</SelectItem>
                  <SelectItem value="month" className="text-white">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {filteredSessions.length === 0 ? (
            <div className="text-center py-8">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4 mx-auto">
                <Filter className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-400 text-lg mb-2">No sessions found</p>
              <p className="text-slate-500 text-sm">Try adjusting your filters or start a new focus session</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSessions.map(session => (
                <div key={session.id} className="group flex flex-col sm:flex-row sm:items-center justify-between border border-slate-700/30 rounded-xl p-4 hover:bg-slate-800/50 transition-all duration-200">
                  <div className="flex-1 mb-3 sm:mb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`h-3 w-3 rounded-full ${getCategoryColor(session.category)}`} />
                      <h3 className="font-semibold text-white">{session.category}</h3>
                      <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                        {session.xpEarned} XP
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDuration(session.duration)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {format(new Date(session.date), "MMM d, yyyy")} at {format(new Date(session.date), "h:mm a")}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewSession(session)}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      Details
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20" 
                      onClick={() => handleDeleteSession(session.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Focus Session Details</DialogTitle>
            <DialogDescription className="text-slate-400">
              {selectedSession && `Session from ${format(new Date(selectedSession.date), "MMMM d, yyyy")}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedSession && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">Category</p>
                  <p className="font-medium text-white">{selectedSession.category}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">Duration</p>
                  <p className="font-medium text-white">{formatDuration(selectedSession.duration)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">Time</p>
                  <p className="font-medium text-white">{format(new Date(selectedSession.date), "h:mm a")}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">XP Earned</p>
                  <p className="font-medium text-white">{selectedSession.xpEarned} XP</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-700">
                <h4 className="font-medium mb-3 text-white">Session Performance</h4>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (selectedSession.xpEarned / selectedSession.duration) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2 text-center">
                  {Math.round((selectedSession.xpEarned / selectedSession.duration) * 100)}% efficiency rating
                </p>
              </div>
              
              <div className="pt-4 border-t border-slate-700">
                <h4 className="font-medium mb-2 text-white">Session Notes</h4>
                <div className="bg-slate-800/50 rounded-lg p-3 min-h-[60px]">
                  <p className="text-sm text-slate-300">
                    {selectedSession.notes || "No notes recorded for this session."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FocusSessionHistory;
