
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Clock, 
  Calendar, 
  Search, 
  Filter, 
  Trash2, 
  CheckCircle2, 
  Play, 
  Pause,
  BarChart3,
  TrendingUp
} from "lucide-react";
import { format, isToday, isYesterday, formatDistanceToNow } from "date-fns";

interface FocusSessionHistoryProps {
  sessions: FocusSession[];
  onDeleteSession: (sessionId: string) => void;
}

const FocusSessionHistory: React.FC<FocusSessionHistoryProps> = ({ 
  sessions, 
  onDeleteSession 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const filteredSessions = sessions
    .filter(session => {
      const matchesSearch = searchTerm === "" || 
        session.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (session.notes && session.notes.toLowerCase().includes(searchTerm.toLowerCase()));
        
      const matchesCategory = categoryFilter === "all" || session.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "duration":
          return b.duration - a.duration;
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  const totalSessions = sessions.length;
  const totalDuration = sessions.reduce((sum, session) => sum + session.duration, 0);
  const averageDuration = totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0;

  const getDateDisplay = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM d, yyyy");
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Deep Work":
        return "bg-blue-500/10 border-blue-500/30 text-blue-300";
      case "Study":
        return "bg-green-500/10 border-green-500/30 text-green-300";
      case "Creative":
        return "bg-purple-500/10 border-purple-500/30 text-purple-300";
      case "Planning":
        return "bg-orange-500/10 border-orange-500/30 text-orange-300";
      case "Short Break":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-300";
      case "Long Break":
        return "bg-red-500/10 border-red-500/30 text-red-300";
      default:
        return "bg-slate-500/10 border-slate-500/30 text-slate-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900/80 border-slate-700/50">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalSessions}</p>
              <p className="text-sm text-slate-400">Total Sessions</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-700/50">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 shadow-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{Math.round(totalDuration / 60)}h</p>
              <p className="text-sm text-slate-400">Total Time</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-700/50">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{averageDuration}m</p>
              <p className="text-sm text-slate-400">Average Session</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-slate-900/80 border-slate-700/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-600 text-white"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px] bg-slate-800/50 border-slate-600 text-white">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Deep Work">Deep Work</SelectItem>
                <SelectItem value="Study">Study</SelectItem>
                <SelectItem value="Creative">Creative</SelectItem>
                <SelectItem value="Planning">Planning</SelectItem>
                <SelectItem value="Short Break">Short Break</SelectItem>
                <SelectItem value="Long Break">Long Break</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px] bg-slate-800/50 border-slate-600 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <Card className="bg-slate-900/50 border-slate-700/50 text-center p-12">
          <Clock className="h-16 w-16 text-slate-500 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-white mb-2">No sessions found</h3>
          <p className="text-slate-400">
            {sessions.length === 0 
              ? "Start your first focus session to see your history here."
              : "Try adjusting your filters to see more sessions."
            }
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredSessions.map((session) => (
            <Card key={session.id} className="bg-slate-900/80 border-slate-700/50 hover:border-blue-500/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800/50">
                        {session.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-400" />
                        ) : (
                          <Pause className="h-5 w-5 text-yellow-400" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className={getCategoryColor(session.category)}>
                            {session.category}
                          </Badge>
                          <span className="text-sm text-slate-400">•</span>
                          <span className="text-sm text-slate-400">
                            {Math.floor(session.duration / 60)}:{(session.duration % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{getDateDisplay(session.date)}</span>
                          </div>
                          <span>{format(session.date, "h:mm a")}</span>
                          <span>•</span>
                          <span>{formatDistanceToNow(session.date, { addSuffix: true })}</span>
                        </div>
                        
                        {session.notes && (
                          <p className="text-sm text-slate-300 mt-2 line-clamp-2">
                            {session.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={session.completed ? "default" : "secondary"}
                      className={session.completed 
                        ? "bg-green-500/20 text-green-300 border-green-500/30" 
                        : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                      }
                    >
                      {session.completed ? "Completed" : "Interrupted"}
                    </Badge>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteSession(session.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FocusSessionHistory;
