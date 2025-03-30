
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

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

interface HabitStatisticsCategoriesProps {
  habits: Habit[];
}

const COLORS = {
  mindfulness: '#9333ea', // Purple
  health: '#10b981', // Green
  learning: '#3b82f6', // Blue
  productivity: '#f97316', // Orange
  finance: '#14b8a6', // Teal
  relationship: '#ec4899', // Pink
  career: '#0f766e', // Dark teal
};

const HabitStatisticsCategories: React.FC<HabitStatisticsCategoriesProps> = ({ habits }) => {
  // Calculate habits by category
  const categoryCounts: Record<string, number> = habits.reduce((acc, habit) => {
    const category = habit.category.toLowerCase();
    return {
      ...acc,
      [category]: (acc[category] || 0) + 1
    };
  }, {} as Record<string, number>);
  
  const pieData = Object.entries(categoryCounts).map(([category, count]) => {
    const percentage = Math.round((count / habits.length) * 100);
    return {
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: count,
      percentage,
      color: (COLORS as Record<string, string>)[category] || '#94a3b8',
    };
  });
  
  const renderColorfulLegendText = (value: string, entry: any) => {
    return <span style={{ color: '#888', fontSize: '14px' }}>{value}</span>;
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Habits by Category</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                label={({ name, percentage }) => `${name} ${percentage}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-y-2 mt-6">
          {pieData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <div className="text-sm">{item.name}</div>
              <div className="text-sm font-medium">{item.percentage}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HabitStatisticsCategories;
