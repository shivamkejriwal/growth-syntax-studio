"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCardFooter } from './ChartCardFooter';

interface SnowflakeDataPoint {
  name: string;
  value: number; // Score out of a max (e.g., 10)
  color: string;
}

const sampleData: SnowflakeDataPoint[] = [
  { name: "Health", value: 7, color: "hsl(var(--chart-2))" },
  { name: "Value", value: 5, color: "hsl(var(--chart-1))" },
  { name: "Performance", value: 8, color: "hsl(var(--chart-4))" },
  { name: "Dividend", value: 9, color: "hsl(var(--chart-5))" },
  { name: "Management", value: 6, color: "hsl(var(--chart-3))" },
];

const MAX_SCORE = 10; // Max possible score for any category

const IntroSnowflakeChart: React.FC = () => {
  const cardTitle = "Overview";
  const chartName = "overview";
  const chartSize = 440; // Increased size for a much bigger snowflake
  const centerX = chartSize / 2;
  const centerY = chartSize / 2;
  const maxRadius = chartSize / 2 - 20; // Keep padding

  const polarToCartesian = (cx: number, cy: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: cx + radius * Math.cos(angleInRadians),
      y: cy + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    const d = [
      "M", x, y,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z",
    ].join(" ");
    return d;
  };

  // If using fixed angles per segment (snowflake style)
  const anglePerSegment = 360 / sampleData.length;
  let currentAngle = 0;

  return (
    <Card className="shadow-lg w-full flex flex-col">
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4 flex-1">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Legend */}
          <div className="w-full sm:w-1/3 space-y-2">
            {sampleData.map((item) => (
              <div key={item.name} className="flex items-center">
                <span
                  className="h-4 w-4 rounded-sm mr-2 border border-border" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>

          {/* SVG Chart */}
          <div className="w-full sm:w-2/3 flex justify-center items-center">
            <svg width={chartSize} height={chartSize} viewBox={`0 0 ${chartSize} ${chartSize}`}>
              {sampleData.map((item) => {
                const radius = (item.value / MAX_SCORE) * maxRadius;
                const startAngle = currentAngle;
                const endAngle = currentAngle + anglePerSegment;
                const pathData = describeArc(centerX, centerY, radius, startAngle, endAngle);
                currentAngle = endAngle;
                return (
                  <path
                    key={item.name}
                    d={pathData}
                    fill={item.color}
                    stroke="hsl(var(--card))" 
                    strokeWidth="1" 
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </CardContent>
      <ChartCardFooter cardTitle={cardTitle} chartName={chartName} />
    </Card>
  );
};

export default IntroSnowflakeChart;
