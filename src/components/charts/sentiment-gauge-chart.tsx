"use client";

import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Helper function to map sentiment value to color and label
const getSentimentDetails = (value: number) => {
  if (value <= 20) return { color: "hsl(var(--destructive))", label: "Extreme Fear",textColor: "text-destructive" };
  if (value <= 40) return { color: "hsl(var(--destructive))", label: "Fear", textColor: "text-destructive" };
  if (value <= 60) return { color: "hsl(var(--muted-foreground))", label: "Neutral", textColor: "text-muted-foreground" };
  if (value <= 80) return { color: "hsl(var(--primary))", label: "Greed", textColor: "text-primary" };
  return { color: "hsl(var(--primary))", label: "Extreme Greed", textColor: "text-primary" };
};


export function SentimentGaugeChart() {
  const [sentimentValue, setSentimentValue] = useState<number | null>(null);

  useEffect(() => {
    // Simulate fetching data or random generation for demo
    setSentimentValue(Math.floor(Math.random() * 101));
  }, []);

  if (sentimentValue === null) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Market Sentiment (Fear & Greed Index)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[200px]">
          <p className="text-muted-foreground">Loading sentiment data...</p>
        </CardContent>
      </Card>
    );
  }
  
  const { color, label, textColor } = getSentimentDetails(sentimentValue);

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Market Sentiment (Fear & Greed Index)</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4 p-6">
        <div className="w-full max-w-xs">
          <Progress value={sentimentValue} className="h-6 [&>div]:bg-[--sentiment-color]" style={{ '--sentiment-color': color } as React.CSSProperties} />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>Fear</span>
            <span>Neutral</span>
            <span>Greed</span>
          </div>
        </div>
        <div className="text-center">
          <p className={`text-3xl font-bold ${textColor}`}>{sentimentValue}</p>
          <p className={`text-lg font-medium ${textColor}`}>{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
