"use client";

import React, { useRef } from 'react'; // Added useRef
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCardFooter } from './ChartCardFooter';

export interface StockPriceHistoryChartProps {
  ticker: string;
  data: Array<{ date: string; price: number }>;
  onMoreDetailsClick?: (chartKey: string) => void;
}

export const stockPriceHistoryChartName = "stock-price-history";

const chartConfig = {
  price: {
    label: "Stock Price",
    color: "hsl(var(--chart-1))",
  },
} satisfies import("@/components/ui/chart").ChartConfig;

export const StockPriceHistoryChart: React.FC<StockPriceHistoryChartProps> = ({ ticker, data, onMoreDetailsClick }) => {
  const cardTitle = "Stock Price History";
  const cardRef = useRef<HTMLDivElement>(null); // Added ref

  return (
    <Card className="shadow-lg w-full flex flex-col" ref={cardRef}> {/* Used ref */}
      <CardHeader>
        <CardTitle>{`${ticker} ${cardTitle}`}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              accessibilityLayer
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                stroke="hsl(var(--foreground))"
                // tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} // Example date formatter
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                stroke="hsl(var(--foreground))"
                tickFormatter={(value) => `$${value.toFixed(2)}`} // Example price formatter
              />
              <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Legend content={<ChartLegendContent />} />
              <Line dataKey="price" type="monotone" stroke="var(--color-price)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
          <ChartCardFooter cardTitle={cardTitle} chartName={stockPriceHistoryChartName} cardRef={cardRef} onMoreDetailsClick={onMoreDetailsClick} />
    </Card>
  );
};