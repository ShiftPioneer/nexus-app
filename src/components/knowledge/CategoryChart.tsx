
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Skillset } from "@/types/knowledge";

interface CategoryChartProps {
  skillsets: Skillset[];
}

export function CategoryChart({ skillsets }: CategoryChartProps) {
  // Count and calculate percentages of skillsets by category
  const categoryCounts: Record<string, number> = {};
  
  skillsets.forEach(skillset => {
    if (categoryCounts[skillset.category]) {
      categoryCounts[skillset.category]++;
    } else {
      categoryCounts[skillset.category] = 1;
    }
  });
  
  const chartData = Object.entries(categoryCounts).map(([category, count]) => ({
    name: category,
    value: (count / skillsets.length) * 100,
  }));

  // Colors for different categories
  const COLORS = ['#1E88E5', '#00BCD4', '#FFC107', '#FF5722', '#9C27B0', '#F44336'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => {
          if (typeof value === 'number') {
            return `${value.toFixed(0)}%`;
          }
          return value;
        }} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
