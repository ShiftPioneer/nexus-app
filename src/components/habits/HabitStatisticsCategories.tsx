
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface HabitStatisticsCategoriesProps {
  habits: Habit[];
}

const HabitStatisticsCategories = ({ habits }: HabitStatisticsCategoriesProps) => {
  // Define colors using app's theme colors
  const categoryColors = {
    health: "#FF6500",        // Primary Orange
    mindfulness: "#024CAA",   // Secondary Blue
    learning: "#0B192C",      // Tertiary Dark Blue
    productivity: "#10b981",  // Emerald
    relationships: "#ec4899", // Pink
    finance: "#8b5cf6",       // Purple
    other: "#64748b"          // Slate
  };

  // Get habit count by category
  const getCategoryData = () => {
    // If no habits, return empty data
    if (habits.length === 0) {
      return [
        { name: "No Habits", value: 1, color: "#64748b" }
      ];
    }
    
    // Count habits by category
    const categoryMap = habits.reduce((acc, habit) => {
      const category = habit.category || "other";
      if (!acc[category]) {
        acc[category] = { count: 0, completed: 0 };
      }
      acc[category].count += 1;
      acc[category].completed += habit.completionDates.length;
      return acc;
    }, {} as Record<string, { count: number, completed: number }>);
    
    // Convert to array format for chart
    return Object.keys(categoryMap).map(category => {
      const data = categoryMap[category];
      return {
        name: category,
        value: data.count,
        completionRate: Math.round((data.completed / (data.count * 30)) * 100),
        color: categoryColors[category as keyof typeof categoryColors] || "#64748b"
      };
    });
  };

  const categoryData = getCategoryData();

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm p-6">
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value}`, `${name} habits`]}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  color: 'hsl(var(--foreground))',
                  boxShadow: '0 10px 30px -10px hsl(var(--primary) / 0.3)'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categoryData.map((category, index) => (
          <div key={index} className="group rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-sm p-6 hover:bg-slate-800/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="h-4 w-4 rounded-full ring-2 ring-white/20" 
                  style={{ backgroundColor: category.color }} 
                />
                <p className="font-semibold capitalize text-white">{category.name}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{category.value}</p>
                <p className="text-xs text-slate-400">habits</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Completion Rate</span>
                <span className="font-medium text-white">{category.completionRate}%</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-orange-500 to-red-500"
                  style={{ width: `${category.completionRate}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitStatisticsCategories;
