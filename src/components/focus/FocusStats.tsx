
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Clock, Zap } from "lucide-react";

interface FocusStats {
  totalSessions: number;
  completedSessions: number;
  totalMinutes: number;
  dailyStats: {
    day: string;
    minutes: number;
  }[];
  techniqueDistribution: {
    technique: string;
    count: number;
  }[];
}

interface FocusStatsProps {
  stats: FocusStats;
}

const FocusStats: React.FC<FocusStatsProps> = ({ stats }) => {
  const COLORS = ['#0FA0CE', '#FF6500', '#8B5CF6', '#10B981', '#F59E0B'];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            Focus Insights
          </CardTitle>
          <CardDescription>
            Analyzing your focus habit patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-card/50 shadow-sm">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="mb-1 p-2 rounded-full bg-blue-100">
                  <Zap className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-2xl font-bold">{stats.totalSessions}</div>
                <div className="text-sm text-muted-foreground">Total Sessions</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 shadow-sm">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="mb-1 p-2 rounded-full bg-green-100">
                  <Clock className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-2xl font-bold">{stats.completedSessions}</div>
                <div className="text-sm text-muted-foreground">Completed Sessions</div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 shadow-sm">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="mb-1 p-2 rounded-full bg-purple-100">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </div>
                <div className="text-2xl font-bold">
                  {Math.floor(stats.totalMinutes / 60)}h {stats.totalMinutes % 60}m
                </div>
                <div className="text-sm text-muted-foreground">Total Focus Time</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card/50 shadow-sm">
              <CardHeader className="pb-0">
                <CardTitle className="text-base">Daily Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.dailyStats}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db20" />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        formatter={(value) => [`${value} min`, 'Focus Time']}
                        contentStyle={{ background: '#1F2937', border: 'none', borderRadius: '4px' }}
                        labelStyle={{ color: '#E5E7EB' }}
                      />
                      <Bar dataKey="minutes" fill="#0FA0CE" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 shadow-sm">
              <CardHeader className="pb-0">
                <CardTitle className="text-base">Technique Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.techniqueDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        innerRadius={40}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="technique"
                        label={({ technique }) => technique}
                      >
                        {stats.techniqueDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value} sessions`, 'Count']}
                        contentStyle={{ background: '#1F2937', border: 'none', borderRadius: '4px' }}
                        labelStyle={{ color: '#E5E7EB' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {stats.techniqueDistribution.map((entry, index) => (
                    <div key={entry.technique} className="flex items-center gap-1 text-xs">
                      <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ background: COLORS[index % COLORS.length] }} 
                      />
                      <span>{entry.technique}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FocusStats;
