"use client"

import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { ChartTooltipContent } from "@/components/ui/chart"


const chartData = [
  { date: "2024-01-01", value: Math.floor(Math.random() * 1000) },
  { date: "2024-01-02", value: Math.floor(Math.random() * 1000) },
  { date: "2024-01-03", value: Math.floor(Math.random() * 1000) },
  { date: "2024-01-04", value: Math.floor(Math.random() * 1000) },
  { date: "2024-01-05", value: Math.floor(Math.random() * 1000) },
  { date: "2024-01-06", value: Math.floor(Math.random() * 1000) },
  { date: "2024-01-07", value: Math.floor(Math.random() * 1000) },
]

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
} satisfies import("@/components/ui/chart").ChartConfig

interface SampleLineChartProps {
  data?: typeof chartData;
  title?: string;
}

export function SampleLineChart({ data = chartData, title = "Sample Line Chart" }: SampleLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
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
    </ResponsiveContainer>
  )
}
