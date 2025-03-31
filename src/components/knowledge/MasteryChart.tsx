
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { Skillset } from "@/types/knowledge";

interface MasteryChartProps {
  skillsets: Skillset[];
}

export function MasteryChart({ skillsets }: MasteryChartProps) {
  // Transform skillset data for the chart
  const chartData = skillsets.map(skillset => ({
    name: skillset.name,
    value: skillset.mastery,
    color: skillset.color || "#4285F4"
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 100]} />
        <Tooltip
          formatter={(value) => [`${value}%`, 'Mastery']}
          labelStyle={{ color: '#333' }}
        />
        <Bar
          dataKey="value"
          label={{ position: 'top', formatter: (value: number) => `${value}%` }}
          isAnimationActive={true}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
