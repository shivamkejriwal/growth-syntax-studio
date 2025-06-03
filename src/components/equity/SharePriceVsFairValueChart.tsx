
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
  let statusColor = "text-foreground";

  const actualPercentageDiff = fairValue > 0 ? ((currentPrice - fairValue) / fairValue) * 100 : 0;

  if (actualPercentageDiff < -undervaluedThresholdPercent) {
      valuationStatus = "Undervalued";
      statusColor = "text-emerald-500";
  } else if (actualPercentageDiff > overvaluedThresholdPercent) {
      valuationStatus = "Overvalued";
      statusColor = "text-red-500";
  } else {
      valuationStatus = "Fairly Valued";
      if (actualPercentageDiff < 0) {
        statusColor = "text-emerald-500";
      } else if (actualPercentageDiff > 0) {
        statusColor = "text-red-500";
      }
  }

  const upperFairValueLimit = fairValue * (1 + overvaluedThresholdPercent / 100);
  const chartMaxX = Math.max(currentPrice, fairValue, upperFairValueLimit) * 1.25; 

  const toPercentWidth = (value: number) => (value / chartMaxX) * 100;

  const currentPriceBarWidth = toPercentWidth(currentPrice);
  const fairValueBarWidth = toPercentWidth(fairValue);

  const undervaluedZoneEnd = fairValue * (1 - undervaluedThresholdPercent / 100);
  const overvaluedZoneStart = fairValue * (1 + overvaluedThresholdPercent / 100);

  const undervaluedZoneWidth = toPercentWidth(undervaluedZoneEnd);
  const aboutRightZoneWidth = toPercentWidth(Math.max(0, overvaluedZoneStart - undervaluedZoneEnd));
  const overvaluedZoneWidth = Math.max(0, 100 - (undervaluedZoneWidth + aboutRightZoneWidth)); 

  const barHeightClass = "h-10"; 
  const chartAreaHeightClass = "h-32";

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
            {Math.abs(actualPercentageDiff).toFixed(1)}%
          </p>
          <p className="text-sm">
            {valuationStatus}
          </p>
        </div>

        <div className="w-full mb-4">
          <div className={`relative ${chartAreaHeightClass} mb-2`}> 
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

            {/* Current Price Bar & Label */}
            <div className={`absolute top-4 left-0 w-full flex items-center`} style={{ height: 'auto' }}>
              <div
                className={`bg-emerald-400 ${barHeightClass} rounded-sm`}
                style={{ width: `${currentPriceBarWidth}%` }}
              />
              <div className="ml-2 p-2 bg-card rounded-sm shadow-md text-popover-foreground">
                <div className="text-xs">Current Price</div>
                <div className="text-sm font-semibold">{currencySymbol}{currentPrice.toFixed(2)}</div>
              </div>
            </div>

            {/* Fair Value Bar & Label */}
            <div className={`absolute bottom-4 left-0 w-full flex items-center`} style={{ height: 'auto' }}>
              <div
                className={`bg-emerald-600 ${barHeightClass} rounded-sm`} 
                style={{ width: `${fairValueBarWidth}%` }}
              />
              <div className="ml-2 p-2 bg-card rounded-sm shadow-md text-popover-foreground">
                <div className="text-xs">Fair Value</div>
                <div className="text-sm font-semibold">{currencySymbol}{fairValue.toFixed(2)}</div>
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
