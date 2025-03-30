
import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Habit {
  id: string;
  title: string;
  category: string;
  streak: number;
  target: number;
  status: "completed" | "pending" | "missed";
  completionDates: Date[];
  type: "daily" | "weekly" | "monthly";
  createdAt: Date;
}

interface HabitStatisticsTrendsProps {
  habits: Habit[];
}

const HabitStatisticsTrends: React.FC<HabitStatisticsTrendsProps> = ({ habits }) => {
  // Generate dummy trend data for the charts
  const dailyCompletionData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + i);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    // Calculate how many habits were completed on this day
    const completedCount = habits.reduce((acc, habit) => {
      const wasCompletedOnDay = habit.completionDates.some(completionDate => 
        completionDate.getDate() === date.getDate() &&
        completionDate.getMonth() === date.getMonth() &&
        completionDate.getFullYear() === date.getFullYear()
      );
      return acc + (wasCompletedOnDay ? 1 : 0);
    }, 0);
    
    return {
      name: dayName,
      completed: completedCount,
      target: habits.filter(h => h.type === "daily").length
    };
  });
  
  const weeklyProgressData = Array.from({ length: 7 }, (_, i) => {
    const day = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i];
    // Using sine wave to generate realistic varying data
    const value = Math.abs(Math.sin(i * 0.5) * 2) + 0.5;
    return {
      name: day,
      value: value.toFixed(1)
    };
  });
  
  return (
    <div className="space-y-12">
      <div>
        <h3 className="text-lg font-medium mb-3">Daily Completion Rate</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={dailyCompletionData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="completed" stackId="1" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.3} />
            <Area type="monotone" dataKey="target" stackId="2" stroke="#e2e8f0" fill="#e2e8f0" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3">Weekly Progress</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={weeklyProgressData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HabitStatisticsTrends;
