"use client";

import React, { useRef } from 'react'; // Added useRef
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCardFooter } from './ChartCardFooter';

export interface QuarterlyEarningsChartProps {
  ticker: string;
  data: Array<{ quarter: string; revenue: number; netIncome: number }>;
  onMoreDetailsClick?: (chartKey: string) => void;
}

export const quarterlyEarningsChartName = "quarterly-earnings";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  netIncome: {
    label: "Net Income",
    color: "hsl(var(--chart-2))",
  },
} satisfies import("@/components/ui/chart").ChartConfig;

export const QuarterlyEarningsChart: React.FC<QuarterlyEarningsChartProps> = ({ ticker, data, onMoreDetailsClick }) => {
  const cardTitle = "Quarterly Earnings";
  const cardRef = useRef<HTMLDivElement>(null); // Added ref

  return (
    <Card className="shadow-lg w-full flex flex-col" ref={cardRef}> {/* Used ref */}
      <CardHeader>
        <CardTitle>{`${ticker} ${cardTitle}`}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1"> {/* Use flex-1 to allow content to grow and push footer down */}
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="quarter"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              stroke="hsl(var(--foreground))"
              // tickFormatter={(value) => value.slice(0, 3)} // Assuming quarter is already a short string like "Q1 2024"
            />
            <YAxis
              stroke="hsl(var(--foreground))"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => `$${value / 1000}k`} // Example formatter, adjust as needed
            />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />} // Use indicator="dot" or "rect" for bar charts
            />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
            <Bar dataKey="netIncome" fill="var(--color-netIncome)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
          <ChartCardFooter cardTitle={cardTitle} chartName={quarterlyEarningsChartName} cardRef={cardRef} onMoreDetailsClick={onMoreDetailsClick} />
    </Card>
  );
};