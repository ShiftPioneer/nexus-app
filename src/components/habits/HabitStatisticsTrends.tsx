
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface HabitStatisticsTrendsProps {
  habits: Habit[];
}

const HabitStatisticsTrends = ({ habits }: HabitStatisticsTrendsProps) => {
  // Generate trend data for the last 30 days
  const generateTrendData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toDateString();
      
      const completedHabits = habits.filter(habit =>
        habit.completionDates.some(completionDate =>
          new Date(completionDate).toDateString() === dateString
        )
      ).length;
      
      const completionRate = habits.length > 0 ? Math.round((completedHabits / habits.length) * 100) : 0;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        completed: completedHabits,
        completionRate: completionRate,
        total: habits.length
      });
    }
    
    return data;
  };

  const trendData = generateTrendData();
  
  // Calculate weekly averages
  const getWeeklyData = () => {
    const weeks = [];
    for (let i = 0; i < 4; i++) {
      const weekData = trendData.slice(i * 7, (i + 1) * 7);
      const avgCompleted = weekData.reduce((sum, day) => sum + day.completed, 0) / 7;
      const avgRate = weekData.reduce((sum, day) => sum + day.completionRate, 0) / 7;
      
      weeks.push({
        week: `Week ${i + 1}`,
        avgCompleted: Math.round(avgCompleted * 10) / 10,
        avgRate: Math.round(avgRate)
      });
    }
    return weeks;
  };

  const weeklyData = getWeeklyData();

  return (
    <div className="space-y-8">
      {/* Daily Completion Trends */}
      <Card className="bg-slate-900/50 border-slate-700/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            Daily Completion Trends (Last 30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6500" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FF6500" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(71, 85, 105, 0.3)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    backdropFilter: 'blur(12px)'
                  }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend 
                  wrapperStyle={{ color: '#e2e8f0' }}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#completedGradient)"
                  name="Habits Completed"
                />
                <Area
                  type="monotone"
                  dataKey="completionRate"
                  stroke="#FF6500"
                  strokeWidth={2}
                  fill="url(#rateGradient)"
                  name="Completion Rate (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Performance Comparison */}
      <Card className="bg-slate-900/50 border-slate-700/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            Weekly Performance Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="week" 
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(71, 85, 105, 0.3)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    backdropFilter: 'blur(12px)'
                  }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend 
                  wrapperStyle={{ color: '#e2e8f0' }}
                />
                <Line
                  type="monotone"
                  dataKey="avgCompleted"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                  name="Avg Habits/Day"
                />
                <Line
                  type="monotone"
                  dataKey="avgRate"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                  name="Avg Completion %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: "Best Day",
            value: Math.max(...trendData.map(d => d.completed)),
            subtitle: "Habits completed",
            gradient: "from-emerald-500 to-teal-600"
          },
          {
            title: "Average Daily",
            value: Math.round(trendData.reduce((sum, d) => sum + d.completed, 0) / trendData.length * 10) / 10,
            subtitle: "Habits per day",
            gradient: "from-blue-500 to-indigo-600"
          },
          {
            title: "Consistency",
            value: `${Math.round(trendData.reduce((sum, d) => sum + d.completionRate, 0) / trendData.length)}%`,
            subtitle: "Average rate",
            gradient: "from-primary to-orange-600"
          }
        ].map((metric, index) => (
          <Card key={index} className="bg-slate-900/50 border-slate-700/30 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r ${metric.gradient} shadow-lg mb-4`}>
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">{metric.title}</h3>
              <p className="text-2xl font-bold text-white">{metric.value}</p>
              <p className="text-xs text-slate-500">{metric.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HabitStatisticsTrends;
