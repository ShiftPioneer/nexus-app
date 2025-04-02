
import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";

interface HabitStatisticsOverviewProps {
  habits: Habit[];
}

const HabitStatisticsOverview = ({ habits }: HabitStatisticsOverviewProps) => {
  // Create data for the last 30 days
  const createChartData = () => {
    const data = [];
    const today = new Date();
    
    // If no habits, return empty data
    if (habits.length === 0) {
      return Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return {
          date: date.toISOString().split('T')[0],
          completed: 0,
          total: 0,
        };
      });
    }
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Count completed habits on this date
      const completed = habits.filter(habit => {
        return habit.completionDates.some(d => 
          new Date(d).toISOString().split('T')[0] === dateString
        );
      }).length;
      
      // Get total habits that existed on this date
      const total = habits.filter(habit => {
        const habitCreatedDate = new Date(habit.createdAt);
        return habitCreatedDate <= date;
      }).length;
      
      data.push({
        date: dateString,
        completed,
        total,
        rate: total > 0 ? Math.round((completed / total) * 100) : 0,
      });
    }
    
    return data;
  };

  const data = createChartData();

  return (
    <div className="space-y-4">
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(tick) => {
                const date = new Date(tick);
                return `${date.getDate()}/${date.getMonth() + 1}`;
              }}
              tick={{ fontSize: 12 }}
              interval={4}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              domain={[0, 'dataMax + 2']} 
            />
            <Tooltip 
              formatter={(value) => [`${value}`, 'Count']}
              labelFormatter={(label) => {
                const date = new Date(label);
                return date.toLocaleDateString(undefined, { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                });
              }}
            />
            <Area 
              type="monotone" 
              dataKey="completed" 
              stroke="#7E69AB" 
              fill="#7E69AB" 
              fillOpacity={0.3} 
              name="Completed"
            />
            <Area 
              type="monotone" 
              dataKey="total" 
              stroke="#FF6500" 
              fill="#FF6500" 
              fillOpacity={0.1} 
              name="Total Habits"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Habits", value: habits.length },
          { 
            label: "Completion Rate", 
            value: `${Math.round((habits.reduce((acc, habit) => 
              acc + habit.completionDates.length, 0) / 
              (Math.max(1, habits.length) * 30)) * 100)}%` 
          },
          { 
            label: "Avg. Streak", 
            value: Math.round(habits.reduce((acc, habit) => acc + habit.streak, 0) / Math.max(1, habits.length)) 
          },
          { 
            label: "Completion Today", 
            value: `${habits.filter(h => h.status === "completed").length}/${habits.length}` 
          }
        ].map((stat, index) => (
          <Card key={index} className="p-4 text-center">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HabitStatisticsOverview;
