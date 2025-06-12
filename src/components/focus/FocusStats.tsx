
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Clock, Zap, Target } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface FocusSession {
  id: string;
  date: string;
  duration: number;
  category: string;
  completed: boolean;
}

interface FocusStatsProps {
  sessions?: FocusSession[];
}

const FocusStats: React.FC<FocusStatsProps> = ({ sessions = [] }) => {
  const [focusSessions] = useLocalStorage<FocusSession[]>("focusSessions", []);
  const allSessions = sessions.length > 0 ? sessions : focusSessions;
  
  const COLORS = ['#0FA0CE', '#FF6500', '#8B5CF6', '#10B981', '#F59E0B'];
  
  // Calculate stats from actual session data
  const completedSessions = allSessions.filter(s => s.completed);
  const totalMinutes = completedSessions.reduce((sum, session) => sum + session.duration, 0);
  
  // Get last 7 days data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();
  
  const dailyStats = last7Days.map(date => {
    const dayName = new Date(date).toLocaleDateString('en', { weekday: 'short' });
    const dayMinutes = completedSessions
      .filter(session => session.date.split('T')[0] === date)
      .reduce((sum, session) => sum + session.duration, 0);
    
    return {
      day: dayName,
      minutes: dayMinutes
    };
  });
  
  // Calculate technique distribution
  const techniqueDistribution = Object.entries(
    completedSessions.reduce((acc, session) => {
      acc[session.category] = (acc[session.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([technique, count]) => ({ technique, count }));
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            Focus Insights
          </CardTitle>
          <CardDescription>
            Real-time analysis of your focus sessions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card className="bg-card/50 shadow-sm">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="mb-1 p-2 rounded-full bg-blue-100">
                  <Zap className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-2xl font-bold">{allSessions.length}</div>
                <div className="text-sm text-muted-foreground">Total Sessions</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 shadow-sm">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="mb-1 p-2 rounded-full bg-green-100">
                  <Target className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-2xl font-bold">{completedSessions.length}</div>
                <div className="text-sm text-muted-foreground">Completed Sessions</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 shadow-sm">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="mb-1 p-2 rounded-full bg-purple-100">
                  <Clock className="h-4 w-4 text-purple-600" />
                </div>
                <div className="text-2xl font-bold">
                  {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
                </div>
                <div className="text-sm text-muted-foreground">Total Focus Time</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 shadow-sm">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="mb-1 p-2 rounded-full bg-orange-100">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </div>
                <div className="text-2xl font-bold">
                  {allSessions.length > 0 ? Math.round((completedSessions.length / allSessions.length) * 100) : 0}%
                </div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card/50 shadow-sm">
              <CardHeader className="pb-0">
                <CardTitle className="text-base">Daily Focus (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dailyStats}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db20" />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        formatter={(value) => [`${value} min`, 'Focus Time']}
                        contentStyle={{ background: 'hsl(var(--card))', border: 'none', borderRadius: '8px' }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Bar dataKey="minutes" fill="#0FA0CE" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 shadow-sm">
              <CardHeader className="pb-0">
                <CardTitle className="text-base">Focus Categories</CardTitle>
              </CardHeader>
              <CardContent>
                {techniqueDistribution.length > 0 ? (
                  <>
                    <div className="h-[200px] flex items-center justify-center mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={techniqueDistribution}
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            innerRadius={40}
                            fill="#8884d8"
                            dataKey="count"
                            nameKey="technique"
                          >
                            {techniqueDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [`${value} sessions`, 'Count']}
                            contentStyle={{ background: 'hsl(var(--card))', border: 'none', borderRadius: '8px' }}
                            labelStyle={{ color: 'hsl(var(--foreground))' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      {techniqueDistribution.map((entry, index) => (
                        <div key={entry.technique} className="flex items-center gap-1 text-xs">
                          <div 
                            className="h-3 w-3 rounded-full" 
                            style={{ background: COLORS[index % COLORS.length] }} 
                          />
                          <span>{entry.technique}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-[200px] flex items-center justify-center">
                    <p className="text-muted-foreground">No focus sessions yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FocusStats;
