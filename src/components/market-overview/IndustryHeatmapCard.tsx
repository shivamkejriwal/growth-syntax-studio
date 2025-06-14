"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const IndustryHeatmapCard: React.FC = () => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Industry Heatmap</CardTitle>
        <CardDescription>Visual overview of industry performance (placeholder).</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center bg-muted/30 rounded-md">
        <p className="text-muted-foreground">Industry Heatmap Placeholder</p>
      </CardContent>
    </Card>
  );
};