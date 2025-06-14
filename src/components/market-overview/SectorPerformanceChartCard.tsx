"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SampleBarChart } from "@/components/charts/sample-bar-chart"; // Assuming this path is correct

export const SectorPerformanceChartCard: React.FC = () => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Sector Performance Chart</CardTitle>
        <CardDescription>Year-to-date performance by major sectors.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* You might want to pass data to SampleBarChart if it's dynamic */}
        <SampleBarChart title="Sector Performance (YTD)" />
      </CardContent>
    </Card>
  );
};