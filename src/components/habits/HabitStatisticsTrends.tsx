
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface HabitStatisticsTrendsProps {
  habits: Habit[];
}

const HabitStatisticsTrends = ({ habits }: HabitStatisticsTrendsProps) => {
  // Calculate weekly completion data
  const getWeeklyData = () => {
    const data = [];
    const today = new Date();
    
    // If no habits, return empty data for the last 12 weeks
    if (habits.length === 0) {
      return Array.from({ length: 12 }, (_, i) => {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - ((11 - i) * 7));
        return {
          week: `W${i+1}`,
          date: weekStart.toISOString().split('T')[0],
          rate: 0,
          completed: 0,
          total: 0
        };
      });
    }
    
    // Get data for the last 12 weeks
    for (let i = 11; i >= 0; i--) {
      // Calculate the start and end of the week
      const weekEnd = new Date();
      weekEnd.setDate(weekEnd.getDate() - (i * 7));
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekStart.getDate() - 6);
      
      // Count completed habits this week
      let completedCount = 0;
      let totalPossible = 0;
      
      // Loop through each day of the week
      for (let d = 0; d < 7; d++) {
        const day = new Date(weekStart);
        day.setDate(day.getDate() + d);
        const dayString = day.toISOString().split('T')[0];
        
        // Get habits that existed on this day
        const existingHabits = habits.filter(habit => {
          const habitCreatedDate = new Date(habit.createdAt);
          return habitCreatedDate <= day;
        });
        
        // Count completed habits on this day
        const completed = existingHabits.filter(habit => {
          return habit.completionDates.some(d => 
            new Date(d).toISOString().split('T')[0] === dayString
          );
        }).length;
        
        completedCount += completed;
        totalPossible += existingHabits.length;
      }
      
      const weekNum = 12 - i;
      
      data.push({
        week: `W${weekNum}`,
        date: weekStart.toISOString().split('T')[0],
        rate: totalPossible > 0 ? Math.round((completedCount / totalPossible) * 100) : 0,
        completed: completedCount,
        total: totalPossible
      });
    }
    
    return data;
  };

  const weeklyData = getWeeklyData();
  
  // If no habits, show a placeholder empty chart
  if (habits.length === 0) {
    return (
      <div className="text-center pt-10 pb-20">
        <p className="text-muted-foreground mb-6">No habits data available yet</p>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="rate" stroke="#8884d8" name="Completion Rate (%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="completed"
              stroke="#22c55e"
              activeDot={{ r: 8 }}
              name="Completed Habits"
            />
            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey="total" 
              stroke="#94a3b8" 
              name="Total Possible" 
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="rate"
              stroke="#8b5cf6"
              name="Completion Rate (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="text-sm text-muted-foreground text-center">
        <p>Weekly trends show your habit completion over the last 12 weeks</p>
        <p>A higher completion rate indicates better consistency in maintaining your habits</p>
      </div>
    </div>
  );
};

export default HabitStatisticsTrends;
