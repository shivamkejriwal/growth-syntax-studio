"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Keep CartesianGrid if used
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Removed CardDescription, CardFooter
import { ChartCardFooter } from './ChartCardFooter';

export interface ManagementStackedAreaChartProps {
  data: Array<{
    year: string;
    research: number;
    production: number;
    acquisitions: number;
  }>;
}

const legendPayload = [
	{ value: 'Research', type: 'square' as const, color: 'hsl(var(--chart-4))' },
	{ value: 'Production', type: 'square' as const, color: 'hsl(var(--chart-2))' },
	{ value: 'Acquisitions', type: 'square' as const, color: 'hsl(var(--chart-1))' },
];

const ManagementStackedAreaChart: React.FC<ManagementStackedAreaChartProps> = ({ data }) => (
	<Card className="shadow-lg col-span-1 flex flex-col">
		<CardHeader>
			<CardTitle>Management</CardTitle>
		</CardHeader>
		<CardContent className="pb-2 flex-1">
			<ResponsiveContainer width="100%" height={600}>
				<AreaChart
					data={data}
					margin={{ top: 10, right: 0, left: -25, bottom: 20 }}
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
					<YAxis hide domain={[0, 'dataMax + 100']} />
					<Tooltip
						contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
						itemStyle={{ color: 'hsl(var(--foreground))' }}
						cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, fill: 'hsl(var(--primary))', fillOpacity: 0.1 }}
					/>
					<Area type="monotone" dataKey="research" stackId="1" stroke="hsl(var(--chart-4))" fill="url(#colorResearch)" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
					<Area type="monotone" dataKey="production" stackId="1" stroke="hsl(var(--chart-2))" fill="url(#colorProduction)" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
					<Area type="monotone" dataKey="acquisitions" stackId="1" stroke="hsl(var(--chart-1))" fill="url(#colorAcquisitions)" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
					<Legend 
						payload={legendPayload} 
						wrapperStyle={{ paddingTop: '20px', display: 'flex', justifyContent: 'center', gap: 64 }}
						align="center" 
						verticalAlign="bottom" 
					/>
				</AreaChart>
			</ResponsiveContainer>
		</CardContent>
		<ChartCardFooter />
	</Card>
);

export default ManagementStackedAreaChart;
