
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, Clock, Zap, Target, Award, Calendar } from "lucide-react";
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

  const COLORS = ['#FF6500', '#024CAA', '#8B5CF6', '#10B981', '#F59E0B'];

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
    return { day: dayName, minutes: dayMinutes };
  });

  const techniqueDistribution = Object.entries(
    completedSessions.reduce((acc, session) => {
      acc[session.category] = (acc[session.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([technique, count]) => ({ technique, count }));

  const avgSessionLength = completedSessions.length > 0 
    ? Math.round(totalMinutes / completedSessions.length) 
    : 0;

  const successRate = allSessions.length > 0 
    ? Math.round((completedSessions.length / allSessions.length) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <TrendingUp className="h-5 w-5 text-primary" />
            Focus Insights & Analytics
          </CardTitle>
          <CardDescription className="text-slate-400">
            Comprehensive analysis of your focus sessions and productivity patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-slate-800/50 border-slate-600/30">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="mb-3 p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20">
                  <Zap className="h-6 w-6 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{allSessions.length}</div>
                <div className="text-sm text-slate-400">Total Sessions</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-600/30">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="mb-3 p-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20">
                  <Target className="h-6 w-6 text-emerald-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{completedSessions.length}</div>
                <div className="text-sm text-slate-400">Completed</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-600/30">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="mb-3 p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                  <Clock className="h-6 w-6 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
                </div>
                <div className="text-sm text-slate-400">Total Focus Time</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-600/30">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="mb-3 p-3 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20">
                  <Award className="h-6 w-6 text-orange-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{successRate}%</div>
                <div className="text-sm text-slate-400">Success Rate</div>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Progress Chart */}
            <Card className="bg-slate-800/30 border-slate-600/30">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Daily Focus (Last 7 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyStats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                      <XAxis 
                        dataKey="day" 
                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                        axisLine={{ stroke: '#475569' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 12, fill: '#94a3b8' }}
                        axisLine={{ stroke: '#475569' }}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value} min`, 'Focus Time']} 
                        contentStyle={{
                          background: '#1e293b',
                          border: '1px solid #475569',
                          borderRadius: '8px',
                          color: '#f1f5f9'
                        }}
                        labelStyle={{ color: '#f1f5f9' }}
                      />
                      <Bar 
                        dataKey="minutes" 
                        fill="url(#colorGradient)" 
                        radius={[4, 4, 0, 0]}
                      />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#FF6500" />
                          <stop offset="100%" stopColor="#024CAA" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Category Distribution */}
            <Card className="bg-slate-800/30 border-slate-600/30">
              <CardHeader>
                <CardTitle className="text-lg text-white">Focus Categories</CardTitle>
              </CardHeader>
              <CardContent>
                {techniqueDistribution.length > 0 ? (
                  <>
                    <div className="h-[200px] flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={techniqueDistribution}
                            cx="50%"
                            cy="50%"
                            outerRadius={70}
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
                            contentStyle={{
                              background: '#1e293b',
                              border: '1px solid #475569',
                              borderRadius: '8px',
                              color: '#f1f5f9'
                            }}
                            labelStyle={{ color: '#f1f5f9' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-3 mt-4">
                      {techniqueDistribution.map((entry, index) => (
                        <div key={entry.technique} className="flex items-center gap-2 text-sm">
                          <div 
                            className="h-3 w-3 rounded-full" 
                            style={{ background: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-slate-300">{entry.technique}</span>
                          <span className="text-slate-400">({entry.count})</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-[200px] flex items-center justify-center">
                    <div className="text-center">
                      <Clock className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400">No focus sessions yet</p>
                      <p className="text-slate-500 text-sm">Start your first session to see insights</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-800/30 border-slate-600/30 p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{avgSessionLength} min</div>
                <div className="text-sm text-slate-400">Average Session</div>
              </div>
            </Card>
            
            <Card className="bg-slate-800/30 border-slate-600/30 p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {completedSessions.length > 0 ? Math.round(totalMinutes / 7) : 0} min
                </div>
                <div className="text-sm text-slate-400">Daily Average</div>
              </div>
            </Card>
            
            <Card className="bg-slate-800/30 border-slate-600/30 p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {techniqueDistribution.length > 0 ? techniqueDistribution[0]?.technique || "N/A" : "N/A"}
                </div>
                <div className="text-sm text-slate-400">Top Category</div>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FocusStats;
