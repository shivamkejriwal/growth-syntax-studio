"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCardFooter } from './ChartCardFooter';

export interface FinancialHealthLineChartProps {
  data: Array<{ year: string; debt: number; netWorth: number }>;
}

const legendPayload = [
  { value: 'Debt', type: 'line' as const, id: 'debt', color: 'hsl(var(--chart-3))' },
  { value: 'Net Worth', type: 'line' as const, id: 'netWorth', color: 'hsl(var(--chart-2))' },
];

const FinancialHealthLineChart: React.FC<FinancialHealthLineChartProps> = ({ data }) => {
  const cardTitle = "Health";
  const chartName = "health";
  return (
    <Card className="shadow-lg w-full flex flex-col">
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2 flex-1">
        <ResponsiveContainer width="100%" height={600}>
          <LineChart 
            data={data} 
            margin={{ top: 5, right: 20, left: -25, bottom: 20 }}
          >
            <XAxis 
              dataKey="year" 
              stroke="hsl(var(--muted-foreground))" 
              tickLine={false} 
              axisLine={false} 
              dy={10} 
            />
            <YAxis 
              hide={true} 
              domain={['auto', 'auto']} 
            />
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
              cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, fill: 'hsl(var(--primary))', fillOpacity: 0.1 }}
            />
            <Legend 
              payload={legendPayload} 
              wrapperStyle={{ paddingTop: '20px' }} 
              align="center" 
              verticalAlign="bottom" 
            />
            <Line
              type="monotone"
              dataKey="netWorth"
              name="Net Worth"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={{ r: 4, fill: 'hsl(var(--chart-2))' }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="debt"
              name="Debt"
              stroke="hsl(var(--chart-3))"
              strokeWidth={2}
              dot={{ r: 4, fill: 'hsl(var(--chart-3))' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
      <ChartCardFooter cardTitle={cardTitle} chartName={chartName} />
    </Card>
  );
};

export default FinancialHealthLineChart;
