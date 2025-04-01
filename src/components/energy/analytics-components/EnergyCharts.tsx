
import * as React from "react";
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";
import { Area, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Line } from "recharts";

interface ChartProps {
  data: any[];
  categories: string[];
  index: string;
  className?: string;
  showAnimation?: boolean;
  valueFormatter?: (value: number) => string;
  layout?: "horizontal" | "vertical";
}

export function BarChart({
  data,
  categories,
  index,
  className,
  showAnimation = false,
  valueFormatter = (value: number) => value.toString(),
  layout = "horizontal"
}: ChartProps) {
  const config = categories.reduce((acc, category) => {
    // Generate some colors based on the category name
    const hue = (category.length * 40) % 360;
    return {
      ...acc,
      [category]: { 
        color: `hsl(${hue}, 70%, 60%)`,
        label: category
      }
    };
  }, {});

  return (
    <ChartContainer className={className} config={config}>
      <ResponsiveContainer>
        <Bar
          data={data}
          layout={layout}
        >
          <CartesianGrid strokeDasharray="3 3" />
          {layout === "horizontal" ? (
            <>
              <XAxis dataKey={index} />
              <YAxis />
            </>
          ) : (
            <>
              <XAxis type="number" />
              <YAxis dataKey={index} type="category" />
            </>
          )}
          <Tooltip
            content={({ active, payload, label }) => (
              <ChartTooltipContent
                active={active}
                payload={payload}
                label={label}
                formatter={(value) => valueFormatter(Number(value))}
              />
            )}
          />
          {categories.map((category) => (
            <Bar
              key={category}
              dataKey={category}
              fill={`var(--color-${category})`}
              isAnimationActive={showAnimation}
            />
          ))}
        </Bar>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export function AreaChart({
  data,
  categories,
  index,
  className,
  showAnimation = false,
  valueFormatter = (value: number) => value.toString()
}: ChartProps) {
  const config = categories.reduce((acc, category) => {
    // Generate some colors based on the category name
    const hue = (category.length * 40) % 360;
    return {
      ...acc,
      [category]: { 
        color: `hsl(${hue}, 70%, 60%)`,
        label: category
      }
    };
  }, {});

  return (
    <ChartContainer className={className} config={config}>
      <ResponsiveContainer>
        <Area
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            {categories.map((category) => (
              <linearGradient key={category} id={`color-${category}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={`var(--color-${category})`} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={`var(--color-${category})`} stopOpacity={0.1}/>
              </linearGradient>
            ))}
          </defs>
          <XAxis dataKey={index} />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip
            content={({ active, payload, label }) => (
              <ChartTooltipContent
                active={active}
                payload={payload}
                label={label}
                formatter={(value) => valueFormatter(Number(value))}
              />
            )}
          />
          {categories.map((category) => (
            <Area
              key={category}
              type="monotone"
              dataKey={category}
              stroke={`var(--color-${category})`}
              fillOpacity={1}
              fill={`url(#color-${category})`}
              isAnimationActive={showAnimation}
            />
          ))}
        </Area>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export function LineChart({
  data,
  categories,
  index,
  className,
  showAnimation = false,
  valueFormatter = (value: number) => value.toString()
}: ChartProps) {
  const config = categories.reduce((acc, category) => {
    // Generate some colors based on the category name
    const hue = (category.length * 40) % 360;
    return {
      ...acc,
      [category]: { 
        color: `hsl(${hue}, 70%, 60%)`,
        label: category
      }
    };
  }, {});

  return (
    <ChartContainer className={className} config={config}>
      <ResponsiveContainer>
        <Line
          data={data}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={index} />
          <YAxis />
          <Tooltip
            content={({ active, payload, label }) => (
              <ChartTooltipContent
                active={active}
                payload={payload}
                label={label}
                formatter={(value) => valueFormatter(Number(value))}
              />
            )}
          />
          {categories.map((category) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={`var(--color-${category})`}
              isAnimationActive={showAnimation}
            />
          ))}
        </Line>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
