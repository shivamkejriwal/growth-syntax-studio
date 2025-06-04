"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newspaper, Share2 } from "lucide-react";

export interface FinancialHealthLineChartProps {
  data: Array<{ year: string; debt: number; netWorth: number }>;
}

const legendPayload = [
  { value: 'Debt', type: 'line' as const, id: 'debt', color: 'hsl(var(--chart-3))' },
  { value: 'Net Worth', type: 'line' as const, id: 'netWorth', color: 'hsl(var(--chart-2))' },
];

const FinancialHealthLineChart: React.FC<FinancialHealthLineChartProps> = ({ data }) => {
  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle>Health</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
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
      <CardFooter className="flex justify-between pt-6">
        <Button variant="link" className="text-red-500 hover:text-red-600 p-0 h-auto">
          <Newspaper className="mr-2 h-4 w-4" />
          MORE DETAILS
        </Button>
        <Button variant="link" className="text-red-500 hover:text-red-600 p-0 h-auto">
          <Share2 className="mr-2 h-4 w-4" />
          SHARE
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FinancialHealthLineChart;
