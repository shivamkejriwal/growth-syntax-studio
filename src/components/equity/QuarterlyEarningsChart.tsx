"use client";

import React, { useRef } from 'react'; // Added useRef
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SampleBarChart } from "@/components/charts/sample-bar-chart";
import { ChartCardFooter } from './ChartCardFooter';

export interface QuarterlyEarningsChartProps {
  ticker: string;
  data: Array<{ quarter: string; revenue: number; profit: number }>;
}

export function QuarterlyEarningsChart({ ticker, data }: QuarterlyEarningsChartProps) {
  // Map data to the format expected by SampleBarChart
  const chartData = data.map(d => ({ month: d.quarter, desktop: d.revenue, mobile: d.profit }));
  const cardTitle = "Quarterly Earnings";
  const chartName = "quarterly-earnings";
  const cardRef = useRef<HTMLDivElement>(null); // Added ref
  return (
    <Card className="shadow-lg w-full flex flex-col" ref={cardRef}> {/* Used ref */}
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1"> {/* Use flex-1 to allow content to grow and push footer down */}
        <SampleBarChart title={`${ticker} Quarterly Revenue & Profit`} data={chartData} />
      </CardContent>
      <ChartCardFooter cardTitle={cardTitle} chartName={chartName} cardRef={cardRef} /> {/* Passed ref */}
    </Card>
  );
}