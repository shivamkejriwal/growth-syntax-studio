
"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { useState, useEffect } from "react";


const defaultChartDataStructure = [
  { date: "2024-01-01", value: 500 }, // Static value for server render
  { date: "2024-01-02", value: 500 },
  { date: "2024-01-03", value: 500 },
  { date: "2024-01-04", value: 500 },
  { date: "2024-01-05", value: 500 },
  { date: "2024-01-06", value: 500 },
  { date: "2024-01-07", value: 500 },
];

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
} satisfies import("@/components/ui/chart").ChartConfig

interface SampleLineChartProps {
  data?: Array<{ date: string; value: number }>;
  title?: string;
}

export function SampleLineChart({ data: propData, title = "Sample Line Chart" }: SampleLineChartProps) {
  const [internalChartData, setInternalChartData] = useState(defaultChartDataStructure);

  useEffect(() => {
    if (propData) {
      setInternalChartData(propData);
    } else {
      // Generate random data on client side after mount
      const randomData = defaultChartDataStructure.map(item => ({
        ...item,
        value: Math.floor(Math.random() * 1000),
      }));
      setInternalChartData(randomData);
    }
  }, [propData]);

  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      <LineChart accessibilityLayer data={internalChartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          stroke="hsl(var(--foreground))"
          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        />
        <YAxis 
          stroke="hsl(var(--foreground))"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <Tooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" hideLabel />}
          />
        <Line
          dataKey="value"
          type="monotone"
          stroke="var(--color-value)"
          strokeWidth={2}
          dot={{
            fill: "var(--color-value)",
            r: 4,
          }}
          activeDot={{
            r: 6,
          }}
        />
      </LineChart>
    </ChartContainer>
  )
}
