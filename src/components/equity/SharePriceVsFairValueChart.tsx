
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SharePriceVsFairValueChartProps {
  currentPrice: number;
  fairValue: number;
  undervaluedThresholdPercent?: number; // e.g., 20 for 20% below fair value
  overvaluedThresholdPercent?: number;  // e.g., 20 for 20% above fair value
  currencySymbol?: string;
  companyTicker?: string;
  companyName?: string;
}

const SharePriceVsFairValueChart: React.FC<SharePriceVsFairValueChartProps> = ({
  currentPrice,
  fairValue,
  undervaluedThresholdPercent = 20,
  overvaluedThresholdPercent = 20,
  currencySymbol = "$",
  companyTicker = "PII",
  companyName = "Example Corp"
}) => {
  let valuationStatus = "Fairly Valued";
  let percentageDiff = 0;
  let statusColor = "text-foreground"; // Default color

  if (fairValue > 0) {
    const diff = fairValue - currentPrice;
    percentageDiff = Math.abs((diff / fairValue) * 100);

    if (currentPrice < fairValue * (1 - undervaluedThresholdPercent / 200)) { // Using half threshold for "Fairly Valued" band
      valuationStatus = "Undervalued";
      statusColor = "text-emerald-500"; // Green for undervalued
    } else if (currentPrice > fairValue * (1 + overvaluedThresholdPercent / 200)) { // Using half threshold
      valuationStatus = "Overvalued";
      statusColor = "text-red-500"; // Red for overvalued
    }
  }
  
  const actualPercentageDiff = fairValue > 0 ? ((fairValue - currentPrice) / fairValue) * 100 : 0;


  // Define chart scale
  const minValue = 0;
  // Ensure chartMaxX is reasonably larger than the max of currentPrice and fairValue, and accounts for zones
  const upperFairValueLimit = fairValue * (1 + overvaluedThresholdPercent / 100);
  const chartMaxX = Math.max(currentPrice, fairValue, upperFairValueLimit) * 1.3; // Add 30% padding

  const toPercentWidth = (value: number) => (value / chartMaxX) * 100;

  const currentPriceBarWidth = toPercentWidth(currentPrice);
  const fairValueBarWidth = toPercentWidth(fairValue);

  // Zone calculations based on fair value
  const undervaluedZoneEnd = fairValue * (1 - undervaluedThresholdPercent / 100);
  const overvaluedZoneStart = fairValue * (1 + overvaluedThresholdPercent / 100);

  const undervaluedZoneWidth = toPercentWidth(undervaluedZoneEnd);
  const aboutRightZoneWidth = toPercentWidth(overvaluedZoneStart - undervaluedZoneEnd);
  const overvaluedZoneWidth = Math.max(0, 100 - undervaluedZoneWidth - aboutRightZoneWidth); // Remaining width

  const barHeight = "h-8"; // Height for current price and fair value bars

  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle className="text-xl">
          <span className="text-muted-foreground">1.1</span> Share Price vs Fair Value
        </CardTitle>
        <CardDescription>
          What is the Fair Price of {companyTicker} when looking at its future cash flows? For this estimate we use a Discounted Cash Flow model.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`text-center mb-6 ${valuationStatus === "Fairly Valued" && actualPercentageDiff !== 0 ? (actualPercentageDiff > 0 ? "text-emerald-500" : "text-red-500") : statusColor}`}>
          <p className="text-3xl font-bold">
            {Math.abs(actualPercentageDiff).toFixed(1)}%
          </p>
          <p className="text-sm">
            {actualPercentageDiff > 0 ? "Undervalued" : (actualPercentageDiff < 0 ? "Overvalued" : "Fairly Valued")}
          </p>
        </div>

        <div className="w-full mb-4">
          {/* Chart Background Zones */}
          <div className="relative h-20 mb-2"> {/* Increased height to accommodate labels better */}
            <div className="absolute top-0 left-0 h-full flex w-full rounded">
              <div
                style={{ width: `${undervaluedZoneWidth}%` }}
                className="bg-emerald-500/30 h-full"
              />
              <div
                style={{ width: `${aboutRightZoneWidth}%` }}
                className="bg-amber-500/30 h-full"
              />
              <div
                style={{ width: `${overvaluedZoneWidth}%` }}
                className="diagonal-stripes-destructive h-full"
              />
            </div>

            {/* Current Price Bar and Label */}
            <div className={`absolute top-3 left-0 ${barHeight} flex items-center`} style={{ width: '100%' }}>
              <div 
                className={`bg-emerald-400 ${barHeight} rounded-sm`} 
                style={{ width: `${currentPriceBarWidth}%` }}
              />
              <div className="ml-2 text-xs text-popover-foreground whitespace-nowrap">
                <div>Current Price</div>
                <div className="font-semibold">{currencySymbol}{currentPrice.toFixed(2)}</div>
              </div>
            </div>

            {/* Fair Value Bar and Label */}
             <div className={`absolute bottom-3 left-0 ${barHeight} flex items-center`} style={{ width: '100%' }}>
              <div 
                className={`bg-primary ${barHeight} rounded-sm`}
                style={{ width: `${fairValueBarWidth}%` }}
              />
              <div className="ml-2 text-xs text-popover-foreground whitespace-nowrap">
                <div>Fair Value</div>
                <div className="font-semibold">{currencySymbol}{fairValue.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground px-1">
          <span className="text-emerald-500 text-center" style={{ flexBasis: `${undervaluedThresholdPercent}%`}}>{undervaluedThresholdPercent}% Undervalued</span>
          <span className="text-center" style={{ flexBasis: `${100 - undervaluedThresholdPercent - overvaluedThresholdPercent}%`}}>About Right</span>
          <span className="text-red-500 text-center" style={{ flexBasis: `${overvaluedThresholdPercent}%`}}>{overvaluedThresholdPercent}% Overvalued</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SharePriceVsFairValueChart;
