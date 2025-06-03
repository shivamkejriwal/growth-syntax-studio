
"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newspaper, Share2 } from "lucide-react";

const chartData = [
  { year: '2012', debt: 150, netWorth: 400 },
  { year: '2013', debt: 160, netWorth: 550 },
  { year: '2014', debt: 165, netWorth: 520 },
  { year: '2015', debt: 170, netWorth: 530 },
  { year: '2016', debt: 200, netWorth: 540 },
  { year: '2017', debt: 280, netWorth: 450 },
  { year: '2018', debt: 250, netWorth: 460 },
  { year: '2019', debt: 240, netWorth: 455 },
  { year: '2020', debt: 260, netWorth: 470 },
  { year: '2021', debt: 300, netWorth: 500 },
];

const legendPayload = [
    { value: 'Debt', type: 'line', id: 'debt', color: 'hsl(var(--chart-3))' },
    { value: 'Net Worth', type: 'line', id: 'netWorth', color: 'hsl(var(--chart-2))' },
];

const FinancialHealthLineChart: React.FC = () => {
  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle>Health</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart 
            data={chartData} 
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
      <CardFooter className="flex justify-between pt-4">
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
