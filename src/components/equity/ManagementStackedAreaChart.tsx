
"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, DotProps } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newspaper, Share2 } from "lucide-react";

const chartData = [
  { year: '2011', research: 100, production: 150, acquisitions: 200 },
  { year: '2012', research: 120, production: 180, acquisitions: 220 },
  { year: '2013', research: 200, production: 250, acquisitions: 210 },
  { year: '2014', research: 180, production: 220, acquisitions: 230 },
  { year: '2015', research: 190, production: 240, acquisitions: 250 },
  { year: '2016', research: 170, production: 260, acquisitions: 270 },
  { year: '2017', research: 160, production: 230, acquisitions: 280 },
  { year: '2018', research: 220, production: 300, acquisitions: 260 },
  { year: '2019', research: 210, production: 270, acquisitions: 240 },
  { year: '2020', research: 200, production: 250, acquisitions: 200 },
];

const CustomizedDot: React.FC<DotProps & {
  payload?: any;
  dataKey?: string;
  color?: string;
}> = (props) => {
  const { cx, cy, stroke, fill, r, payload, dataKey, color } = props;

  if (cx === undefined || cy === undefined) {
    return null;
  }

  return <circle cx={cx} cy={cy} r={r || 3} stroke={color || stroke} fill={color || fill} strokeWidth={1} />;
};


const ManagementStackedAreaChart: React.FC = () => {
  const legendPayload = [
    { value: 'Research', type: 'square', id: 'research', color: 'hsl(var(--chart-4))' },
    { value: 'Production', type: 'square', id: 'production', color: 'hsl(var(--chart-2))' },
    { value: 'Acquisitions', type: 'square', id: 'acquisitions', color: 'hsl(var(--chart-1))' },
  ];

  return (
    <Card className="shadow-lg col-span-1">
      <CardHeader>
        <CardTitle>Management</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 0,
              left: -25, // Adjust to hide Y-axis labels if they appear
              bottom: 20, // Increased bottom margin for legend
            }}
          >
            <defs>
              <linearGradient id="colorResearch" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorProduction" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorAcquisitions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} dy={10} />
            <YAxis hide={true} domain={[0, 'dataMax + 100']} />
            {/* <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={true} vertical={false}/> */}
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
              cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, fill: 'hsl(var(--primary))', fillOpacity: 0.1 }}
            />
            <Area type="monotone" dataKey="research" stackId="1" stroke="hsl(var(--chart-4))" fill="url(#colorResearch)" strokeWidth={2} activeDot={{ r: 5 }} dot={(props) => <CustomizedDot {...props} color="hsl(var(--chart-4))" />} />
            <Area type="monotone" dataKey="production" stackId="1" stroke="hsl(var(--chart-2))" fill="url(#colorProduction)" strokeWidth={2} activeDot={{ r: 5 }} dot={(props) => <CustomizedDot {...props} color="hsl(var(--chart-2))" />} />
            <Area type="monotone" dataKey="acquisitions" stackId="1" stroke="hsl(var(--chart-1))" fill="url(#colorAcquisitions)" strokeWidth={2} activeDot={{ r: 5 }} dot={(props) => <CustomizedDot {...props} color="hsl(var(--chart-1))" />} />
            <Legend payload={legendPayload} wrapperStyle={{ paddingTop: '20px' }} align="center" verticalAlign="bottom" />
          </AreaChart>
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

export default ManagementStackedAreaChart;
