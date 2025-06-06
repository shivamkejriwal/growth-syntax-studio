"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newspaper, Share2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export interface DividendAnalysisChartProps {
  data: Array<{ year: string; dps: number }>;
  metrics: Array<{ label: string; value: string; isPercentage?: boolean }>;
}

const legendPayload = [
  { value: 'Dividend Per Share', type: 'line' as const, id: 'dps', color: 'hsl(var(--chart-4))' },
];

const DividendAnalysisChart: React.FC<DividendAnalysisChartProps> = ({ data, metrics }) => {
  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle>Dividend</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart 
            data={data}
            margin={{ top: 5, right: 20, left: -25, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={true} vertical={false} />
            <XAxis 
              dataKey="year" 
              stroke="hsl(var(--muted-foreground))" 
              tickLine={false} 
              axisLine={true}
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
              dataKey="dps"
              name="Dividend Per Share"
              stroke="hsl(var(--chart-4))"
              strokeWidth={2.5}
              dot={{ r: 4, fill: 'hsl(var(--chart-4))' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        <Separator className="my-6" />

        <div className="space-y-3">
          {metrics.map((metric) => (
            <div key={metric.label} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{metric.label}</span>
              {metric.isPercentage ? (
                <span className="font-semibold text-foreground">{metric.value}</span>
              ) : (
                <Badge variant="secondary" className="font-normal bg-muted text-muted-foreground px-2 py-0.5">
                  {metric.value}
                </Badge>
              )}
            </div>
          ))}
        </div>
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

export default DividendAnalysisChart;

