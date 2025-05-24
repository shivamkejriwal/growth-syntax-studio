"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies import("@/components/ui/chart").ChartConfig

interface SampleBarChartProps {
  data?: typeof chartData;
  title?: string;
}

export function SampleBarChart({ data = chartData, title = "Sample Bar Chart" }: SampleBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          stroke="hsl(var(--foreground))"
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis 
          stroke="hsl(var(--foreground))"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ResponsiveContainer>
  )
}
