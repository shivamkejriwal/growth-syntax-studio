
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
  let statusColor = "text-foreground"; // Default color

  // Positive diff means currentPrice > fairValue (Overvalued by X%)
  // Negative diff means currentPrice < fairValue (Undervalued by X%)
  const actualPercentageDiff = fairValue > 0 ? ((currentPrice - fairValue) / fairValue) * 100 : 0;

  if (actualPercentageDiff < -undervaluedThresholdPercent) { // e.g. currentPrice is more than 20% below fairValue
      valuationStatus = "Undervalued";
      statusColor = "text-emerald-500";
  } else if (actualPercentageDiff > overvaluedThresholdPercent) { // e.g. currentPrice is more than 20% above fairValue
      valuationStatus = "Overvalued";
      statusColor = "text-red-500";
  } else { // Within the thresholds, "Fairly Valued"
      valuationStatus = "Fairly Valued";
      if (actualPercentageDiff < 0) { // Still on the undervalued side of fair value
        statusColor = "text-emerald-500";
      } else if (actualPercentageDiff > 0) { // Still on the overvalued side of fair value
        statusColor = "text-red-500";
      }
      // If actualPercentageDiff is 0, it remains text-foreground
  }


  // Define chart scale
  const upperFairValueLimit = fairValue * (1 + overvaluedThresholdPercent / 100);
  const chartMaxX = Math.max(currentPrice, fairValue, upperFairValueLimit) * 1.25; 

  const toPercentWidth = (value: number) => (value / chartMaxX) * 100;

  const currentPriceBarWidth = toPercentWidth(currentPrice);
  const fairValueBarWidth = toPercentWidth(fairValue);

  // Zone calculations based on fair value
  const undervaluedZoneEnd = fairValue * (1 - undervaluedThresholdPercent / 100);
  const overvaluedZoneStart = fairValue * (1 + overvaluedThresholdPercent / 100);

  const undervaluedZoneWidth = toPercentWidth(undervaluedZoneEnd);
  const aboutRightZoneWidth = toPercentWidth(Math.max(0, overvaluedZoneStart - undervaluedZoneEnd));
  const overvaluedZoneWidth = Math.max(0, 100 - (undervaluedZoneWidth + aboutRightZoneWidth)); 

  const barHeight = "h-8"; // Height for current price and fair value bars

  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle className="text-xl">
          <span className="text-muted-foreground mr-1">1.1</span>Share Price vs Fair Value
        </CardTitle>
        <CardDescription>
          What is the Fair Price of {companyTicker} when looking at its future cash flows? For this estimate we use a Discounted Cash Flow model.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`text-center mb-6 ${statusColor}`}>
          <p className="text-3xl font-bold">
            {/* Display absolute value for percentage, sign is indicated by status text */}
            {Math.abs(actualPercentageDiff).toFixed(1)}%
          </p>
          <p className="text-sm">
            {valuationStatus}
          </p>
        </div>

        <div className="w-full mb-4">
          <div className="relative h-24 mb-2"> 
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

            <div className={`absolute top-2 left-0 ${barHeight} flex items-center`} style={{ width: '100%' }}>
              <div
                className={`bg-emerald-400 ${barHeight} rounded-sm`}
                style={{ width: `${currentPriceBarWidth}%` }}
              />
              <div className="ml-2 text-xs text-popover-foreground whitespace-nowrap">
                <div>Current Price</div>
                <div className="font-semibold">{currencySymbol}{currentPrice.toFixed(2)}</div>
              </div>
            </div>

             <div className={`absolute bottom-2 left-0 ${barHeight} flex items-center`} style={{ width: '100%' }}>
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
          <span className="text-emerald-500 text-center" style={{ flexBasis: `${undervaluedZoneWidth > 0 ? undervaluedThresholdPercent : 0}%`}}>{undervaluedThresholdPercent}% Undervalued</span>
          <span className="text-center" style={{ flexBasis: `${aboutRightZoneWidth > 0 ? (100 - undervaluedThresholdPercent - overvaluedThresholdPercent) : 0}%`}}>About Right</span>
          <span className="text-red-500 text-center" style={{ flexBasis: `${overvaluedZoneWidth > 0 ? overvaluedThresholdPercent : 0}%`}}>{overvaluedThresholdPercent}% Overvalued</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SharePriceVsFairValueChart;

