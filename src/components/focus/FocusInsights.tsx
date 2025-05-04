
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from "recharts";
import { Button } from "@/components/ui/button";
import { CalendarIcon, TrendingUp, Clock, BarChart3, Calendar, Award, BookOpen } from "lucide-react";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";

interface FocusInsightsProps {
  stats: FocusStats;
}

const FocusInsights: React.FC<FocusInsightsProps> = ({ stats }) => {
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month" | "year">("week");

  // Sample data for charts - in a real app this would come from the backend
  const dailyData = generateDailyData();
  const weeklyData = generateWeeklyData();
  const categoryData = generateCategoryData(stats);
  const streakData = generateStreakData();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Focus Insights
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <select
                className="rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
              >
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="streaks">Streaks</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard 
                  title="Today's Focus" 
                  value={`${stats.todayMinutes} min`}
                  icon={<Clock />}
                  trend={+15}
                />
                <StatsCard 
                  title="Weekly Total" 
                  value={`${stats.weekMinutes} min`}
                  icon={<Calendar />}
                  trend={+25}
                />
                <StatsCard 
                  title="Current Streak" 
                  value={`${stats.currentStreak} days`}
                  icon={<Award />}
                  trend={+2}
                />
                <StatsCard 
                  title="Sessions" 
                  value={stats.totalSessions.toString()}
                  icon={<BookOpen />}
                  trend={+5}
                />
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Daily Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="day" 
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: '#ddd' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: '#ddd' }}
                        tickFormatter={(value) => `${value}m`}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value} min`, 'Focus time']}
                        labelFormatter={(label) => `${label}`}
                      />
                      <Legend />
                      <Bar dataKey="minutes" name="Focus Minutes" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Top Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {stats.categoryStats
                        .sort((a, b) => b.sessions - a.sessions)
                        .slice(0, 3)
                        .map((category, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`h-3 w-3 rounded-full ${getCategoryColor(category.category)}`} />
                              <span>{category.category}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">{category.sessions}</span>
                              <span className="text-sm text-muted-foreground">sessions</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Personal Bests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Longest session</div>
                        <div className="flex justify-between items-center">
                          <div className="font-medium">{stats.longestSession.duration} minutes</div>
                          <div className="text-sm text-muted-foreground">
                            {format(stats.longestSession.date, "MMM d")}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Weekly improvement</div>
                        <div className="flex justify-between items-center">
                          <div className="font-medium text-emerald-500">+{stats.weeklyImprovement}%</div>
                          <div className="text-sm text-muted-foreground">vs. last week</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="trends" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Focus Duration Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="week" />
                      <YAxis tickFormatter={(value) => `${value}m`} />
                      <Tooltip formatter={(value) => [`${value} min`, 'Focus time']} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="minutes" 
                        name="Focus Minutes"
                        stroke="#8884d8" 
                        strokeWidth={2}
                        dot={{ r: 4 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Time of Day Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Your most productive hours appear to be 9-11 AM and 2-4 PM
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="categories" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Category Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={categoryData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" tickFormatter={(value) => `${value}%`} />
                        <YAxis type="category" dataKey="name" width={100} />
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                        <Legend />
                        <Bar 
                          dataKey="value" 
                          name="Time Percentage"
                          fill="#8884d8" 
                          radius={[0, 4, 4, 0]} 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Category Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.categoryStats.map((category, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-center mb-1">
                            <span>{category.category}</span>
                            <span className="text-sm text-muted-foreground">{category.percentage}%</span>
                          </div>
                          <div className="h-2 bg-accent rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getCategoryFillColor(category.category)}`}
                              style={{ width: `${category.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Focus Quality by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Deep Work sessions show highest focus quality (92%), followed by Study (87%)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="streaks" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Streak History</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={streakData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 'dataMax + 2']} />
                      <Tooltip formatter={(value) => [`${value} days`, 'Streak']} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="streak" 
                        name="Streak Days"
                        stroke="#ff7300" 
                        strokeWidth={2}
                        dot={{ r: 4 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Streak</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center p-6">
                      <div className="text-6xl font-bold text-primary mb-2">{stats.currentStreak}</div>
                      <div className="text-lg">days in a row</div>
                      <div className="text-sm text-muted-foreground mt-4">
                        Keep going! Your longest streak was 12 days.
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Streak Calendar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center">
                      <p className="text-muted-foreground">
                        Calendar heatmap showing your consistent focus patterns
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const StatsCard = ({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: number }) => {
  return (
    <div className="bg-accent/50 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="bg-background rounded-full p-2 text-primary">
          {icon}
        </div>
      </div>
      <div className="mt-2 flex items-end justify-between">
        <div className="text-2xl font-bold">{value}</div>
        <div className={`text-xs ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </div>
      </div>
    </div>
  );
};

// Helper functions to generate sample data
function generateDailyData() {
  return Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
      day: format(date, "EEE"),
      fullDate: format(date, "yyyy-MM-dd"),
      minutes: Math.floor(Math.random() * 100) + 20,
    };
  });
}

function generateWeeklyData() {
  return Array.from({ length: 8 }, (_, i) => {
    const weekStart = startOfWeek(subDays(new Date(), (7 - i) * 7));
    const weekEnd = endOfWeek(weekStart);
    return {
      week: `${format(weekStart, "MMM d")}-${format(weekEnd, "d")}`,
      minutes: Math.floor(Math.random() * 300) + 100,
    };
  });
}

function generateCategoryData(stats: FocusStats) {
  return stats.categoryStats.map(cat => ({
    name: cat.category,
    value: cat.percentage
  }));
}

function generateStreakData() {
  return Array.from({ length: 10 }, (_, i) => {
    const date = subDays(new Date(), (10 - i - 1) * 3);
    return {
      date: format(date, "MMM d"),
      streak: Math.floor(Math.random() * 5) + 1,
    };
  });
}

function getCategoryColor(category: string): string {
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
}

function getCategoryFillColor(category: string): string {
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
}

export default FocusInsights;
