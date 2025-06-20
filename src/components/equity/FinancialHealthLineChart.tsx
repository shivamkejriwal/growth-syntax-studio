"use client";

import React, { useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCardFooter } from './ChartCardFooter';

export interface FinancialHealthLineChartProps {
  data: Array<{ year: string; debt: number; equity: number }>;
      onMoreDetailsClick?: (chartKey: string) => void;
}

export const financialHealthChartName = "financial-health";

const legendPayload = [
  { value: 'Debt', type: 'line' as const, id: 'debt', color: 'hsl(var(--chart-3))' },
  { value: 'Equity', type: 'line' as const, id: 'equity', color: 'hsl(var(--chart-2))' },
];

export const FinancialHealthLineChart: React.FC<FinancialHealthLineChartProps> = ({ data, onMoreDetailsClick }) => {
  const cardTitle = "Health";
  const cardRef = useRef<HTMLDivElement>(null);
  return (
    <Card className="shadow-lg w-full flex flex-col" ref={cardRef}>
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
              dataKey="equity"
              name="Equity"
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
        <ChartCardFooter cardTitle={cardTitle} chartName={financialHealthChartName} cardRef={cardRef} onMoreDetailsClick={onMoreDetailsClick} />
    </Card>
  );
};
