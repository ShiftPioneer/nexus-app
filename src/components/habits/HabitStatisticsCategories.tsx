
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface HabitStatisticsCategoriesProps {
  habits: Habit[];
}

const HabitStatisticsCategories = ({ habits }: HabitStatisticsCategoriesProps) => {
  // Define colors for different categories
  const categoryColors = {
    health: "#22c55e",
    mindfulness: "#8b5cf6",
    learning: "#3b82f6",
    productivity: "#f59e0b",
    relationships: "#ec4899",
    finance: "#10b981",
    other: "#94a3b8"
  };

  // Get habit count by category
  const getCategoryData = () => {
    // If no habits, return empty data
    if (habits.length === 0) {
      return [
        { name: "No Habits", value: 1, color: "#94a3b8" }
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
        color: categoryColors[category as keyof typeof categoryColors] || "#94a3b8"
      };
    });
  };

  const categoryData = getCategoryData();

  return (
    <div className="space-y-6">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
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
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {categoryData.map((category, index) => (
          <div key={index} className="rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <div 
                className="h-3 w-3 rounded-full" 
                style={{ backgroundColor: category.color }} 
              />
              <p className="font-medium capitalize">{category.name}</p>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <p className="text-muted-foreground">Count: {category.value}</p>
              <p className="text-muted-foreground">
                Completion: {category.completionRate}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitStatisticsCategories;
