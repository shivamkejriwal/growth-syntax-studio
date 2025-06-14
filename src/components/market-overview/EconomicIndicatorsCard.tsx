"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SampleLineChart } from "@/components/charts/sample-line-chart"; // Assuming this path is correct

export const EconomicIndicatorsCard: React.FC = () => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Key Economic Indicators</CardTitle>
        <CardDescription>Inflation, GDP Growth, Unemployment Rate.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* You might want to pass data to SampleLineChart if it's dynamic */}
        <SampleLineChart title="Inflation Rate Trend" />
      </CardContent>
    </Card>
  );
};